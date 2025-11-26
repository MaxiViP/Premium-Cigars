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
        <img :src="auth.user?.avatar || '/default-avatar.png'" alt="avatar" class="avatar" />
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
        <div class="stat-value">{{ formatPrice(auth.cartTotalPrice) }}</div>
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
          <img :src="product.images[0] || '/cigar-placeholder.jpg'" alt="product" />

          <div class="favorite-info">
            <h4>{{ product.name }}</h4>
            <p class="price">{{ formatPrice(product.pricePerUnit) }}</p>

            <button @click="toggleFavorite(product.id)" class="remove-favorite-btn">Удалить</button>
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
          <img :src="item.product.images[0] || '/cigar-placeholder.jpg'" alt="product" />

          <div class="info">
            <h4>{{ item.product.name }}</h4>
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
          <strong>Итого: {{ formatPrice(auth.cartTotalPrice) }}</strong>
          <router-link to="/checkout" class="btn-primary">Оформить заказ</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
   ИЗБРАННОЕ
--------------------------------*/
const favoriteProducts = computed<Product[]>(() => {
  const favoriteIds = auth.user?.favorites || []
  return favoriteIds
    .map((id) => products.value.find((p) => p.id === Number(id)))
    .filter((p): p is Product => Boolean(p))
})

const toggleFavorite = (id: number) => {
  if (auth.user?.favorites.includes(String(id))) {
    auth.removeFromFavorites(String(id))
  } else {
    auth.addToFavorites(String(id))
  }
}

/* -----------------------------
   КОРЗИНА
--------------------------------*/
const cartProducts = computed(
  () =>
    (auth.user?.cart || [])
      .map((item) => {
        const product = products.value.find((p) => p.id === Number(item.product))
        return product ? { product, qty: item.qty } : null
      })
      .filter(Boolean) as { product: Product; qty: number }[],
)

const updateQty = (productId: number, qty: number) => {
  if (qty <= 0) return auth.removeFromCart(String(productId))
  auth.updateCartItem(String(productId), qty)
}

const removeFromCart = (productId: number) => {
  auth.removeFromCart(String(productId))
}

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
.profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 150px;
  color: white;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 1px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 0.7rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: #e74c3c;
  color: white;
}

.user-card {
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #b8860b;
}

.online-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: #27ae60;
  border: 4px solid #1a1a1a;
  border-radius: 50%;
}

.user-info h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: #b8860b;
}

.email,
.phone {
  margin: 0.4rem 0;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: #222;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #333;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: #b8860b;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #b8860b;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.section {
  margin-bottom: 3rem;
}

.section h3 {
  font-size: 1.8rem;
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

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
  font-style: italic;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(45deg, #b8860b, #d4af37);
  color: black;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(184, 134, 11, 0.3);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.favorites-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

.favorite-card {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.favorite-card img {
  width: 100%;
  border-radius: 8px;
}

.favorite-info {
  margin-top: 8px;
}

.remove-favorite-btn {
  margin-top: 6px;
  color: #c00;
  background: transparent;
  border: none;
  cursor: pointer;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  background: #eee;
  border-radius: 6px;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.favorite-item,
.cart-item {
  background: #222;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid #333;
}

.favorite-item:hover,
.cart-item:hover {
  transform: translateY(-10px);
  border-color: #b8860b;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.favorite-item img,
.cart-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.favorite-item p {
  padding: 1rem;
  text-align: center;
  margin: 0;
  font-weight: 500;
}

.cart-items {
  background: #1e1e1e;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #333;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.info h4 {
  margin: 0 0 0.5rem;
  color: #b8860b;
}

.cart-total {
  margin-top: 2rem;
  text-align: right;
  font-size: 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }
  .profile-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .cart-total {
    flex-direction: column;
    text-align: center;
  }
}
</style>
