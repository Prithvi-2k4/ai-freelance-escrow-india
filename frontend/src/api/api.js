import axios from 'axios';

const base = process.env.REACT_APP_API || window.REACT_APP_API || ''; // set in env
const api = axios.create({
  baseURL: base.endsWith('/') ? base + 'api' : base + '/api',
  timeout: 10000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
