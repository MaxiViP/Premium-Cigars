<template>
  <div class="profile-container">
    <!-- Заголовок -->
    <header class="profile-header">
      <h1>Личный кабинет</h1>
      <button @click="logout" class="logout-btn">Выйти</button>
    </header>

    <!-- Карточка пользователя -->
    <div class="user-card">
      <div class="avatar-wrapper">
        <img :src="auth.user?.avatar || 'default-avatar.svg'" alt="avatar" class="avatar" />
      </div>
      <div class="user-info">
        <h2>{{ username }}</h2>
        <p class="email">{{ auth.user?.email || 'Email не указан' }}</p>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ cartItemsCount }}</div>
        <div class="stat-label">товаров в корзине</div>
        <div class="stat-price">{{ formatPrice(cartTotal) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ favoriteProducts.length }}</div>
        <div class="stat-label">товаров в избранном</div>
        <div class="stat-price">{{ formatPrice(favoritesTotal) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalItems }}</div>
        <div class="stat-label">всего товаров</div>
        <div class="stat-price">{{ formatPrice(totalPrice) }}</div>
      </div>
    </div>

    <!-- Избранное -->
    <section class="section">
      <h3>Избранное</h3>

      <div v-if="favoriteProducts.length === 0" class="empty-state">
        <p>Вы ещё ничего не добавили в избранное</p>
      </div>

      <div v-else class="favorites-grid">
        <div
          v-for="product in favoriteProducts"
          :key="product.id"
          class="favorite-card"
          role="link"
          tabindex="0"
          @click="goToProduct(product.id)"
          @keydown.enter.prevent="goToProduct(product.id)"
          @keydown.space.prevent="goToProduct(product.id)"
        >
          <img
            :src="getProductImage(product.images?.[0])"
            :alt="product.name"
            class="favorite-img"
          />

          <!-- Кнопка удаления в правом верхнем углу -->
          <button
            @click.stop="handleRemoveClick(product.id)"
            class="remove-favorite-btn"
            :class="{ counting: isFavoriteCounting(product.id) }"
          >
            <!-- Крестик по умолчанию -->
            <span v-if="!isFavoriteCounting(product.id)" class="cross-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </span>

            <!-- Отсчет при активации -->
            <span v-else class="countdown">
              {{ getFavoriteCountdownValue(product.id) }}
            </span>
          </button>

          <div class="favorite-info">
            <h4 class="favorite-name">{{ product.name }}</h4>
            <p class="price">{{ formatPrice(product.pricePerUnit) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Корзина -->
    <section class="section">
      <h3>Корзина</h3>

      <div v-if="cartProducts.length === 0" class="empty-state">
        <p>Корзина пуста — самое время выбрать лучшие сигары</p>
        <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
      </div>

      <div v-else class="cart-wrapper">
        <!-- Список товаров -->
        <div class="cart-items">
          <div v-for="item in cartProducts" :key="item.product.id" class="cart-item">
            <!-- Изображение и название -->
            <div class="cart-item-main">
              <div
                class="cart-image-wrapper"
                @click="goToProduct(item.product.id)"
                role="link"
                tabindex="0"
                @keydown.enter.prevent="goToProduct(item.product.id)"
                @keydown.space.prevent="goToProduct(item.product.id)"
              >
                <img
                  :src="getProductImage(item.product.images?.[0])"
                  :alt="item.product.name"
                  class="cart-img"
                />
              </div>

              <div class="cart-info">
                <h4
                  class="cart-name"
                  @click="goToProduct(item.product.id)"
                  role="link"
                  tabindex="0"
                  @keydown.enter.prevent="goToProduct(item.product.id)"
                  @keydown.space.prevent="goToProduct(item.product.id)"
                >
                  {{ item.product.name }}
                </h4>
                <p class="cart-price">{{ formatPrice(item.product.pricePerUnit) }}</p>
              </div>
            </div>

            <!-- Управление и итоги -->
            <div class="cart-item-controls">
              <!-- Количество -->
              <div class="cart-qty-section">
                <div class="qty-controls">
                  <button
                    @click.stop="updateCartQuantity(item.product.id, item.qty - 1)"
                    class="qty-btn"
                    :disabled="item.qty <= 1"
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span class="qty">{{ item.qty }}</span>
                  <button
                    @click.stop="updateCartQuantity(item.product.id, item.qty + 1)"
                    class="qty-btn"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>

                <p class="item-total">
                  {{ formatPrice(item.product.pricePerUnit * item.qty) }}
                </p>
              </div>

              <!-- Кнопка удаления -->
              <button
                @click.stop="handleCartCountdown(item.product.id)"
                class="remove-btn"
                :class="{ counting: isCartCounting(item.product.id) }"
                aria-label="Удалить товар из корзины"
              >
                <span v-if="!isCartCounting(item.product.id)" class="remove-text"> Удалить </span>
                <span v-else class="cart-countdown">
                  {{ getCartCountdownValue(item.product.id) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Итоговая сумма -->
        <div class="cart-summary">
          <div class="summary-details">
            <div class="summary-row">
              <span>Товаров:</span>
              <span>{{ cartItemsCount }} шт.</span>
            </div>
            <div class="summary-row">
              <span>Общая сумма:</span>
              <span class="total-amount">{{ formatPrice(cartTotal) }}</span>
            </div>
          </div>

          <div class="summary-actions">
            <button @click="openCheckout" class="btn-primary checkout-btn">
              <span>Оформить заказ</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Добавьте модальное окно в конец компонента -->
            <CheckoutModal
              :isOpen="showCheckoutModal"
              :orderData="orderData"
              @close="showCheckoutModal = false"
              @payment-success="handlePaymentSuccess"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useProductActions } from '@/composables/useProductActions'
import { useCountdownActions } from '@/composables/useCountdownActions'
import type { Product } from '@/types/Product'
import { ref } from 'vue'
import CheckoutModal from '@/components/checkout/CheckoutModal.vue'

// Добавляем после импортов
const showCheckoutModal = ref(false)

// Данные для заказа
const orderData = ref({
  total: 0,
  itemsCount: 0,
  products: [] as { product: Product; qty: number }[], // ← вот это
  orderNumber: '',
})
// Функция открытия модального окна
const openCheckout = () => {
  // Генерируем номер заказа
  const orderNumber = 'ORD-' + Date.now().toString().slice(-8)

  orderData.value = {
    total: cartTotal.value,
    itemsCount: cartItemsCount.value,
    products: cartProducts.value,
    orderNumber,
  }

  showCheckoutModal.value = true
}

// Обработчик успешной оплаты
const handlePaymentSuccess = () => {
  // Очищаем корзину после успешной оплаты
  auth.clearCart()
  showNotification('Заказ успешно оплачен!', 'success')
}

// Функция уведомления
const showNotification = (message: string, type = 'success') => {
  // Можно использовать toast-библиотеку или свой компонент
  alert(`${type === 'success' ? '✅' : '❌'} ${message}`)
}

const auth = useAuthStore()
const catalog = useCatalogStore()
const { products } = storeToRefs(catalog)
const router = useRouter()

// Используем композиции
const { toggleLike, updateCartQuantity } = useProductActions()

// Создаем экземпляр для работы с отсчетами
const countdownActions = useCountdownActions()

// Создаем обертки с правильными типами для избранного
const isFavoriteCounting = (productId: number) => countdownActions.isCounting(productId, 'favorite')
const getFavoriteCountdownValue = (productId: number) =>
  countdownActions.getCountdownValue(productId, 'favorite')

// Создаем обертки с правильными типами для корзины
const isCartCounting = (productId: number) => countdownActions.isCounting(productId, 'cart')
const getCartCountdownValue = (productId: number) =>
  countdownActions.getCountdownValue(productId, 'cart')

// Обработчик для избранного
const handleRemoveClick = (productId: number): void => {
  countdownActions.handleCountdown(
    productId,
    () => {
      toggleLike(productId)
    },
    'favorite',
  )
}

// Обработчик для корзины
const handleCartCountdown = (productId: number): void => {
  countdownActions.handleCountdown(
    productId,
    () => {
      updateCartQuantity(productId, 0)
    },
    'cart',
  )
}

/* -----------------------------
   СТАТИСТИКА
--------------------------------*/

// Количество товаров в корзине
const cartItemsCount = computed(() => {
  return cartProducts.value.reduce((sum, item) => sum + item.qty, 0)
})

// Общая сумма избранного
const favoritesTotal = computed(() => {
  return favoriteProducts.value.reduce((sum, product) => sum + product.pricePerUnit, 0)
})

// Общее количество товаров (корзина + избранное)
const totalItems = computed(() => {
  return cartItemsCount.value + favoriteProducts.value.length
})

// Общая сумма (корзина + избранное)
const totalPrice = computed(() => {
  return cartTotal.value + favoritesTotal.value
})

/* -----------------------------
   ПЕРЕХОД К ТОВАРУ
--------------------------------*/
const goToProduct = (productId: number | string) => {
  router.push(`/product/${productId}`)
}

/* -----------------------------
   ВЫХОД ИЗ АККАУНТА
--------------------------------*/
const logout = async (): Promise<void> => {
  try {
    console.log('Logging out...')
    await auth.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/* -----------------------------
   USERNAME
--------------------------------*/
const username = computed(() => auth.user?.name || auth.user?.email?.split('@')[0] || 'Гость')

/* -----------------------------
   ФУНКЦИЯ ДЛЯ ИЗОБРАЖЕНИЙ
--------------------------------*/
const getProductImage = (src: string | undefined): string => {
  if (!src) return '/images/products/default.webp'
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `/images/products/${src}`
}

/* -----------------------------
   ИЗБРАННОЕ
--------------------------------*/
interface FavoriteItem {
  id?: string | number
  _id?: string | number
}

const favoriteProducts = computed<Product[]>(() => {
  const favoriteIds = auth.user?.favorites || []
  return favoriteIds
    .map((id: FavoriteItem | string | number) => {
      let productId: number
      if (typeof id === 'string') {
        productId = Number(id)
      } else if (typeof id === 'number') {
        productId = id
      } else {
        const idValue = id.id || id._id || id
        productId = typeof idValue === 'string' ? Number(idValue) : Number(idValue)
      }
      return products.value.find((p) => p.id === productId)
    })
    .filter((p): p is Product => Boolean(p))
})

// Отслеживаем изменения избранного
watch(
  favoriteProducts,
  (newFavorites) => {
    console.log('Favorite products changed:', newFavorites)
  },
  { deep: true },
)

/* -----------------------------
   КОРЗИНА
--------------------------------*/
interface CartItem {
  product: string | { id?: string | number; _id?: string | number }
  qty: number
}

const cartProducts = computed(() => {
  const cartItems = auth.user?.cart || ([] as CartItem[])
  return cartItems
    .map((item) => {
      let productId: number
      if (typeof item.product === 'string') {
        productId = Number(item.product)
      } else {
        const idValue = item.product.id || item.product._id || item.product
        productId = typeof idValue === 'string' ? Number(idValue) : Number(idValue)
      }
      const product = products.value.find((p) => p.id === productId)
      return product ? { product, qty: item.qty } : null
    })
    .filter(Boolean) as { product: Product; qty: number }[]
})

/* -----------------------------
   ОБЩАЯ СУММА КОРЗИНЫ
--------------------------------*/
const cartTotal = computed(() => {
  return cartProducts.value.reduce((total, item) => {
    return total + item.product.pricePerUnit * item.qty
  }, 0)
})

/* -----------------------------
   ФОРМАТ ЦЕНЫ
--------------------------------*/
const formatPrice = (value: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value)
</script>

<style scoped>
/* ============================================
   БАЗОВЫЕ СТИЛИ И КОНТЕЙНЕРЫ
============================================ */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px 40px;
  min-height: 100vh;
}

/* ============================================
   ЗАГОЛОВОК ПРОФИЛЯ
============================================ */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.profile-header h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.5px;
  color: var(--primary-color, #b8860b);
  margin: 0;
  flex: 1;
  min-width: min-content;
}

.logout-btn {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: clamp(0.6rem, 3vw, 0.8rem) clamp(1rem, 4vw, 1.4rem);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.85rem, 3vw, 1rem);
  white-space: nowrap;
  font-weight: 600;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.25);
}

/* ============================================
   КАРТОЧКА ПОЛЬЗОВАТЕЛЯ
============================================ */
.user-card {
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  border-radius: 20px;
  padding: clamp(1.75rem, 5vw, 2.25rem);
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 4vw, 2.25rem);
  margin-bottom: 2.5rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b8860b, #d4af37);
  border-radius: 20px 20px 0 0;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: clamp(85px, 22vw, 130px);
  height: clamp(85px, 22vw, 130px);
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #b8860b;
  background: #1a1a1a center/cover no-repeat;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.03);
  border-color: #d4af37;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info h2 {
  font-size: clamp(1.6rem, 4.5vw, 2.2rem);
  margin: 0 0 0.5rem;
  color: #b8860b;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
}

.email {
  margin: 0.4rem 0 0;
  color: #aaa;
  font-size: clamp(0.95rem, 3vw, 1.05rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.email::before {
  content: '✉️';
  font-size: 0.9em;
}

/* ============================================
   СТАТИСТИКА
============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
  gap: clamp(0.85rem, 2.5vw, 1.25rem);
  margin-bottom: 3.5rem;
}

.stat-card {
  background: #222;
  padding: clamp(1.25rem, 3.5vw, 1.75rem);
  border-radius: 18px;
  text-align: center;
  border: 1px solid #333;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(184, 134, 11, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.stat-card:hover::before {
  transform: translateX(100%);
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: #b8860b;
  box-shadow: 0 12px 28px rgba(184, 134, 11, 0.15);
}

.stat-value {
  font-size: clamp(1.9rem, 5.5vw, 2.8rem);
  font-weight: 800;
  color: #b8860b;
  line-height: 1;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  color: #aaa;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  margin: 0.5rem 0 0.75rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.stat-price {
  font-size: clamp(1.1rem, 3.5vw, 1.4rem);
  font-weight: 700;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  display: inline-block;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

/* ============================================
   СЕКЦИИ
============================================ */
.section {
  margin-bottom: clamp(2.5rem, 6vw, 3.5rem);
  position: relative;
}

.section h3 {
  font-size: clamp(1.6rem, 4.5vw, 2rem);
  margin-bottom: 2rem;
  color: #b8860b;
  position: relative;
  display: inline-block;
  font-weight: 600;
  padding-bottom: 0.75rem;
}

.section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 70px;
  height: 4px;
  background: linear-gradient(90deg, #b8860b, #d4af37);
  border-radius: 2px;
}

/* Пустые состояния */
.empty-state {
  text-align: center;
  padding: clamp(2.5rem, 6vw, 4rem) 1.5rem;
  color: #888;
  font-style: italic;
  background: rgba(42, 42, 42, 0.5);
  border-radius: 16px;
  border: 1px dashed #444;
  margin-top: 1rem;
}

.empty-state p {
  margin-bottom: 1.75rem;
  font-size: clamp(1rem, 3vw, 1.1rem);
  line-height: 1.6;
  color: #aaa;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(45deg, #b8860b, #d4af37);
  color: black;
  padding: clamp(0.9rem, 3.5vw, 1.2rem) clamp(1.75rem, 5vw, 2.5rem);
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  font-size: clamp(0.9rem, 3vw, 1.05rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 24px rgba(184, 134, 11, 0.35);
}

/* ============================================
   ИЗБРАННОЕ
============================================ */
.favorites-grid {
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
  grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
}

.favorite-card {
  display: flex;
  flex-direction: column;
  /* background: #fff; */
  padding: clamp(0.75rem, 2vw, 1rem);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
}

.favorite-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b8860b, #d4af37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.favorite-card:hover::before {
  opacity: 1;
}

.favorite-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #b8860b;
}

.favorite-img {
  width: 100%;
  height: auto;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  transition: transform 0.4s ease;
}

.favorite-card:hover .favorite-img {
  transform: scale(1.05);
}

.favorite-info {
  margin-top: 0.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-right: 40px;
  position: relative;
  min-height: 80px;
}

.favorite-name {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  margin: 0 0 0.5rem;
  line-height: 1.4;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
}

.price {
  font-size: clamp(1rem, 3vw, 1.15rem);
  font-weight: 700;
  color: #b8860b;
  margin: 0.25rem 0 0.5rem;
  background: rgba(184, 134, 11, 0.1);
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  align-self: flex-start;
}

/* Кнопка удаления из избранного */
.remove-favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  padding: 0;
  margin: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.remove-favorite-btn:hover {
  background: #fff;
  border-color: #ff4444;
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.25);
}

.remove-favorite-btn:hover .cross-icon svg {
  stroke: #ff4444;
  transform: scale(1.1);
}

.cross-icon svg {
  width: 16px;
  height: 16px;
  stroke: #666;
  transition: all 0.3s ease;
}

/* Состояние отсчета для избранного */
.remove-favorite-btn.counting {
  background: #ff4444;
  border-color: #ff4444;
  color: white;
  animation: pulseFavorite 1.2s infinite;
  width: 38px;
  height: 38px;
  transform: scale(1);
}

@keyframes pulseFavorite {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  }
}

.remove-favorite-btn.counting .countdown {
  font-size: 15px;
  font-weight: 700;
  animation: countdown 0.3s ease;
}

/* ============================================
   КОРЗИНА - ОПТИМИЗИРОВАННАЯ СТРУКТУРА
============================================ */
.cart-items {
  background: #1e1e1e;
  border-radius: 20px;
  padding: clamp(1.25rem, 3.5vw, 1.75rem);
  border: 1px solid #333;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
  color: var(--text-super-light);
}

/* ОСНОВНАЯ СТРУКТУРА КАРТОЧКИ ТОВАРА */
.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Два ровных столбца */
  gap: clamp(1.5rem, 4vw, 2rem);
  padding: clamp(1rem, 2.5vw, 1.5rem);
  border-bottom: 1px solid #333;
  align-items: center;
  transition: background-color 0.3s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
}

.cart-item:last-child {
  border-bottom: none;
}

/* ЛЕВЫЙ СТОЛБЕЦ - Основная информация о товаре */
.cart-item-main {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  align-items: center;
  min-height: 100px;
}

.cart-img {
  width: clamp(80px, 20vw, 200px);
  height: clamp(80px, 30vw, 200px);
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid #444;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.cart-img:hover {
  border-color: #b8860b;
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 8px 20px rgba(184, 134, 11, 0.3);
}

.cart-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.cart-name {
  font-size: clamp(1.1rem, 3.5vw, 1.4rem);
  margin: 0 0 0.5rem;
  color: #b8860b;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-name:hover {
  color: #d4af37;
  text-decoration: underline;
}

.cart-price {
  font-size: clamp(1.2rem, 3.5vw, 1.5rem);
}

.item-price {
  font-size: clamp(1.2rem, 3.5vw, 1.5rem);
  font-weight: 800;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  align-self: flex-start;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

/* ПРАВЫЙ СТОЛБЕЦ - Управление */
.cart-item-controls {
  display: flex;
  grid-template-rows: auto auto;
  gap: 1.25rem;
  height: 100%;
  align-content: space-between;
}

/* Управление количеством и суммой */
.cart-qty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(42, 42, 42, 0.5);
  border-radius: 14px;
  border: 1px solid #3a3a3a;
}

/* Современные контролы количества */
.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.qty-controls:hover {
  border-color: #b8860b;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Кнопки +/- */
.qty-btn {
  width: 38px;
  height: 38px;
  background: #3a3a3a;
  border: 2px solid #444;
  border-radius: 10px;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #b8860b;
  color: #000;
  border-color: #d4af37;
  transform: scale(1.1);
}

.qty-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #333;
}
/* Отображение количества */
.qty {
  font-size: 1.3rem;
  font-weight: 800;
  color: #d4af37;
  min-width: 36px;
  text-align: center;
  padding: 0.3rem 0.6rem;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Итоговая сумма за товар */
.item-total {
  font-size: 1.5rem;
  font-weight: 900;
  color: #d4af37;
  background: linear-gradient(145deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.1));
  padding: 0.75rem 1.25rem;
  border-radius: 14px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-total:hover {
  transform: translateY(-3px);
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow:
    0 8px 24px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Кнопка удаления */
.remove-btn {
  background: linear-gradient(145deg, #3a3a3a, #2d2d2d);
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 0.9rem 1.5rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  max-width: 180px;
  height: fit-content;
  margin-left: auto;
  margin-top: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  min-height: 52px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.remove-btn:hover:not(.counting) {
  background: linear-gradient(145deg, #ff6b6b, #ff5252);
  color: white;
  transform: translateY(-3px);
  box-shadow:
    0 8px 20px rgba(255, 107, 107, 0.35),
    0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #ff5252;
}

/* Состояние отсчета */
.remove-btn.counting {
  background: linear-gradient(145deg, #ff4444, #ff3333) !important;
  color: white !important;
  border-color: #ff4444;
  animation: pulseRemove 1s infinite;
  min-width: 70px;
  padding: 0.9rem;
}

@keyframes pulseRemove {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(255, 68, 68, 0.3);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  }
}

.remove-btn.counting .cart-countdown {
  font-size: 1.5rem;
  font-weight: 900;
  animation: countdownBounce 0.5s ease;
}

@keyframes countdownBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Итог корзины */
.cart-total {
  margin-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #333;
}

.total-text {
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  color: #b8860b;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.total-text::before {
  content: '💰';
  font-size: 1.2em;
}

.checkout-btn {
  flex-shrink: 0;
  min-width: 220px;
}

/* ============================================
   СТИЛИ ДЛЯ SUMMARY-DETAILS (ИТОГОВОГО БЛОКА)
============================================ */
.summary-details {
  background: linear-gradient(145deg, #222, #1a1a1a);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  border: 2px solid #333;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  color: #b8860b;
}

.summary-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b8860b, #d4af37);
  border-radius: 16px 16px 0 0;
}

.summary-details h4 {
  font-size: 1.4rem;
  color: #b8860b;
  font-weight: 700;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-details h4::before {
  content: '📋';
  font-size: 1.2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  font-size: x-large;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.summary-row:hover {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1rem;
  margin: -0.5rem 0;
}

.summary-row:last-child {
  border-bottom: none;
  border-top: 2px solid rgba(184, 134, 11, 0.3);
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  font-weight: 700;
}

.summary-label {
  color: #ccc;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-label .icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Особые стили для итоговой строки */
.summary-row:last-child .summary-label {
  color: #b8860b;
  font-size: 1.3rem;
}

.summary-row:last-child .summary-value {
  color: #d4af37;
  font-size: 1.6rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Анимация при изменении значений */
.summary-value.changing {
  animation: priceChange 0.5s ease;
}

@keyframes priceChange {
  0% {
    transform: scale(1);
    color: #fff;
  }
  50% {
    transform: scale(1.1);
    color: #d4af37;
  }
  100% {
    transform: scale(1);
    color: #fff;
  }
}

/* Информационные подсказки */
.summary-hint {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(42, 42, 42, 0.5);
  border-radius: 10px;
  border: 1px dashed #444;
}

.summary-actions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

/* ============================================
   АДАПТИВНОСТЬ ДЛЯ КОРЗИНЫ
============================================ */

/* Планшеты (1024px и меньше) */
@media (max-width: 1024px) {
  .cart-item {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .cart-item-controls {
    display: flow;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .cart-qty-section {
    align-items: center;
  }
}

/* Планшеты (768px и меньше) */
@media (max-width: 768px) {
  .cart-items {
    padding: 0;
  }
  .cart-item {
    padding: 3px;
  }

  .cart-item-main {
    display: flex;
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }

  .cart-img {
    margin: 0 auto;
  }

  .cart-info {
    align-items: center;
  }

  .item-price {
    align-self: center;
  }

  .cart-item-controls {
    grid-template-columns: 1fr;
  }

  .cart-qty-section {
    align-items: center;
    padding: 1rem;
  }

  .remove-btn {
    width: 40%;
  }

  .remove-text {
    font-weight: 150;
    font-size: small;
  }

  .summary-details {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }

  .summary-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }

  .summary-label,
  .summary-value {
    justify-content: space-between;
    width: 100%;
  }

  .summary-row:last-child .summary-label,
  .summary-row:last-child .summary-value {
    font-size: 1.2rem;
  }
}

/* Мобильные (480px и меньше) */
@media (max-width: 480px) {
  .cart-item {
    grid-template-columns: 1fr;
  }
  .cart-item-controls {
    gap: 1rem;
  }

  .cart-qty-section {
    padding: 0.75rem;
  }

  .qty-controls {
    padding: 0.5rem 0.75rem;
  }

  .qty-btn {
    width: 34px;
    height: 34px;
    font-size: 1.4rem;
  }

  .qty {
    font-size: 1.2rem;
    min-width: 32px;
  }

  .item-total {
    font-size: 1.3rem;
    padding: 0.6rem 1rem;
  }

  .remove-btn {
    width: 30%;
    padding: 0.8rem 1.2rem;

    min-height: 48px;
  }

  .summary-details {
    padding: 1.25rem;
  }

  .summary-details h4 {
    font-size: 1.2rem;
    justify-content: center;
    text-align: center;
  }

  .summary-row {
    padding: 0.75rem;
  }

  .summary-label {
    font-size: 1rem;
  }

  .summary-value {
    font-size: 1.1rem;
  }

  .summary-row:last-child .summary-value {
    font-size: 1.3rem;
  }
}

/* Очень маленькие экраны (320px и меньше) */
@media (max-width: 320px) {
  .cart-item {
    padding: 0.75rem;
  }

  .cart-item-main {
    gap: 0.75rem;
  }

  .cart-img {
    width: 70px;
    height: 70px;
  }

  .cart-name {
    font-size: 1rem;
  }

  .item-price {
    font-size: 1.1rem;
  }

  .qty-controls {
    padding: 0.4rem 0.6rem;
  }

  .qty-btn {
    width: 30px;
    height: 30px;
    font-size: 1.3rem;
  }
}

/* Анимация countdown (общая) */
@keyframes countdown {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Адаптивность для остальных элементов */
@media (max-width: 768px) {
  .profile-container {
    padding: 70px 14px 30px;
  }

  .profile-header {
    /* flex-direction: column; */
    /* text-align: center; */
    gap: 1.5rem;
  }

  .profile-header h1 {
    order: -1;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.75rem;
  }

  .user-info h2 {
    text-align: center;
  }

  .email {
    justify-content: center;
  }

  .stats-grid {
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .cart-total {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }

  .checkout-btn {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 60px 12px 25px;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.875rem;
  }

  /* .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  } */
}

@media (max-width: 320px) {
  .profile-container {
    padding: 50px 8px 20px;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .user-card,
  .stat-card,
  .cart-items {
    border-radius: 14px;
    padding: 1.25rem;
  }

  .btn-primary {
    width: 100%;
    text-align: center;
    justify-content: center;
  }

  .section h3 {
    font-size: 1.4rem;
  }
}
</style>
