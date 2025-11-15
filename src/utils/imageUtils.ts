export const getProductImageUrl = (imageName: string | undefined): string => {
  if (!imageName) {
    return '/src/assets/images/default-product.jpg'
  }

  // Если это URL, возвращаем как есть
  if (imageName.startsWith('http')) {
    return imageName
  }

  // Иначе используем локальные изображения
  return `/src/assets/images/${imageName}`
}

export const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/src/assets/images/default-product.jpg'
}
