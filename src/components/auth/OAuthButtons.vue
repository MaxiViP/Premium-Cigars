<template>
  <div class="oauth-buttons">
    <a :href="googleUrl" class="oauth google" target="_blank" rel="noopener">
      <img src="/icons/google.svg" alt="" /> Войти через Google
    </a>
    <a :href="yandexUrl" class="oauth yandex" target="_blank" rel="noopener">
      <img src="/icons/yandex.svg" alt="" /> Войти через Yandex
    </a>
  </div>
</template>

<script setup lang="ts">
// Используем абсолютные URL для OAuth
const baseUrl = import.meta.env.PROD
  ? 'https://maxivip-premium-cigars-fc19.twc1.net' // замените на ваш продакшен бекенд
  : 'http://localhost:5000'

const googleUrl = `${baseUrl}/api/auth/google`
const yandexUrl = `${baseUrl}/api/auth/yandex`
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
