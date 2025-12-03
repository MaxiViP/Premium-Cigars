// src/composables/useProductActions.ts
import { computed, ComputedRef } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Локальные типы для этой композиции
type FavoriteItem = string | number | { id?: string | number; _id?: string | number }

interface CartItem {
  product: string | { id?: string | number; _id?: string | number }
  qty: number
}

// Определяем возвращаемый тип явно
interface UseProductActionsReturn {
  isLiked: ComputedRef<boolean>
  isInCart: ComputedRef<boolean>
  toggleLike: (customId?: number | string) => void
  addToCart: (customId?: number | string, quantity?: number) => void
  removeFromCart: (customId?: number | string) => void
  updateCartQuantity: (customId: number | string, newQty: number) => void
  auth: ReturnType<typeof useAuthStore>
}

export function useProductActions(productId?: number | string): UseProductActionsReturn {
  const auth = useAuthStore()

  // Вычисляемое свойство для проверки, находится ли товар в избранном
  const isLiked: ComputedRef<boolean> = computed(() => {
    if (!auth.isAuthenticated || !auth.user || !productId) return false

    const idToCheck = String(productId)
    const favorites = auth.user.favorites || []

    return favorites.some((favorite: FavoriteItem) => {
      if (typeof favorite === 'string') {
        return favorite === idToCheck
      }
      if (typeof favorite === 'number') {
        return String(favorite) === idToCheck
      }
      if (typeof favorite === 'object' && favorite !== null) {
        const favId = String(favorite.id || favorite._id || '')
        return favId === idToCheck
      }
      return false
    })
  })

  // Вычисляемое свойство для проверки, находится ли товар в корзине
  const isInCart: ComputedRef<boolean> = computed(() => {
    if (!auth.isAuthenticated || !auth.user || !productId) return false

    const idToCheck = String(productId)
    const cartItems = auth.user.cart || []

    return cartItems.some((item: CartItem) => {
      const product = item.product
      if (typeof product === 'string') {
        return product === idToCheck
      }
      if (typeof product === 'object' && product !== null) {
        const prodId = String(product.id || product._id || '')
        return prodId === idToCheck
      }
      return false
    })
  })

  // Базовые функции
  const toggleLike = (customId?: number | string): void => {
    const idToUse = customId ? String(customId) : productId ? String(productId) : ''

    if (!idToUse) {
      console.error('Product ID is required for toggleLike')
      return
    }

    if (!auth.isAuthenticated) {
      alert('Войдите в аккаунт')
      return
    }

    const currentlyLiked = isLiked.value

    if (currentlyLiked) {
      auth.removeFromFavorites(idToUse)
    } else {
      auth.addToFavorites(idToUse)
    }
  }

  const addToCart = (customId?: number | string, quantity: number = 1): void => {
    const idToUse = customId ? String(customId) : productId ? String(productId) : ''

    if (!idToUse) {
      console.error('Product ID is required for addToCart')
      return
    }

    if (!auth.isAuthenticated) {
      alert('Войдите в аккаунт')
      return
    }

    auth.addToCart(idToUse, quantity)
  }

  const removeFromCart = (customId?: number | string): void => {
    const idToUse = customId ? String(customId) : productId ? String(productId) : ''

    if (!idToUse) {
      console.error('Product ID is required for removeFromCart')
      return
    }

    auth.removeFromCart(idToUse)
  }

  const updateCartQuantity = (customId: number | string, newQty: number): void => {
    const idToUse = String(customId)

    if (newQty <= 0) {
      removeFromCart(idToUse)
    } else {
      auth.updateCartItem(idToUse, newQty)
    }
  }

  return {
    // Вычисляемые свойства
    isLiked,
    isInCart,

    // Функции действий
    toggleLike,
    addToCart,
    removeFromCart,
    updateCartQuantity,

    // Ссылка на хранилище (для доступа к другим свойствам если нужно)
    auth,
  }
}
