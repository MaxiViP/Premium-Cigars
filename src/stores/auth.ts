// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import router from '@/router'
import type { AxiosError } from 'axios'
interface CartItem {
  product:
    | string
    | {
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
    refreshToken: null as string | null, // Добавляем refresh token
    isLoading: false,
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
    // ========================
    // УПРАВЛЕНИЕ ТОКЕНАМИ
    // ========================

    setTokens(tokens: { access: string; refresh?: string }) {
      this.token = tokens.access
      this.refreshToken = tokens.refresh || null

      localStorage.setItem('accessToken', tokens.access)
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh)
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    },

    setToken(token: string) {
      this.setTokens({ access: token })
    },

    // ========================
    // ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ
    // ========================

    async fetchMe() {
      try {
        this.isLoading = true
        const res = await axios.get('/user/me')
        this.user = res.data.user || res.data
        console.log('User data loaded:', this.user)
        return this.user
      } catch (error) {
        const err = error as AxiosError
        console.error('fetchMe error:', err.response?.data || err.message)

        // Если ошибка авторизации - выходим
        if (err.response?.status === 401) {
          this.logout()
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async loadFromStorage() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!accessToken) return false

      this.token = accessToken
      this.refreshToken = refreshToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      try {
        await this.fetchMe()
        return true
      } catch (error) {
        console.error('Failed to load user from storage:', error)
        this.logout()
        return false
      }
    },

    // ========================
    // OAuth УСПЕШНАЯ АВТОРИЗАЦИЯ
    // ========================

    // В stores/auth.ts обновите OAuth обработку
    // В методе handleOAuthSuccess
    async handleOAuthSuccess(accessToken: string, refreshToken?: string) {
      try {
        console.log('🔑 Handling OAuth success with tokens')

        this.setTokens({ access: accessToken, refresh: refreshToken })
        await this.fetchMe()

        console.log('✅ OAuth login successful, user:', this.user?.email)

        // Отправляем сообщение об успехе в opener
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'oauth-success',
              access: accessToken,
              refresh: refreshToken,
            },
            window.location.origin,
          )
        }

        router.push('/profile')
        return true
      } catch (error) {
        console.error('❌ OAuth success handling failed:', error)

        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'oauth-failed',
              error: 'Authentication failed',
            },
            window.location.origin,
          )
        }

        this.logout()
        return false
      }
    },

    // ========================
    // ИЗБРАННОЕ
    // ========================

    toggleFavorite(productId: string | number) {
      const idStr = String(productId)

      if (this.user?.favorites.includes(idStr)) {
        return this.removeFromFavorites(idStr)
      } else {
        return this.addToFavorites(idStr)
      }
    },

    async addToFavorites(productId: string | number) {
      const idStr = String(productId)
      try {
        await axios.post(`/user/favorites/${idStr}`)

        if (this.user && !this.user.favorites.includes(idStr)) {
          this.user.favorites.push(idStr)
        }
      } catch (error) {
        console.error('Failed to add to favorites:', error)
        throw error
      }
    },

    async removeFromFavorites(productId: string | number) {
      const idStr = String(productId)
      try {
        await axios.delete(`/user/favorites/${idStr}`)

        if (this.user) {
          this.user.favorites = this.user.favorites.filter((f) => String(f) !== idStr)
        }
      } catch (error) {
        console.error('Failed to remove from favorites:', error)
        throw error
      }
    },

    // ========================
    // КОРЗИНА
    // ========================

    updateCartQty(productId: string | number, qty: number) {
      return this.updateCartItem(productId, qty)
    },

    async addToCart(productId: string | number, qty: number = 1) {
      const idStr = String(productId)
      try {
        await axios.post('/user/cart', { productId: idStr, qty })
        await this.fetchMe() // обновляем актуальные данные с сервера
      } catch (error) {
        console.error('Failed to add to cart:', error)
        throw error
      }
    },

    async removeFromCart(productId: string | number) {
      const idStr = String(productId)
      try {
        await axios.delete(`/user/cart/${idStr}`)
        await this.fetchMe()
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        throw error
      }
    },

    async updateCartItem(productId: string | number, qty: number) {
      const idStr = String(productId)
      try {
        if (qty <= 0) {
          await this.removeFromCart(idStr)
        } else {
          await axios.put(`/user/cart/${idStr}`, { qty })
          await this.fetchMe()
        }
      } catch (error) {
        console.error('Failed to update cart:', error)
        throw error
      }
    },

    // ========================
    // ВЫХОД
    // ========================

    async logout() {
      // 1. Немедленно очищаем состояние
      this.user = null
      this.token = null
      this.refreshToken = null

      // 2. Очищаем localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // 3. Очищаем заголовки
      delete axios.defaults.headers.common['Authorization']

      // 4. Пытаемся уведомить сервер (неблокирующе)
      axios.post('/auth/logout').catch(() => {})

      // 5. Редирект и обновление
      router.push('/')
      setTimeout(() => window.location.reload(), 100)
    }, // ========================
    // ОБНОВЛЕНИЕ ТОКЕНА
    // ========================

    async refreshTokens() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const response = await axios.post('/auth/refresh', {
          refreshToken: this.refreshToken,
        })

        const { access, refresh } = response.data.tokens
        this.setTokens({ access, refresh })

        return true
      } catch (error) {
        console.error('Token refresh failed:', error)
        this.logout()
        return false
      }
    },
  },
})
