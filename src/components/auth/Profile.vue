<!-- src/components/auth/Profile.vue -->
<template>
  <div class="profile-container">
    <!-- Заголовок -->
    <header class="profile-header">
      <h1>Личный кабинет</h1>
      <button @click="auth.logout" class="logout-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Выйти
      </button>
    </header>

    <!-- Карточка пользователя -->
    <div class="user-card">
      <div class="avatar-wrapper">
        <img
          :src="auth.user?.avatar || '/default-avatar.png'"
          alt="avatar"
          class="avatar"
        />
        <div class="online-indicator"></div>
      </div>

      <div class="user-info">
        <h2>{{ auth.user?.name || auth.user?.email?.split('@')[0] || 'Гость' }}</h2>
        <p class="email">{{ auth.user?.email || 'Email не указан' }}</p>
        <p class="phone" v-if="auth.user?.phone">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {{ auth.user.phone }}
        </p>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ auth.cartTotalItems }}</div>
        <div class="stat-label">в корзине</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ auth.user?.favorites?.length || 0 }}</div>
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
      <div v-if="!auth.user?.favorites?.length" class="empty-state">
        <p>Вы ещё ничего не добавили в избранное</p>
      </div>
      <div v-else class="grid">
        <div v-for="item in auth.user.favorites" :key="item._id || item" class="favorite-item">
          <img :src="item.image || '/cigar-placeholder.jpg'" alt="Товар" />
          <p>{{ item.title || item.name || 'Сигара' }}</p>
        </div>
      </div>
    </section>

    <!-- Корзина -->
    <section class="section">
      <h3>Корзина</h3>
      <div v-if="!auth.cartTotalItems" class="empty-state">
        <p>Корзина пуста — самое время выбрать лучшие сигары</p>
        <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
      </div>
      <div v-else class="cart-items">
        <div v-for="item in auth.user?.cart" :key="item.product._id" class="cart-item">
          <img :src="item.product.image || '/cigar-placeholder.jpg'" alt="Товар" />
          <div class="info">
            <h4>{{ item.product.title || item.product.name }}</h4>
            <p>{{ formatPrice(item.product.price) }} × {{ item.qty }} = {{ formatPrice(item.product.price * item.qty) }}</p>
          </div>
        </div>
        <div class="cart-total">
          <strong>Итого: {{ formatPrice(auth.cartTotalPrice) }}</strong>
          <router-link to="/checkout" class="btn-primary">Оформить заказ</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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

.email, .phone {
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
  box-shadow: 0 15px 30px rgba(0,0,0,0.4);
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
