// src/stores/catalog.ts
import { defineStore } from 'pinia'
import productsData from '@/data/products.json'
import type { Accessory as AccessoryType } from '@/types/Product'
import type { Product, Cigar } from '@/types/Product'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    products: productsData.products as Product[],
  }),

  getters: {
    cigars: (state): Cigar[] => state.products.filter((p) => p.category === 'cigars') as Cigar[],

    accessories: (state): AccessoryType[] =>
      state.products.filter((p) => p.category === 'accessories') as AccessoryType[],
  },
})
