// frontend/src/api/api.js
import axios from 'axios';

const base =
  process.env.REACT_APP_API_URL || // CRA
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || // Vite
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' }
});

// attach JWT from localStorage automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
}, (err) => Promise.reject(err));

export default api;
