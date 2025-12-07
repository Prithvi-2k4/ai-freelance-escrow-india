// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://worklink-070f.onrender.com/api', // include /api if used
  withCredentials: false // set true only if you use cookies/auth
});

export default api;
