import axios from 'axios';

const DEFAULT_BASE = 'https://worklink-070f.onrender.com'; // correct URL

// use env var if present, otherwise fallback
const base =
  process.env.REACT_APP_API ||
  window.REACT_APP_API ||
  process.env.REACT_APP_API_URL || // in case you use VITE/other name
  DEFAULT_BASE;

// normalize (no trailing slash)
const cleanBase = base.replace(/\/+$/,'');

const api = axios.create({
  baseURL: `${cleanBase}/api`,
  timeout: 10000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
