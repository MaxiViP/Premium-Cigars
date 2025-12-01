<template>
  <div class="oauth-buttons">
    <a @click.prevent="handleOAuth('google')" class="oauth google" rel="noopener">
      <img src="/icons/google.svg" alt="" /> Войти через Google
    </a>
    <a @click.prevent="handleOAuth('yandex')" class="oauth yandex" rel="noopener">
      <img src="/icons/yandex.svg" alt="" /> Войти через Yandex
    </a>
  </div>
</template>

<script setup lang="ts">
import { getBackendUrl } from '@/config/api'

// Самое простое и надёжное решение 2025 года
const handleOAuth = (provider: 'google' | 'yandex') => {
  const backendUrl = getBackendUrl() // уже заканчивается на /api
  const url = `${backendUrl}/auth/${provider}`

  console.log('Redirecting to OAuth:', url)

  // Просто редиректим на бэкенд — никаких popup!
  window.location.href = url
}
</script>

<style scoped>
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
