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
  length: number
  ringGauge: number
  country: string
  format: string
  strength: 'Легкая' | 'Средняя' | 'Полная' | 'Средняя-Полная' | 'Мягкая-Средняя'
  smokingTime:
    | 'до 15 минут'
    | 'до 20 минут'
    | 'до 30 минут'
    | 'до 45 минут'
    | 'до 60 минут'
    | 'до 75 минут'
    | '60-80 минут'
    | '60-90 минут'
    | '90+ минут'

  flavorFamily:
    | 'Древесные'
    | 'Пряные'
    | 'Цитрусовые'
    | 'Цветочные'
    | 'Ореховые'
    | 'Фруктовые'
    | 'Землистые'
    | 'Сладкие'
    | 'Сливочные'
    | 'Кофейные'
  flavorNotes: string[]
  size: string
}

// Сигары
export interface Cigar extends BaseProduct {
  category: 'cigars'
  country: string
  strength: 'Легкая' | 'Средняя' | 'Полная' | 'Средняя-Полная' | 'Мягкая-Средняя'
  size: string
  format: string
  ringGauge: number
  length: number
  smokingTime:
    | 'до 15 минут'
    | 'до 20 минут'
    | 'до 30 минут'
    | 'до 45 минут'
    | 'до 60 минут'
    | 'до 75 минут'
    | '60-80 минут'
    | '60-90 минут'
    | '90+ минут'
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
    | 'Сливочные'
    | 'Кофейные'
}

// Аксессуары
export interface Accessory extends BaseProduct {
  category: 'accessories'
  type: 'Cutter' | 'Lighter' | 'Humidor' | 'Ashtray' | 'Case'
  material: string
}

// Любой товар
export type Product = Cigar | Accessory

// Элемент корзины — только ID + количество
export interface CartItem {
  product: string
  qty: number
}

export type ProductImage = string | undefined

export const isCigar = (product: Product): product is Cigar => product.category === 'cigars'
export const isAccessory = (product: Product): product is Accessory =>
  product.category === 'accessories'
