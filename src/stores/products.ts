import { defineStore } from 'pinia'
import type { Product, Accessory } from '@/types/Product'
import productsData from '@/data/products.json'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: productsData.products as (Product | Accessory)[],
  }),

  getters: {
    cigars: (state) => state.products.filter((p) => p.category === 'cigars'),
    accessories: (state) => state.products.filter((p) => p.category === 'accessories'),
    featuredProducts: (state) => state.products.slice(0, 4),
    getProductById: (state) => (id: number) => {
      return state.products.find((product) => product.id === id)
    },
  },

  actions: {
    searchProducts(query: string) {
      if (!query) return this.products
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()),
      )
    },
  },
})
