import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { useAuthStore } from './auth';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({ list: [] }),
  actions: {
    async fetch() {
      const auth = useAuthStore();
      if (!auth.token) return;
      await auth.fetchMe();
      this.list = auth.user?.favorites || [];
    },
    async toggle(productId) {
      const auth = useAuthStore();
      if (!auth.token) return;
      const exists = auth.user?.favorites?.some(f => f._id === productId);
      if (!exists) await axios.post(`/user/favorites/${productId}`);
      else await axios.delete(`/user/favorites/${productId}`);
      await auth.fetchMe();
      this.list = auth.user?.favorites || [];
    }
  }
});
