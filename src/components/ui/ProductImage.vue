<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :class="className"
    @error="handleError"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt: string
  className?: string
}

const props = defineProps<Props>()
const imageError = ref(false)

const imageSrc = computed(() => {
  if (imageError.value || !props.src) {
    return '/images/products/default.jpg'
  }

  // Если src уже полный URL, используем как есть
  if (props.src.startsWith('http') || props.src.startsWith('/')) {
    return props.src
  }

  // Иначе добавляем базовый путь
  return `/images/products/${props.src}`
})

const handleError = () => {
  console.error(`Failed to load image: ${props.src}`)
  imageError.value = true
}
</script>
