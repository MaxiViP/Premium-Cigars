<template>
  <div class="product-image-wrapper">
    <img
      :src="imageSrc"
      :alt="alt"
      class="product-image"
      @error="handleError"
      @load="handleLoad"
      loading="lazy"
    />
    <!-- Overlay сверху и снизу -->
    <div class="image-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  src?: string
  alt: string
}

const props = defineProps<Props>()

const imageError = ref(false)

const imageSrc = computed(() => {
  if (imageError.value || !props.src) {
    return '/images/products/default.webp'
  }

  if (props.src.startsWith('http') || props.src.startsWith('/')) {
    return props.src
  }

  return `/images/products/${props.src}`
})

const handleError = () => {
  imageError.value = true
}

const handleLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log(`Loaded: ${img.naturalWidth} x ${img.naturalHeight}`)
}
</script>

<style scoped>
.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 14px 14px 0 0;
  background-color: #FBFAF9; /* базовый цвет для краёв */
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* сохраняет пропорции картинки */
  object-position: center;
  display: block;
}

/* Overlay сверху и снизу (10% сверху и снизу) */
.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    #FBFAF9 0%,
    rgba(251, 250, 249, 0) 20%,
    rgba(251, 250, 249, 0) 90%,
    #FBFAF9 100%
  );
}
</style>
