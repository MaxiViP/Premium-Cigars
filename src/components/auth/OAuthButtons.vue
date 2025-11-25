<template>
  <div class="oauth-buttons">
    <a :href="`${API}/auth/google`"><button class="oauth google">Войти через Google</button></a>
    <a :href="`${API}/auth/yandex`"><button class="oauth yandex">Войти через Yandex</button></a>
  </div>
</template>
<script setup lang="ts">
const API = import.meta.env.VITE_API_BASE || (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace('/api','');
</script>
