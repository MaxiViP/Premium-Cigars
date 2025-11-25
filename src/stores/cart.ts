import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  actions: {
    setLocal(items){ this.items = items; },
    async add(productId, qty = 1) {
      const auth = useAuthStore();
      if (!auth.token) {
        const found = this.items.find(i => i.product._id === productId);
        if (found) found.qty += qty; else this.items.push({ product: { _id: productId }, qty });
        return;
      }
      await axios.post('/user/cart', { productId, qty });
      await auth.fetchMe();
      this.items = auth.user?.cart || [];
    },
    async remove(productId) {
      const auth = useAuthStore();
      if (!auth.token) {
        this.items = this.items.filter(i => i.product._id !== productId);
        return;
      }
      await axios.delete(`/user/cart/${productId}`);
      await auth.fetchMe();
      this.items = auth.user?.cart || [];
    }
  }
});
