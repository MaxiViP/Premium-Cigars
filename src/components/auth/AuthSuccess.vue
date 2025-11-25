<template><div>Авторизация успешна, перенаправление...</div></template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const params = new URLSearchParams(location.search)
  const access = params.get('access')
  if (access) {
    auth.setToken(access)
    try {
      await auth.fetchMe()
    } catch (e) {
      console.warn(e)
    }
  }
  router.push('/profile')
})
</script>
