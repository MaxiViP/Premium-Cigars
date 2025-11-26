import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useAuthStore } from './auth'

interface CartProduct {
  _id: string
  id?: number
  name: string
  price: number
  image?: string
  title?: string
}

interface CartItem {
  product: string | CartProduct
  qty: number
}

// Тип для ответа API пользователя
export interface UserCartResponse {
  cart: CartItem[]
  // другие поля пользователя если нужно
}

// Тип для продукта в локальной корзине (без авторизации)
interface LocalCartProduct {
  _id: string
  name?: string
  price?: number
  image?: string
  title?: string
}

interface LocalCartItem {
  product: string | LocalCartProduct
  qty: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as LocalCartItem[],
  }),

  getters: {
    totalItems: (state): number => state.items.reduce((sum, item) => sum + item.qty, 0),

    totalPrice: (state): number =>
      state.items.reduce((sum, item) => {
        if (typeof item.product === 'object' && item.product.price) {
          return sum + item.product.price * item.qty
        }
        return sum
      }, 0),
  },

  actions: {
    setLocal(items: LocalCartItem[]) {
      this.items = items
    },

    async add(productId: string, qty: number = 1) {
      const auth = useAuthStore()
      if (!auth.token) {
        const found = this.items.find((i) =>
          typeof i.product === 'string' ? i.product === productId : i.product._id === productId,
        )
        if (found) {
          found.qty += qty
        } else {
          this.items.push({ product: { _id: productId }, qty })
        }
        return
      }
      await axios.post('/user/cart', { productId, qty })
      await auth.fetchMe()
      // Приводим тип к локальному
      this.items = (auth.user?.cart || []) as LocalCartItem[]
    },

    async remove(productId: string) {
      const auth = useAuthStore()
      if (!auth.token) {
        this.items = this.items.filter((i) =>
          typeof i.product === 'string' ? i.product !== productId : i.product._id !== productId,
        )
        return
      }
      await axios.delete(`/user/cart/${productId}`)
      await auth.fetchMe()
      this.items = (auth.user?.cart || []) as LocalCartItem[]
    },

    async update(productId: string, qty: number) {
      const auth = useAuthStore()
      if (!auth.token) {
        const found = this.items.find((i) =>
          typeof i.product === 'string' ? i.product === productId : i.product._id === productId,
        )
        if (found) {
          if (qty <= 0) {
            await this.remove(productId)
          } else {
            found.qty = qty
          }
        }
        return
      }

      if (qty <= 0) {
        await this.remove(productId)
      } else {
        await axios.put(`/user/cart/${productId}`, { qty })
        await auth.fetchMe()
        this.items = (auth.user?.cart || []) as LocalCartItem[]
      }
    },

    clear() {
      this.items = []
    },
  },
})
