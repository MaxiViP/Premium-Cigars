import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const auth = useAuthStore()

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    list: [] as string[], // Явно указали тип
  }),
  actions: {
    async toggle(productId: string | number) {
      const idStr = String(productId)
      const exists = auth.user?.favorites?.includes(idStr)

      if (exists) {
        await auth.removeFromFavorites(idStr)
      } else {
        await auth.addToFavorites(idStr)
      }

      this.list = auth.user?.favorites || []
    },
  },
})
