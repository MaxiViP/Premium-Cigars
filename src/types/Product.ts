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

/** Сигары — все поля, которые у тебя были */
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

/** Аксессуары */
export interface Accessory extends BaseProduct {
  category: 'accessories'
  type: 'Cutter' | 'Lighter' | 'Humidor' | 'Ashtray' | 'Case'
  material: string
  ringGauge: number
  length: number
}

/** Главный тип — любой товар */
export type Product = Cigar | Accessory

/** Вспомогательные типы */
export type ProductImage = string | undefined

/** Утилиты для удобной проверки типа в шаблонах и коде */
export const isCigar = (product: Product): product is Cigar => product.category === 'cigars'

export const isAccessory = (product: Product): product is Accessory =>
  product.category === 'accessories'
