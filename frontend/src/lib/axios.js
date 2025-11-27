// src/lib/axios.js
// Enhanced axios instance with interceptors
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clean up and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.match(/\/(login|register)/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
