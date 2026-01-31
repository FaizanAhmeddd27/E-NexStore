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

axiosInstance.interceptors.request.use(
  (config) => {
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