import axios from 'axios';

// Ensure the API base URL always points to the server's /api namespace
const raw = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const API_BASE = raw.replace(/\/$/, '') + (raw.endsWith('/api') ? '' : '/api');

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// If a token was persisted (for browsers that block third-party cookies), attach it to requests
const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (savedToken) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

axiosInstance.interceptors.request.use(
  (config) => {
    // Debug: log base and URL
    console.log('[axios] baseURL:', axiosInstance.defaults.baseURL, 'request url:', config.url);

    // If request URL is relative and neither baseURL nor url already include /api, add it
    const isRelative = typeof config.url === 'string' && config.url.startsWith('/');
    const baseHasApi = String(axiosInstance.defaults.baseURL || '').endsWith('/api');
    const urlHasApi = typeof config.url === 'string' && config.url.startsWith('/api');

    if (isRelative && !baseHasApi && !urlHasApi) {
      config.url = '/api' + config.url;
      console.log('[axios] normalized request url to:', config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('API 401 Unauthorized:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;