<template>
  <div class="profile-container">
    <!-- Заголовок -->
    <header class="profile-header">
      <h1>Личный кабинет</h1>
      <button @click="auth.logout" class="logout-btn">Выйти</button>
    </header>

    <!-- Карточка пользователя -->
    <div class="user-card">
      <div class="avatar-wrapper">
        <img :src="auth.user?.avatar || 'default-avatar.svg'" alt="avatar" class="avatar" />class="avatar" />
      </div>
      <div class="user-info">
        <h2>{{ username }}</h2>
        <p class="email">{{ auth.user?.email || 'Email не указан' }}</p>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ auth.cartTotalItems }}</div>
        <div class="stat-label">в корзине</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ favoriteProducts.length }}</div>
        <div class="stat-label">в избранном</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ formatPrice(cartTotal) }}</div>
        <div class="stat-label">на сумму</div>
      </div>
    </div>

    <!-- Избранное -->
    <section class="section">
      <h3>Избранное</h3>

      <div v-if="favoriteProducts.length === 0" class="empty-state">
        <p>Вы ещё ничего не добавили в избранное</p>
      </div>

      <div v-else class="favorites-grid">
        <div v-for="product in favoriteProducts" :key="product.id" class="favorite-card">
          <img :src="getProductImage(product.images?.[0])" :alt="product.name" class="favorite-img" />

          <div class="favorite-info">
            <h4 class="favorite-name">{{ product.name }}</h4>
            <p class="price">{{ formatPrice(product.pricePerUnit) }}</p>

            <button @click="toggleFavorite(product.id)" class="remove-favorite-btn">
              Удалить
            </button>
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

      <div v-else class="cart-items">
        <div v-for="item in cartProducts" :key="item.product.id" class="cart-item">
          <img :src="getProductImage(item.product.images?.[0])" :alt="item.product.name" class="cart-img" />

          <div class="cart-info">
            <h4 class="cart-name">{{ item.product.name }}</h4>
            <p class="price">{{ formatPrice(item.product.pricePerUnit) }}</p>

            <!-- Количество -->
            <div class="qty-controls">
              <button @click="updateQty(item.product.id, item.qty - 1)" class="qty-btn">−</button>
              <span class="qty">{{ item.qty }}</span>
              <button @click="updateQty(item.product.id, item.qty + 1)" class="qty-btn">+</button>
            </div>

            <p class="sum">
              Всего:
              <strong>{{ formatPrice(item.product.pricePerUnit * item.qty) }}</strong>
            </p>
          </div>

          <button @click="removeFromCart(item.product.id)" class="remove-btn">Удалить</button>
        </div>

        <!-- Итог -->
        <div class="cart-total">
          <strong class="total-text">Итого: {{ formatPrice(cartTotal) }}</strong>
          <router-link to="/checkout" class="btn-primary checkout-btn">Оформить заказ</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import type { Product } from '@/types/Product'

const auth = useAuthStore()
const catalog = useCatalogStore()
const { products } = storeToRefs(catalog)

/* -----------------------------
   USERNAME
--------------------------------*/
const username = computed(() => auth.user?.name || auth.user?.email?.split('@')[0] || 'Гость')

/* -----------------------------
   ФУНКЦИЯ ДЛЯ ИЗОБРАЖЕНИЙ
--------------------------------*/
const getProductImage = (src: string | undefined) => {
  if (!src) return '/images/products/default.webp'

  if (src.startsWith('http') || src.startsWith('/')) {
    return src
  }

  return `/images/products/${src}`
}

/* -----------------------------
   ИЗБРАННОЕ - ИСПРАВЛЕННАЯ ВЕРСИЯ
--------------------------------*/
const favoriteProducts = computed<Product[]>(() => {
  const favoriteIds = auth.user?.favorites || []
  console.log('Favorites updated:', favoriteIds) // Отладка

  return favoriteIds
    .map((id: any) => {
      const productId = typeof id === 'string' ? Number(id) : Number(id?.id || id?._id || id)
      return products.value.find((p) => p.id === productId)
    })
    .filter((p): p is Product => Boolean(p))
})

// Добавляем watcher для отладки
watch(favoriteProducts, (newFavorites) => {
  console.log('Favorite products changed:', newFavorites)
}, { deep: true })

const toggleFavorite = (id: number) => {
  console.log('Toggling favorite for:', id)
  if (auth.user?.favorites.some((fav: any) => {
    const favId = typeof fav === 'string' ? fav : String(fav?.id || fav?._id || fav)
    return favId === String(id)
  })) {
    auth.removeFromFavorites(String(id))
  } else {
    auth.addToFavorites(String(id))
  }
}

/* -----------------------------
   КОРЗИНА (ЛОКАЛЬНАЯ ЛОГИКА ДО ФИКСА БЭКЕНДА)
--------------------------------*/
const cartProducts = computed(
  () =>
    (auth.user?.cart || [])
      .map((item) => {
        const productId = typeof item.product === 'string'
          ? Number(item.product)
          : Number(item.product?.id || item.product?._id || item.product)
        const product = products.value.find((p) => p.id === productId)
        return product ? { product, qty: item.qty } : null
      })
      .filter(Boolean) as { product: Product; qty: number }[],
)

// Локальное обновление корзины (временное решение)
const updateQty = async (productId: number, newQty: number) => {
  console.log('Updating quantity:', productId, newQty)

  try {
    if (newQty <= 0) {
      await auth.removeFromCart(String(productId))
    } else {
      await auth.updateCartItem(String(productId), newQty)
    }
  } catch (error) {
    console.error('API error, using local update:', error)
    // Локальное обновление если API не работает
    localUpdateCart(productId, newQty)
  }
}

// Локальное обновление корзины
const localUpdateCart = (productId: number, newQty: number) => {
  if (!auth.user) return

  const cart = [...(auth.user.cart || [])]
  const existingIndex = cart.findIndex((item) => {
    const itemProductId = typeof item.product === 'string'
      ? item.product
      : String(item.product?.id || item.product?._id || item.product)
    return itemProductId === String(productId)
  })

  if (newQty <= 0) {
    // Удалить из корзины
    if (existingIndex !== -1) {
      cart.splice(existingIndex, 1)
    }
  } else {
    // Обновить количество
    if (existingIndex !== -1) {
      const existingItem = cart[existingIndex]
      if (existingItem) {
        cart[existingIndex] = {
          ...existingItem,
          qty: newQty,
          product: existingItem.product // Сохраняем существующий product
        }
      }
    } else {
      // Добавить в корзину
      cart.push({ product: String(productId), qty: newQty })
    }
  }

  // Обновляем локальное состояние
  auth.user.cart = cart
}

const removeFromCart = async (productId: number) => {
  console.log('Removing from cart:', productId)
  try {
    await auth.removeFromCart(String(productId))
  } catch (error) {
    console.error('API error, using local remove:', error)
    localUpdateCart(productId, 0) // Устанавливаем количество в 0 для удаления
  }
}

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
const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value)
</script>

<style scoped>
/* Базовые стили */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px 40px;
  min-height: 100vh;
}

/* Заголовок */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.profile-header h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.5px;
  color: var(--primary-color);
  margin: 0;
}

.logout-btn {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: clamp(0.6rem, 3vw, 0.7rem) clamp(1rem, 4vw, 1.2rem);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  white-space: nowrap;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
}

/* Карточка пользователя */
.user-card {
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  border-radius: 20px;
  padding: clamp(1.5rem, 4vw, 2rem);
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: clamp(80px, 20vw, 120px);
  height: clamp(80px, 20vw, 120px);
  border-radius: 10%;
  object-fit: cover;
  border: 3px solid #b8860b;
  background: #110808 center/cover no-repeat;
}

.user-info h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0 0 0.5rem;
  color: #b8860b;
  word-break: break-word;
}

.email {
  margin: 0.4rem 0;
  color: #aaa;
  font-size: clamp(0.9rem, 3vw, 1rem);
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: 3rem;
}

.stat-card {
  background: #222;
  padding: clamp(1rem, 3vw, 1.5rem);
  border-radius: 16px;
  text-align: center;
  border: 1px solid #333;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #b8860b;
}

.stat-value {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: bold;
  color: #b8860b;
  line-height: 1;
}

.stat-label {
  color: #888;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  margin-top: 0.5rem;
}

/* Секции */
.section {
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.section h3 {
  font-size: clamp(1.5rem, 4vw, 1.8rem);
  margin-bottom: 1.5rem;
  color: #b8860b;
  position: relative;
  display: inline-block;
}

.section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: #b8860b;
  border-radius: 2px;
}

/* Пустые состояния */
.empty-state {
  text-align: center;
  padding: clamp(2rem, 5vw, 3rem) 1rem;
  color: #888;
  font-style: italic;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: clamp(0.9rem, 3vw, 1rem);
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(45deg, #b8860b, #d4af37);
  color: black;
  padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  border-radius: 12px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  font-size: clamp(0.85rem, 3vw, 1rem);
  text-align: center;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(184, 134, 11, 0.3);
}

/* Избранное */
.favorites-grid {
  display: grid;
  gap: clamp(12px, 3vw, 16px);
  grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr));
}

.favorite-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: clamp(8px, 2vw, 12px);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.favorite-card:hover {
  transform: translateY(-2px);
}

.favorite-img {
  width: 100%;
  height: auto;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 8px;
}

.favorite-info {
  margin-top: 8px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.favorite-name {
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  margin: 0 0 0.5rem;
  line-height: 1.3;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: bold;
  color: #b8860b;
  margin: 0.25rem 0;
}

.remove-favorite-btn {
  margin-top: auto;
  color: #c00;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  font-size: clamp(0.75rem, 2.5vw, 0.85rem);
  transition: color 0.2s;
}

.remove-favorite-btn:hover {
  color: #f00;
}

/* Корзина */
.cart-items {
  background: #1e1e1e;
  border-radius: 16px;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid #333;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 3vw, 1rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid #333;
  flex-wrap: wrap;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-img {
  width: clamp(60px, 15vw, 80px);
  height: clamp(60px, 15vw, 80px);
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.cart-info {
  flex: 1;
  min-width: min(200px, 100%);
}

.cart-name {
  font-size: clamp(0.9rem, 3vw, 1rem);
  margin: 0 0 0.5rem;
  color: #b8860b;
  word-break: break-word;
}

/* Управление количеством */
.qty-controls {
  display: flex;
  align-items: center;
  gap: clamp(6px, 2vw, 10px);
  margin: 0.5rem 0;
}

.qty-btn {
  width: clamp(24px, 6vw, 28px);
  height: clamp(24px, 6vw, 28px);
  background: #eee;
  border-radius: 6px;
  border: none;
  font-size: clamp(16px, 4vw, 20px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty {
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.sum {
  font-size: clamp(0.85rem, 2.5vw, 0.9rem);
  margin: 0.5rem 0 0;
  color: #ccc;
}

.remove-btn {
  background: var(--primary-color, #b8860b);
  color: #fff;
  padding: clamp(0.6rem, 2vw, 0.7rem) clamp(1rem, 3vw, 1.2rem);
  border-radius: 8px;
  font-weight: 700;
  font-size: clamp(0.8rem, 2.5vw, 0.85rem);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: var(--secondary-color);
  color: #000;
  transform: translateY(-1px);
}

/* Итог корзины */
.cart-total {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.total-text {
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  color: #b8860b;
}

.checkout-btn {
  flex-shrink: 0;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .cart-item {
    flex-direction: column;
    text-align: center;
    align-items: stretch;
  }

  .cart-info {
    min-width: auto;
  }

  .cart-total {
    flex-direction: column;
    text-align: center;
  }

  .remove-btn {
    align-self: center;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 70px 12px 30px;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    padding: 0.75rem 0.5rem;
  }

  .qty-controls {
    justify-content: center;
  }
}

@media (max-width: 320px) {
  .profile-container {
    padding: 60px 8px 20px;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .user-card,
  .stat-card,
  .cart-items {
    border-radius: 12px;
  }

  .btn-primary,
  .remove-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
