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
    refreshToken: null as string | null,
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
    // ОБНОВЛЕННЫЙ МЕТОД ВХОДА
    // ========================
    async login(email: string, password: string): Promise<User | null> {
      try {
        this.isLoading = true

        // ПРОВЕРКА СУПЕР-АДМИНА
        if (email === 'admin@example.com' && password === 'admin') {
          console.log('🔐 Вход как супер-администратор')

          const superAdmin: User = {
            _id: 'super_admin_1',
            email: 'admin@example.com',
            name: 'Администратор',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            favorites: ['1', '2', '3', '4', '5'],
            cart: [
              { product: '1', qty: 2 },
              { product: '2', qty: 1 },
              { product: '3', qty: 3 },
            ],
            createdAt: new Date().toISOString(),
          }

          this.user = superAdmin
          const testToken = 'super_admin_token_' + Date.now()
          this.setToken(testToken)
          localStorage.setItem('superAdmin', 'true')
          localStorage.setItem('user', JSON.stringify(superAdmin))

          console.log('✅ Супер-администратор авторизован')
          return this.user
        }

        // Пытаемся обычную авторизацию
        try {
          const res = await axios.post('/auth/login', { email, password })

          if (res.data.tokens) {
            this.setTokens(res.data.tokens)
            this.user = res.data.user
            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.removeItem('superAdmin')
            return this.user
          }

          if (res.data.token) {
            this.setToken(res.data.token)
            this.user = res.data.user
            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.removeItem('superAdmin')
            return this.user
          }

          throw new Error('Invalid response format')
        } catch (apiError) {
          // Если API недоступно и это попытка входа супер-админа
          if (email === 'admin@example.com' && password === 'admin') {
            console.warn('API недоступно, создаем локального супер-админа')

            const offlineSuperAdmin: User = {
              _id: 'super_admin_offline',
              email: 'admin@example.com',
              name: 'Администратор (оффлайн)',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              favorites: ['1', '2', '3'],
              cart: [
                { product: '1', qty: 1 },
                { product: '2', qty: 2 },
              ],
              createdAt: new Date().toISOString(),
            }

            this.user = offlineSuperAdmin
            const testToken = 'offline_super_admin_token_' + Date.now()
            this.setToken(testToken)
            localStorage.setItem('superAdmin', 'true')
            localStorage.setItem('user', JSON.stringify(offlineSuperAdmin))

            console.log('✅ Супер-администратор авторизован (оффлайн режим)')
            return this.user
          }

          throw apiError // Пробрасываем ошибку для обычных пользователей
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    // ========================
    // ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ (исправленный)
    // ========================
    async fetchMe(): Promise<User> {
      try {
        this.isLoading = true
        const res = await axios.get('/user/me')

        // Извлекаем данные пользователя из ответа
        const userData = res.data.user || res.data

        if (!userData || !userData._id) {
          throw new Error('Invalid user data received')
        }

        this.user = userData as User
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

    // ========================
    // ЗАГРУЗКА ИЗ ХРАНИЛИЩА (исправленная)
    // ========================
    async loadFromStorage(): Promise<boolean> {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const superAdmin = localStorage.getItem('superAdmin')
      const savedUser = localStorage.getItem('user')

      // Если это супер-админ
      if (superAdmin === 'true' && savedUser) {
        try {
          const userData = JSON.parse(savedUser)

          if (!userData || !userData._id) {
            throw new Error('Invalid saved user data')
          }

          this.user = userData as User
          this.token = 'super_admin_token_restored'
          this.refreshToken = null

          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

          console.log('🔄 Сессия супер-администратора восстановлена')
          return true
        } catch (error) {
          console.error('Ошибка восстановления сессии супер-админа:', error)
          localStorage.removeItem('superAdmin')
          return false
        }
      }

      // Обычная загрузка
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
    // ВЫХОД (исправленный)
    // ========================
    async logout(): Promise<void> {
      // Немедленно очищаем состояние
      this.user = null
      this.token = null
      this.refreshToken = null

      // Очищаем localStorage (включая супер-админа)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('superAdmin')

      // Очищаем заголовки
      delete axios.defaults.headers.common['Authorization']

      // Если это был супер-админ, не вызываем API логаут
      const wasSuperAdmin = localStorage.getItem('superAdmin') === 'true'
      if (!wasSuperAdmin) {
        // Пытаемся уведомить сервер (неблокирующе)
        axios.post('/auth/logout').catch(() => {})
      }

      // Редирект и обновление
      router.push('/')
      setTimeout(() => window.location.reload(), 100)
    },

    // ========================
    // ОСТАЛЬНЫЕ МЕТОДЫ (оставляем без изменений)
    // ========================
    setTokens(tokens: { access: string; refresh?: string }): void {
      this.token = tokens.access
      this.refreshToken = tokens.refresh || null

      localStorage.setItem('accessToken', tokens.access)
      if (tokens.refresh) {
        localStorage.setItem('refreshToken', tokens.refresh)
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    },

    setToken(token: string): void {
      this.setTokens({ access: token })
    },

    async handleOAuthSuccess(accessToken: string, refreshToken?: string): Promise<boolean> {
      try {
        console.log('🔑 Handling OAuth success with tokens')

        this.setTokens({ access: accessToken, refresh: refreshToken })
        await this.fetchMe()

        console.log('✅ OAuth login successful, user:', this.user?.email)

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
    toggleFavorite(productId: string | number): void {
      const idStr = String(productId)

      if (this.user?.favorites.includes(idStr)) {
        this.removeFromFavorites(idStr)
      } else {
        this.addToFavorites(idStr)
      }
    },

    async addToFavorites(productId: string | number): Promise<void> {
      const idStr = String(productId)
      try {
        // Если это супер-админ - обновляем локально
        if (this.user?._id === 'super_admin_1') {
          if (this.user && !this.user.favorites.includes(idStr)) {
            this.user.favorites.push(idStr)
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          await axios.post(`/user/favorites/${idStr}`)

          if (this.user && !this.user.favorites.includes(idStr)) {
            this.user.favorites.push(idStr)
          }
        }
      } catch (error) {
        console.error('Failed to add to favorites:', error)
        throw error
      }
    },

    async removeFromFavorites(productId: string | number): Promise<void> {
      const idStr = String(productId)
      try {
        // Если это супер-админ - обновляем локально
        if (this.user?._id === 'super_admin_1') {
          if (this.user) {
            this.user.favorites = this.user.favorites.filter((f) => String(f) !== idStr)
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          await axios.delete(`/user/favorites/${idStr}`)

          if (this.user) {
            this.user.favorites = this.user.favorites.filter((f) => String(f) !== idStr)
          }
        }
      } catch (error) {
        console.error('Failed to remove from favorites:', error)
        throw error
      }
    },

    // ========================
    // КОРЗИНА
    // ========================
    updateCartQty(productId: string | number, qty: number): void {
      this.updateCartItem(productId, qty)
    },

    async addToCart(productId: string | number, qty: number = 1): Promise<void> {
      const idStr = String(productId)
      try {
        // Если это супер-админ - обновляем локально
        if (this.user?._id === 'super_admin_1') {
          if (this.user) {
            const existingItem = this.user.cart.find((item) => {
              const itemId =
                typeof item.product === 'string'
                  ? item.product
                  : item.product._id || item.product.id
              return String(itemId) === idStr
            })

            if (existingItem) {
              existingItem.qty += qty
            } else {
              this.user.cart.push({ product: idStr, qty })
            }
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          await axios.post('/user/cart', { productId: idStr, qty })
          await this.fetchMe()
        }
      } catch (error) {
        console.error('Failed to add to cart:', error)
        throw error
      }
    },

    async removeFromCart(productId: string | number): Promise<void> {
      const idStr = String(productId)
      try {
        // Если это супер-админ - обновляем локально
        if (this.user?._id === 'super_admin_1') {
          if (this.user) {
            this.user.cart = this.user.cart.filter((item) => {
              const itemId =
                typeof item.product === 'string'
                  ? item.product
                  : item.product._id || item.product.id
              return String(itemId) !== idStr
            })
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          await axios.delete(`/user/cart/${idStr}`)
          await this.fetchMe()
        }
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        throw error
      }
    },

    async updateCartItem(productId: string | number, qty: number): Promise<void> {
      const idStr = String(productId)
      try {
        // Если это супер-админ - обновляем локально
        if (this.user?._id === 'super_admin_1') {
          if (qty <= 0) {
            await this.removeFromCart(idStr)
          } else {
            if (this.user) {
              const existingItem = this.user.cart.find((item) => {
                const itemId =
                  typeof item.product === 'string'
                    ? item.product
                    : item.product._id || item.product.id
                return String(itemId) === idStr
              })

              if (existingItem) {
                existingItem.qty = qty
              } else {
                this.user.cart.push({ product: idStr, qty })
              }
              localStorage.setItem('user', JSON.stringify(this.user))
            }
          }
        } else {
          if (qty <= 0) {
            await this.removeFromCart(idStr)
          } else {
            await axios.put(`/user/cart/${idStr}`, { qty })
            await this.fetchMe()
          }
        }
      } catch (error) {
        console.error('Failed to update cart:', error)
        throw error
      }
    },

    // ========================
    // ОЧИСТКА КОРЗИНЫ
    // ========================
    async clearCart(): Promise<void> {
      try {
        // Если это супер-админ - очищаем локально
        if (this.user?._id === 'super_admin_1') {
          if (this.user) {
            this.user.cart = []
            localStorage.setItem('user', JSON.stringify(this.user))
          }
        } else {
          await axios.delete('/user/cart')
          await this.fetchMe()
        }
      } catch (error) {
        console.error('Failed to clear cart:', error)
        throw error
      }
    },

    // ========================
    // ОБНОВЛЕНИЕ ТОКЕНА
    // ========================
    async refreshTokens(): Promise<boolean> {
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

    // ========================
    // ДОПОЛНИТЕЛЬНЫЙ МЕТОД ДЛЯ СУПЕР-АДМИНА
    // ========================
    isSuperAdmin(): boolean {
      return this.user?._id === 'super_admin_1' || localStorage.getItem('superAdmin') === 'true'
    },
  },
})
