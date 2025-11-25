<template>
  <div class="profile-page">
    <h1>Личный кабинет</h1>
    <div v-if="!auth.user">Пользователь не авторизован. <router-link to="/login">Войти</router-link></div>

    <div v-else>
      <div class="user-info">
        <img v-if="auth.user.avatar" :src="auth.user.avatar" alt="avatar" style="width:80px;border-radius:10px" />
        <div>
          <h2>{{ auth.user.name || auth.user.phone || auth.user.email }}</h2>
          <button @click="logout">Выйти</button>
        </div>
      </div>

      <section class="favorites">
        <h3>Избранное</h3>
        <div v-if="!auth.user.favorites?.length">Пусто</div>
        <ul>
          <li v-for="f in auth.user.favorites" :key="f._id">{{ f.title || f.name }}</li>
        </ul>
      </section>

      <section class="cart">
        <h3>Корзина</h3>
        <div v-if="!auth.user.cart?.length">Пусто</div>
        <ul>
          <li v-for="c in auth.user.cart" :key="c.product._id">{{ c.product.title || c.product.name }} — {{ c.qty }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

onMounted(async ()=>{ await auth.loadFromStorage(); });
function logout(){ auth.logout(); }
</script>
