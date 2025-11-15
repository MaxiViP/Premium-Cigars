export interface Product {
  id: number
  name: string
  brand: string
  country: string
  strength: 'Легкая' | 'Средняя' | 'Полная'
  size: string
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
  description: string
  price: number
  images: string[]
  category: 'cigars' | 'accessories'
  inStock: boolean
  rating: number
}

export interface Accessory extends Product {
  type: 'Cutter' | 'Lighter' | 'Humidor' | 'Ashtray' | 'Case'
  material: string
}

export type ProductImage = string | undefined
