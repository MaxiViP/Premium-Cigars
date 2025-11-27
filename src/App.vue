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
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()


onMounted(async () => {
  if (route.path === '/auth/success') {
    const access = route.query.access as string | undefined
    const refresh = route.query.refresh as string | undefined

    if (!access) {
      router.replace('/')
      return
    }

    auth.setTokens({ access, refresh })
    try {
      await auth.fetchMe()
      router.replace('/profile')
    } catch (err) {
      console.error('OAuth login error:', err)
      router.replace('/')
    }
  }
})

// =====================
// 1. Обработка OAuth-редиректа (Google / Yandex)
// =====================
const handleOAuthCallback = async () => {
  const params = new URLSearchParams(window.location.search)
  const access = params.get('access')
  const refresh = params.get('refresh')

  if (!access) return

  // Сохраняем токены
  auth.setTokens({ access, refresh: refresh || undefined })

  // Очищаем query из URL
  window.history.replaceState({}, '', window.location.pathname)

  try {
    // Загружаем данные пользователя
    await auth.fetchMe()

    // Если мы на странице /auth/success — переходим в профиль
    if (route.path.includes('/auth/success')) {
      router.replace('/profile')
    }
  } catch (err) {
    console.error('OAuth login error:', err)
    alert('Ошибка входа')
    router.replace('/')
  }
}

// =====================
// 2. Загрузка токена при старте приложения
// =====================
const initAuth = () => {
  auth.loadFromStorage()
}

// =====================
// 3. Плавная прокрутка вверх при смене страницы
// =====================
watch(
  () => route.path,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)

// =====================
// Инициализация
// =====================
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
