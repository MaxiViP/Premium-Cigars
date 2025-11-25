<template>
  <div class="profile-page">
    <h1>Личный кабинет</h1>

    <div v-if="!auth.user" class="not-auth">
      Пользователь не авторизован.
      <router-link to="/auth" class="login-link">Войти / Зарегистрироваться</router-link>
    </div>

    <div v-else>
      <!-- Информация о пользователе -->
      <div class="user-info">
        <img v-if="auth.user.avatar" :src="auth.user.avatar" alt="avatar" class="avatar" />
        <div class="user-details">
          <h2>{{ auth.user.name || auth.user.phone || auth.user.email }}</h2>
          <p v-if="auth.user.email">Email: {{ auth.user.email }}</p>
          <p v-if="auth.user.phone">Телефон: {{ auth.user.phone }}</p>
          <button class="btn-logout" @click="logout">Выйти</button>
        </div>
      </div>

      <!-- Избранное -->
      <section class="favorites">
        <h3>Избранное</h3>
        <div v-if="!auth.user.favorites?.length" class="empty">Пусто</div>
        <ul v-else class="favorites-list">
          <li v-for="f in auth.user.favorites" :key="f._id" class="favorite-item">
            <img v-if="f.image" :src="f.image" alt="f.title" class="item-img" />
            <span>{{ f.title || f.name }}</span>
          </li>
        </ul>
      </section>

      <!-- Корзина -->
      <section class="cart">
        <h3>Корзина</h3>
        <div v-if="!auth.user.cart?.length" class="empty">Пусто</div>
        <ul v-else class="cart-list">
          <li v-for="c in auth.user.cart" :key="c.product._id" class="cart-item">
            <img v-if="c.product.image" :src="c.product.image" alt="c.product.title" class="item-img" />
            <div>
              <span>{{ c.product.title || c.product.name }}</span>
              <span>Количество: {{ c.qty }}</span>
              <span v-if="c.product.price">Цена: {{ formatPrice(c.product.price * c.qty) }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

onMounted(async () => {
  await auth.loadFromStorage();
});

function logout() {
  auth.logout();
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
};
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--white);
}

.not-auth {
  font-size: 1.1rem;
  color: #ccc;
}

.login-link {
  color: var(--gold-color);
  text-decoration: underline;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.user-details h2 {
  margin: 0 0 0.3rem 0;
}
.btn-logout {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #e74c3c;
  border: none;
  cursor: pointer;
  color: white;
}

section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 0.5rem;
}

.empty {
  color: #aaa;
}

.favorites-list,
.cart-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.favorite-item,
.cart-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 8px;
  min-width: 200px;
}

.item-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
