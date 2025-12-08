import axios from "axios";

// your deployed backend (Render)
const BASE_URL = "https://worklink-070f.onrender.com/api";

console.log("Using API baseURL:", BASE_URL); // debug

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
