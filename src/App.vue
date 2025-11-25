<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/ui/AppHeader.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router' // ← правильно импортируем
import { onMounted, watch } from 'vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter() // ← правильно вызываем!

// === 1. Обработка OAuth-редиректа (Google / Yandex) ===
const handleOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search)
  const access = params.get('access')
  const refresh = params.get('refresh')

  if (access && refresh) {
    auth.setTokens({ access, refresh })

    // Очищаем query из URL
    window.history.replaceState({}, '', window.location.pathname)

    // Загружаем данные пользователя
    auth.fetchMe?.()?.finally(() => {
      auth.loadFromStorage?.()
    })

    // Опционально: редирект на главную, если вдруг на /auth/success
    if (route.path.includes('/auth/success')) {
      router.replace('/') // ← вот где нужен router!
    }
  }
}

// === 2. Загрузка при старте приложения ===
const initAuth = () => {
  auth.loadFromStorage()
}

// === 3. Плавная прокрутка вверх при смене страницы ===
watch(
  () => route.path,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

// === Инициализация ===
onMounted(() => {
  initAuth()
  handleOAuthCallback()
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fbfaf9;
}

.main-content {
  flex: 1;
  padding-top: 8px;
}

html {
  scroll-behavior: smooth;
}
</style>
