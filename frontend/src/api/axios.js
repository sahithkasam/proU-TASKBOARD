// src/api/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
