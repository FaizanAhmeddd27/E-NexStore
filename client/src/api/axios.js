import axios from 'axios';

// Ensure the API base URL always points to the server's /api namespace
// Prefer a runtime-detected origin when deployed (avoid using a dev localhost baked into the build)
const envUrl = import.meta.env.VITE_API_URL;
let raw;
if (typeof window !== 'undefined') {
  // If the build-time env points to localhost but the site is running remotely,
  // prefer the page origin (this avoids the browser trying to reach the developer's localhost).
  const envIsLocalhost = typeof envUrl === 'string' && /(^https?:\/\/)?(localhost|127\.0\.0\.1)/i.test(envUrl);
  const siteIsLocalhost = /(^localhost$|^127\.0\.0\.1$)/.test(window.location.hostname);

  raw = envUrl ?? window.location.origin;
  if (envIsLocalhost && !siteIsLocalhost) {
    console.warn('[axios] VITE_API_URL points to localhost but site is remote — switching to window.location.origin');
    raw = window.location.origin;
  }
} else {
  // Server-side / build-time fallback
  raw = envUrl ?? 'http://localhost:5000';
}

const API_BASE = String(raw).replace(/\/$/, '') + (String(raw).endsWith('/api') ? '' : '/api');

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // Safety: don't let requests hang forever — backend (Render free tier) may sleep and take long to wake
  timeout: 10000, // 10 seconds
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
  (response) => response,
  (error) => {
    // Detect common timeout signal from XHR/fetch adapter
    if (error?.code === 'ECONNABORTED' || (error?.message && error.message.includes('timeout'))) {
      console.warn('[axios] request timed out:', error.config?.url);
      // mark the error for callers so UI can show a friendly retry/fallback
      error.isTimeout = true;
    }

    if (error.response?.status === 401) {
      console.warn('API 401 Unauthorized:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;