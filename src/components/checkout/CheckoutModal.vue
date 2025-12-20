<template>
  <div v-if="isOpen" class="checkout-modal-overlay" @click.self="close">
    <div class="checkout-modal-content" @click.stop>
      <!-- Заголовок -->
      <div class="checkout-header">
        <h2>Оформление заказа</h2>
        <button class="close-modal-btn" @click="close" aria-label="Закрыть">×</button>
      </div>

      <!-- Основное содержимое -->
      <div class="checkout-body">
        <!-- Левая колонка: данные заказа -->
        <div class="order-details">
          <h3>Детали заказа</h3>

          <div class="order-summary">
            <div class="summary-item">
              <span>Товаров:</span>
              <span>{{ orderData.itemsCount }} шт.</span>
            </div>
            <div class="summary-item">
              <span>Общая сумма:</span>
              <span class="order-total">{{ formatPrice(orderData.total) }}</span>
            </div>
            <div class="summary-item">
              <span>Доставка:</span>
              <span>Бесплатно</span>
            </div>
          </div>

          <!-- Список товаров -->
          <div class="order-products">
            <h4>Состав заказа:</h4>
            <div v-for="item in orderData.products" :key="item.product.id" class="order-product-item">
              <div class="product-info">
                <img
                  :src="getProductImage(item.product.images?.[0])"
                  :alt="item.product.name"
                  class="product-thumbnail"
                />
                <div>
                  <p class="product-name">{{ item.product.name }}</p>
                  <p class="product-qty">{{ item.qty }} × {{ formatPrice(item.product.pricePerUnit) }}</p>
                </div>
              </div>
              <p class="product-total">{{ formatPrice(item.product.pricePerUnit * item.qty) }}</p>
            </div>
          </div>
        </div>

        <!-- Правая колонка: оплата -->
        <div class="payment-section">
          <h3>Способ оплаты</h3>

          <!-- Выбор способа оплаты -->
          <div class="payment-methods">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              :class="['payment-method', { active: selectedMethod === method.id }]"
              @click="selectPaymentMethod(method.id)"
            >
              <div class="method-icon">
                <component :is="method.icon" v-if="method.icon" />
                <span v-else>{{ method.name.slice(0, 2) }}</span>
              </div>
              <div class="method-info">
                <p class="method-name">{{ method.name }}</p>
                <p class="method-desc">{{ method.description }}</p>
              </div>
              <div class="method-radio">
                <div class="radio-dot"></div>
              </div>
            </div>
          </div>

          <!-- QR-код и информация для оплаты -->
          <div class="qr-section">
            <div class="qr-header">
              <h4>Оплата по QR-коду</h4>
              <p>Отсканируйте QR-код для перевода</p>
            </div>

            <div class="qr-container">
              <!-- Заглушка QR-кода (в реальности генерируем через библиотеку) -->
              <div class="qr-placeholder">
                <div class="qr-code">
                  <!-- Псевдо QR-код -->
                  <div class="qr-pattern">
                    <div v-for="i in 25" :key="i" class="qr-cell"></div>
                  </div>
                  <div class="qr-amount">{{ formatPrice(orderData.total) }}</div>
                  <p class="qr-hint">Сканируйте для оплаты</p>
                </div>
              </div>

              <div class="qr-details">
                <div class="qr-detail-item">
                  <span>Сумма:</span>
                  <span class="qr-total">{{ formatPrice(orderData.total) }}</span>
                </div>
                <div class="qr-detail-item">
                  <span>Номер заказа:</span>
                  <span class="order-number">#{{ orderData.orderNumber }}</span>
                </div>
                <div class="qr-detail-item">
                  <span>Дата:</span>
                  <span>{{ formattedDate }}</span>
                </div>
                <div class="qr-detail-item">
                  <span>Статус:</span>
                  <span class="status-pending">Ожидает оплаты</span>
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="payment-actions">
              <button
                @click="confirmPayment"
                class="btn-pay"
                :disabled="isProcessing"
              >
                <span v-if="!isProcessing">Подтвердить оплату</span>
                <span v-else class="spinner"></span>
              </button>

              <button @click="copyPaymentDetails" class="btn-secondary">
                Скопировать данные
              </button>

              <p class="payment-note">
                После оплаты заказ будет автоматически подтверждён.
                При возникновении проблем свяжитесь с поддержкой.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Уведомление -->
    <transition name="fade">
      <div v-if="notification" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types/Product'

// Иконки (можно заменить на реальные компоненты)
const SbpIcon = { template: '<div class="icon-sbp">СБП</div>' }
const CardIcon = { template: '<div class="icon-card">💳</div>' }
const YooMoneyIcon = { template: '<div class="icon-yoomoney">Ю</div>' }
const TinkoffIcon = { template: '<div class="icon-tinkoff">Т</div>' }
const SberIcon = { template: '<div class="icon-sber">С</div>' }

interface Props {
  isOpen: boolean
  orderData: {
    total: number
    itemsCount: number
    products: Array<{
      product: Product
      qty: number
    }>
    orderNumber: string
  }
}

interface Emits {
  (e: 'close'): void
  (e: 'payment-success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Состояния
const selectedMethod = ref<string>('sbp')
const isProcessing = ref(false)
const notification = ref<{type: 'success' | 'error', message: string} | null>(null)

// Способы оплаты (актуальные для РФ на 2025)
const paymentMethods = ref([
  {
    id: 'sbp',
    name: 'СБП (Система быстрых платежей)',
    description: 'Оплата по номеру телефона через банк',
    icon: SbpIcon
  },
  {
    id: 'card',
    name: 'Банковская карта',
    description: 'Visa, Mastercard, Мир',
    icon: CardIcon
  },
  {
    id: 'yoomoney',
    name: 'ЮMoney',
    description: 'Бывшие Яндекс.Деньги',
    icon: YooMoneyIcon
  },
  {
    id: 'tinkoff',
    name: 'Тинькофф',
    description: 'Эквайринг Тинькофф',
    icon: TinkoffIcon
  },
  {
    id: 'sber',
    name: 'Сбербанк Онлайн',
    description: 'Оплата через Сбербанк',
    icon: SberIcon
  }
])

// Форматированная дата
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Методы
const getProductImage = (src: string | undefined): string => {
  if (!src) return '/images/products/default.webp'
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `/images/products/${src}`
}

const selectPaymentMethod = (methodId: string) => {
  selectedMethod.value = methodId
  showNotification('Способ оплаты изменён', 'success')
}

const confirmPayment = async () => {
  isProcessing.value = true

  // Имитация оплаты
  setTimeout(() => {
    isProcessing.value = false
    showNotification('Оплата успешно проведена!', 'success')

    // Через 1.5 секунды закрываем с событием успеха
    setTimeout(() => {
      emit('payment-success')
      close()
    }, 1500)
  }, 2000)
}

const copyPaymentDetails = () => {
  const details = `Заказ #${props.orderData.orderNumber}\nСумма: ${formatPrice(props.orderData.total)}`

  navigator.clipboard.writeText(details)
    .then(() => showNotification('Данные скопированы', 'success'))
    .catch(() => showNotification('Ошибка копирования', 'error'))
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const close = () => {
  emit('close')
}

// При открытии генерируем QR-код (заглушка)
onMounted(() => {
  if (props.isOpen) {
    // В реальном приложении здесь генерируем QR через библиотеку
    // Например: new QRCode(document.getElementById("qrcode"), paymentUrl)
    console.log('Генерация QR-кода для суммы:', props.orderData.total)
  }
})
</script>

<style scoped>
.checkout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.checkout-modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #eaeaea;
}

.checkout-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.checkout-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 32px;
}

@media (max-width: 768px) {
  .checkout-body {
    grid-template-columns: 1fr;
  }
}

/* Левая колонка: данные заказа */
.order-details h3,
.payment-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.order-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaeaea;
}

.summary-item:last-child {
  border-bottom: none;
}

.order-total {
  font-weight: 700;
  font-size: 18px;
  color: #2e7d32;
}

/* Список товаров */
.order-products {
  max-height: 300px;
  overflow-y: auto;
}

.order-product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.product-name {
  margin: 0 0 4px 0;
  font-weight: 500;
}

.product-qty {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.product-total {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

/* Правая колонка: оплата */
.payment-methods {
  margin-bottom: 24px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #eaeaea;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method:hover {
  border-color: #1976d2;
  background: #f8f9fa;
}

.payment-method.active {
  border-color: #1976d2;
  background: #e3f2fd;
}

.method-icon {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 600;
}

.method-info {
  flex: 1;
}

.method-name {
  margin: 0 0 4px 0;
  font-weight: 500;
}

.method-desc {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.method-radio {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-method.active .method-radio {
  border-color: #1976d2;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #1976d2;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.payment-method.active .radio-dot {
  opacity: 1;
}

/* QR-секция */
.qr-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.qr-header {
  text-align: center;
  margin-bottom: 20px;
}

.qr-header h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.qr-header p {
  margin: 0;
  color: #666;
}

.qr-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .qr-container {
    flex-direction: column;
  }
}

.qr-placeholder {
  flex-shrink: 0;
}

.qr-code {
  width: 200px;
  height: 200px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qr-pattern {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.qr-cell {
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 2px;
}

.qr-cell:nth-child(odd) {
  background: #1976d2;
}

.qr-amount {
  font-size: 18px;
  font-weight: 700;
  margin: 8px 0;
  color: #2e7d32;
}

.qr-hint {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.qr-details {
  flex: 1;
}

.qr-detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eaeaea;
}

.qr-detail-item:last-child {
  border-bottom: none;
}

.qr-total {
  font-weight: 700;
  color: #2e7d32;
}

.order-number {
  font-family: monospace;
  font-weight: 600;
}

.status-pending {
  color: #f57c00;
  font-weight: 600;
}

/* Кнопки действий */
.payment-actions {
  margin-top: 24px;
}

.btn-pay {
  width: 100%;
  padding: 16px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 12px;
}

.btn-pay:hover:not(:disabled) {
  background: #1b5e20;
}

.btn-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: white;
  color: #1976d2;
  border: 2px solid #1976d2;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e3f2fd;
}

.payment-note {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;
}

/* Уведомления */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #2e7d32;
}

.notification.error {
  background: #d32f2f;
}

/* Анимации */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Иконки способов оплаты */
.icon-sbp {
  background: linear-gradient(135deg, #00b4ff, #0066ff);
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
}

.icon-card {
  font-size: 20px;
}

.icon-yoomoney {
  background: #ffcc00;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
}

.icon-tinkoff {
  background: #ffdd2d;
  color: #333;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
}

.icon-sber {
  background: #21a038;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
}
</style>
