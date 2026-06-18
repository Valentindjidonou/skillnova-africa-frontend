import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skillnova-africa-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('skillup_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
