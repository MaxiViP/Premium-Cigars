export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatStrength = (strength: string): string => {
  const strengthMap: { [key: string]: string } = {
    Mild: 'Легкая',
    Medium: 'Средняя',
    Full: 'Полная',
    Легкая: 'Легкая',
    Средняя: 'Средняя',
    Полная: 'Полная',
  }
  return strengthMap[strength] || strength
}
