// src/types/Product.ts
export interface BaseProduct {
  id: number
  name: string
  brand: string
  pricePerUnit: number
  pricePerBox?: number
  images: string[]
  category: 'cigars' | 'accessories'
  inStock: boolean
  rating: number
  description: string
}

export interface Product extends BaseProduct {
  category: 'cigars'
  country: string
  strength: 'Легкая' | 'Средняя' | 'Полная'
  format: string
  ringGauge: number
  length: number
  smokingTime: 'до 15 минут' | 'до 20 минут' | 'до 30 минут' | 'до 45 минут' | 'до 60 минут'
  flavorNotes: string[]
  flavorFamily:
    | 'Древесные'
    | 'Пряные'
    | 'Цитрусовые'
    | 'Цветочные'
    | 'Ореховые'
    | 'Фруктовые'
    | 'Землистые'
    | 'Сладкие'
}

export interface Accessory extends BaseProduct {
  category: 'accessories'
  type: 'Cutter' | 'Lighter' | 'Humidor' | 'Ashtray' | 'Case'
  material: string
}

export type ProductImage = string | undefined
