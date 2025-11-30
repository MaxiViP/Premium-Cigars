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

const getBackendUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://premium-cigars-backend.onrender.com/api'
  }
  return 'http://localhost:5000/api'
}

const handleOAuth = (provider: 'google' | 'yandex') => {
  const backendUrl = getBackendUrl()
  const url = `${backendUrl}/auth/${provider}`

  console.log('🚀 OAuth URL:', url)

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
    // Разрешаем сообщения только от нашего фронтенда
    const allowedOrigins = [window.location.origin]

    if (!allowedOrigins.includes(event.origin)) {
      console.log('❌ Ignored message from wrong origin:', event.origin)
      return
    }

    console.log('📨 Received OAuth message:', event.data)

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
      alert('Ошибка авторизации: ' + (event.data.error || 'Неизвестная ошибка'))
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
