import axios from 'axios';

const DEFAULT_BASE = 'https://worklink-070f.onrender.com'; // correct URL

const base =
  process.env.REACT_APP_API ||
  window.REACT_APP_API ||
  process.env.REACT_APP_API_URL ||
  DEFAULT_BASE;

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

console.log('Using API baseURL =', api.defaults.baseURL); // debug log
export default api;
