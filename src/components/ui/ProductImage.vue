<template>
  <img
    :src="imageSrc"
    :alt="alt"
    :class="className"
    :style="imageStyle"
    @error="handleError"
    @load="handleLoad"
    loading="lazy"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt: string
  className?: string
  maxWidth?: number
  maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 350,
  maxHeight: 350
})

const imageError = ref(false)
const imageLoaded = ref(false)

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

// const imageStyle = computed(() => ({
//   maxWidth: `${props.maxWidth}px`,
//   maxHeight: `${props.maxHeight}px`,
//   width: imageLoaded.value ? 'auto' : `${props.maxWidth}px`,
//   height: imageLoaded.value ? 'auto' : `${props.maxHeight}px`,
//   objectFit: 'contain' as const
// }))

const handleError = () => {
  console.error(`Failed to load image: ${props.src}`)
  imageError.value = true
}

const handleLoad = (event: Event) => {
  imageLoaded.value = true
  const img = event.target as HTMLImageElement
  console.log(`Image loaded: ${img.naturalWidth}x${img.naturalHeight}`)
}
</script>
