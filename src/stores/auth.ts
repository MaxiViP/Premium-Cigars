// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import router from '@/router'

interface CartItem {
  product: string | {
    _id?: string
    id?: number
    name: string
    price: number
    image?: string
    title?: string
  }
  qty: number
}

interface User {
  _id: string
  email?: string
  phone?: string
  name?: string
  avatar?: string
  googleId?: string
  yandexId?: string
  favorites: string[]
  cart: CartItem[]
  createdAt: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
    cartTotalItems: (state): number =>
      state.user?.cart.reduce((sum, item) => sum + item.qty, 0) ?? 0,
    cartTotalPrice: (state): number =>
      state.user?.cart.reduce((sum, item) => {
        const price = typeof item.product === 'object' ? item.product.price : 0
        return sum + price * item.qty
      }, 0) ?? 0,
  },

  actions: {
    setTokens(tokens: { access: string; refresh?: string }) {
      this.token = tokens.access
      localStorage.setItem('accessToken', tokens.access)
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh)
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    },

    async fetchMe() {
      try {
        const res = await axios.get('/user/me')
        this.user = res.data.user || res.data
        return this.user
      } catch (err: any) {
        console.error('fetchMe error:', err.response?.data || err.message)
        this.logout()
        throw err
      }
    },

    async loadFromStorage() {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      this.token = accessToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      try {
        await this.fetchMe()
      } catch {
        this.logout()
      }
    },

    // === КЛЮЧЕВЫЕ ИСПРАВЛЕНИЯ ===

    async addToFavorites(productId: string | number) {
      const idStr = String(productId)
      await axios.post(`/user/favorites/${idStr}`)

      if (this.user && !this.user.favorites.includes(idStr)) {
        this.user.favorites.push(idStr)  // сохраняем как string
      }
    },

    async removeFromFavorites(productId: string | number) {
      const idStr = String(productId)
      await axios.delete(`/user/favorites/${idStr}`)

      if (this.user) {
        this.user.favorites = this.user.favorites.filter(f => String(f) !== idStr)
      }
    },

    async addToCart(productId: string | number, qty: number = 1) {
      const idStr = String(productId)
      await axios.post('/user/cart', { productId: idStr, qty })
      await this.fetchMe()  // обновляем актуальные данные с сервера
    },

    async removeFromCart(productId: string | number) {
      const idStr = String(productId)
      await axios.delete(`/user/cart/${idStr}`)
      await this.fetchMe()
    },

    async updateCartItem(productId: string | number, qty: number) {
      const idStr = String(productId)
      if (qty <= 0) {
        await this.removeFromCart(idStr)
      } else {
        await axios.put(`/user/cart/${idStr}`, { qty })
        await this.fetchMe()
      }
    },

    logout() {
      this.user = null
      this.token = null
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/')
    },
  },
})
