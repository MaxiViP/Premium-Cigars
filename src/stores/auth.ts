import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    setToken(token) {
      this.token = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('pc_access_token', token);
    },
    async loadFromStorage() {
      const t = localStorage.getItem('pc_access_token');
      if (t) {
        this.setToken(t);
        try { await this.fetchMe(); } catch(e){ console.warn('fetchMe failed', e); }
      }
    },
    async fetchMe() {
      const res = await axios.get('/user/me');
      this.user = res.data;
      return this.user;
    },
    logout() {
      this.user = null;
      this.token = null;
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('pc_access_token');
      router.push('/');
    }
  }
});
