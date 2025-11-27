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

onMounted(async () => {
  const access = route.query.access
  const refresh = route.query.refresh

  if (typeof access !== 'string') {
    router.replace('/')
    return
  }

  // Сохраняем токены
  auth.setTokens({
    access,
    refresh: typeof refresh === 'string' ? refresh : undefined,
  })

  try {
    // Загружаем данные пользователя
    await auth.fetchMe()

    // Перенаправляем в профиль
    router.replace('/profile')
  } catch (err) {
    console.error('OAuth login error:', err)
    alert('Ошибка входа')
    router.replace('/')
  }
})
</script>
