<template>
  <div class="oauth-buttons">
    <a @click.prevent="handleOAuth('google')" href="#" class="oauth google" rel="noopener">
      <img src="/icons/google.svg" alt="" /> Войти через Google
    </a>
    <a @click.prevent="handleOAuth('yandex')" href="#" class="oauth yandex" rel="noopener">
      <img src="/icons/yandex.svg" alt="" /> Войти через Yandex
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// 🔥 ОБНОВЛЕННАЯ ФУНКЦИЯ - используем ваш бэкенд на Render
const getBackendUrl = (): string => {
  // В продакшене используем ваш развернутый бэкенд
  if (import.meta.env.PROD) {
    return 'https://premium-cigars-backend.onrender.com/api'
  }
  // В разработке - локальный бэкенд
  return 'http://localhost:5000/api'
}

const handleOAuth = (provider: 'google' | 'yandex') => {
  const backendUrl = getBackendUrl()
  const url = `${backendUrl}/auth/${provider}`

  console.log('🚀 OAuth URL:', url)
  console.log('📍 Current environment:', import.meta.env.PROD ? 'PRODUCTION' : 'DEVELOPMENT')

  const popup = window.open(
    url,
    'oauth',
    'width=600,height=700,left=200,top=100,scrollbars=yes,resizable=yes'
  )

  if (!popup) {
    alert('Разрешите всплывающие окна для этого сайта!')
    return
  }

  const messageHandler = (event: MessageEvent) => {
    const expectedOrigin = window.location.origin
    console.log('📨 Received message from:', event.origin)

    if (event.origin !== expectedOrigin) {
      console.log('❌ Ignored message from wrong origin:', event.origin)
      return
    }

    if (event.data?.type === 'oauth-success') {
      console.log('✅ OAuth success! Tokens received')

      if (event.data.access && event.data.refresh) {
        auth.handleOAuthSuccess(event.data.access, event.data.refresh)
        router.push('/profile')
      }
      cleanup()
    }

    if (event.data?.type === 'oauth-failed') {
      console.error('❌ OAuth failed:', event.data.error)
      alert('Ошибка авторизации. Попробуйте ещё раз.')
      cleanup()
    }
  }

  const closedChecker = setInterval(() => {
    if (popup.closed) {
      console.log('📪 OAuth popup closed by user')
      cleanup()
    }
  }, 500)

  const cleanup = () => {
    window.removeEventListener('message', messageHandler)
    clearInterval(closedChecker)
  }

  window.addEventListener('message', messageHandler)
}

// Логи для отладки
console.log('🔧 Backend URL:', getBackendUrl())
console.log('🌐 Current hostname:', window.location.hostname)
console.log('🚀 Environment:', import.meta.env.MODE)
</script>

<style scoped>
/* твой стиль остаётся без изменений */
.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  color: #000;
  cursor: pointer;
}

.oauth.google {
  background: #fff;
  border: 1px solid #ddd;
}

.oauth.yandex {
  background: #ffcc00;
}

.oauth:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.oauth img {
  height: 20px;
}
</style>
