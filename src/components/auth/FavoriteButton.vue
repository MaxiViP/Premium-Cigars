<template>
  <button @click="toggle" :class="{'active': isFav}">
    <slot>❤</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFavoriteStore } from '@/stores/favorite';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{ productId: string }>();

const fav = useFavoriteStore();
const auth = useAuthStore();

const isFav = computed(() => {
  return auth.user?.favorites?.includes(props.productId) || false;
});

async function toggle() {
  if (!auth.token) {
    alert('Войдите, чтобы управлять избранным');
    return;
  }
  await fav.toggle(props.productId);
}
</script>
