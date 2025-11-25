// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import router from '@/router'

interface CartItem {
  product: {
    _id: string
    name: string
    price: number
    image?: string
    title?: string
    // другие поля товара
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
  favorites: string[] | any[]
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
      state.user?.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0) ?? 0,
  },

  actions: {
    // Сохраняем токены и добавляем заголовок Authorization
    setTokens(tokens: { access: string; refresh?: string }) {
      this.token = tokens.access
      localStorage.setItem('accessToken', tokens.access)
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh)
      }

      // Важно: добавляем Bearer-токен во все запросы axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    },

    // Загружаем данные пользователя
    async fetchMe() {
      try {
        const res = await axios.get('/user/me')
        this.user = res.data.user || res.data // на случай, если бэк возвращает { user: ... }
        return this.user
      } catch (err: any) {
        console.error('fetchMe error:', err.response?.data || err.message)
        this.logout()
        throw err
      }
    },

    // Загрузка при старте приложения
    async loadFromStorage() {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      this.token = accessToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      try {
        await this.fetchMe()
      } catch {
        // Токен просрочен или недействителен — очищаем
        this.logout()
      }
    },

    // Избранное
    async addToFavorites(productId: string) {
      await axios.post(`/user/favorites/${productId}`)
      if (this.user && !this.user.favorites.some((f: any) => (f._id || f) === productId)) {
        this.user.favorites.push(productId)
      }
    },

    async removeFromFavorites(productId: string) {
      await axios.delete(`/user/favorites/${productId}`)
      if (this.user) {
        this.user.favorites = this.user.favorites.filter((f: any) => (f._id || f) !== productId)
      }
    },

    // Корзина
    async addToCart(productId: string, qty: number = 1) {
      await axios.post('/user/cart', { productId, qty })
      await this.fetchMe() // Лучше перезагрузить данные с сервера
    },

    async removeFromCart(productId: string) {
      await axios.delete(`/user/cart/${productId}`)
      await this.fetchMe()
    },

    async updateCartItem(productId: string, qty: number) {
      if (qty <= 0) {
        await this.removeFromCart(productId)
      } else {
        await axios.put(`/user/cart/${productId}`, { qty })
        await this.fetchMe()
      }
    },

    // Выход
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
