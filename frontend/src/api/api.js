// frontend/src/api/api.js
import axios from 'axios';

const base = process.env.REACT_APP_API || 'http://localhost:5000';
const api = axios.create({ baseURL: base + '/api' });

// Attach token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  return cfg;
});

export default api;
