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


// const getBackendUrl = () => {
//   if (import.meta.env.PROD || window.location.hostname === 'maxivip-premium-cigars-fc19.twc1.net') {
//     return 'https://maxivip-premium-cigars-fc19.twc1.net/api'
//   }
//   return 'http://localhost:5000/api'
// }

const getBackendUrl = () => {
  // Если это продакшен-домен — всё равно шлём на твой локальный бэк (или ngrok)
  if (window.location.hostname === 'maxivip-premium-cigars-fc19.twc1.net') {
    return 'https://maxivip-premium-cigars-fc19.twc1.net/api'
    // или
    // return 'http://твой-внешний-ip:5000/api'
  }
  return 'http://localhost:5000/api'
}

const backendUrl = getBackendUrl()

const handleOAuth = (provider: 'google' | 'yandex') => {
  const url = `${backendUrl}/auth/${provider}`
  console.log(`Opening OAuth for ${provider}:`, url)

  const popup = window.open(
    url,
    'oauth',
    'width=600,height=700,left=200,top=100,scrollbars=yes,resizable=yes'
  )

  if (!popup) {
    alert('Разрешите всплывающие окна для этого сайта!')
    return
  }

  // Слушаем сообщения от попапа
  const messageHandler = (event: MessageEvent) => {
    // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: проверяем origin правильно!
    const expectedOrigin = window.location.origin
    if (event.origin !== expectedOrigin) {
      console.log('Ignored message from wrong origin:', event.origin)
      return
    }

    if (event.data?.type === 'oauth-success') {
      console.log('OAuth success! Tokens received')

      // Лучше использовать токены из сообщения, а не заново фетчить
      if (event.data.access && event.data.refresh) {
        auth.handleOAuthSuccess(event.data.access, event.data.refresh)
      } else {
        auth.fetchMe() // fallback
      }

      router.push('/profile')
      cleanup()
    }

    if (event.data?.type === 'oauth-failed') {
      alert('Ошибка авторизации. Попробуйте ещё раз.')
      cleanup()
    }
  }

  // Проверка закрытия попапа
  const closedChecker = setInterval(() => {
    if (popup.closed) {
      console.log('OAuth popup closed')
      cleanup()
    }
  }, 500)

  const cleanup = () => {
    window.removeEventListener('message', messageHandler)
    clearInterval(closedChecker)
  }

  window.addEventListener('message', messageHandler)
}

console.log('OAuth backend URL:', backendUrl)
console.log('Current hostname:', window.location.hostname)
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
