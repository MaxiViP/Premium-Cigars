// src/composables/useCountdownActions.ts
import { ref } from 'vue'

interface CountdownData {
  value: number | string
  timerId?: ReturnType<typeof setTimeout>
  resetting?: boolean
}

export function useCountdownActions() {
  const countdowns = ref<Record<number, CountdownData>>({})
  const cartCountdowns = ref<Record<number, CountdownData>>({})

  // Проверяем, идет ли отсчет
  const isCounting = (productId: number, type: 'favorite' | 'cart' = 'favorite'): boolean => {
    const countdownsStore = type === 'cart' ? cartCountdowns : countdowns
    const countdown = countdownsStore.value[productId]
    if (!countdown) return false
    return countdown.value !== '✕' && typeof countdown.value === 'number' && countdown.value > 0
  }

  // Получаем значение отсчета
  const getCountdownValue = (
    productId: number,
    type: 'favorite' | 'cart' = 'favorite',
  ): number | string => {
    const countdownsStore = type === 'cart' ? cartCountdowns : countdowns
    const countdown = countdownsStore.value[productId]
    return countdown ? countdown.value : 0
  }

  // Обработчик отсчета с колбэком
  const handleCountdown = (
    productId: number,
    callback: () => void,
    type: 'favorite' | 'cart' = 'favorite',
  ): void => {
    const countdownsStore = type === 'cart' ? cartCountdowns : countdowns
    const countdown = countdownsStore.value[productId]

    // Если уже идет отсчет
    if (isCounting(productId, type) && countdown) {
      // Сбрасываем отсчет
      if (countdown.timerId) {
        clearTimeout(countdown.timerId)
      }

      // Анимация сброса
      countdownsStore.value[productId] = {
        value: '✕',
        resetting: true,
      }

      setTimeout(() => {
        delete countdownsStore.value[productId]
      }, 300)

      return
    }

    // Начинаем отсчет с 3
    let count = 3
    countdownsStore.value[productId] = { value: count }

    const timerId = setInterval(() => {
      count--

      if (count > 0) {
        countdownsStore.value[productId] = { value: count, timerId }
      } else {
        clearInterval(timerId)
        delete countdownsStore.value[productId]

        // Выполняем колбэк
        callback()
      }
    }, 1000)

    // Сохраняем timerId
    countdownsStore.value[productId] = { value: count, timerId }
  }

  return {
    isCounting,
    getCountdownValue,
    handleCountdown,
    countdowns,
    cartCountdowns,
  }
}
