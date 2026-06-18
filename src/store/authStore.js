import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('skillup_token'),
  isLoading: false,
  error: null,

  register: async (nom, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { nom, email, password });
      localStorage.setItem('skillup_token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur inscription', isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('skillup_token', data.token);
      set({ user: data.user, token: data.token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur connexion', isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem('skillup_token');
    }
  },

  logout: () => {
    localStorage.removeItem('skillup_token');
    set({ user: null, token: null });
    window.location.href = '/';
  },
}));

export default useAuthStore;