<!-- src/components/auth/AuthFailure.vue -->
<template>
  <div class="auth-failure">
    <div class="container">
      <h1>❌ Ошибка авторизации</h1>
      <p>Не удалось войти через социальную сеть. Пожалуйста, попробуйте еще раз.</p>
      <button @click="goToLogin" class="btn-primary">Вернуться к входу</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}


</script>

<style scoped>
.auth-failure {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.container {
  text-align: center;
  max-width: 400px;
}

h1 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.btn-primary {
  background: #b8860b;
  color: black;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #d4a017;
}
</style>
