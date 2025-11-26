<!-- src/components/auth/AuthSuccess.vue -->

<template>
  <div style="text-align: center; padding: 4rem; color: white">
    <h2>Вход выполнен успешно!</h2>
    <p>Перенаправляем в личный кабинет...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  const { access, refresh } = route.query

  if (access && typeof access === 'string') {
    // Сохраняем токены
    auth.setTokens({
      access,
      refresh: typeof refresh === 'string' ? refresh : undefined,
    })

    // Загружаем данные пользователя
    auth
      .fetchMe()
      .then(() => {
        // Убираем query из URL и переходим в профиль
        router.replace('/profile')
      })
      .catch(() => {
        alert('Ошибка входа')
        router.replace('/')
      })
  } else {
    router.replace('/')
  }
})
</script>
