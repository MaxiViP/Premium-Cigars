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
