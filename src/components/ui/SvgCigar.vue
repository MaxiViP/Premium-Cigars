<template>
  <img
    :src="getSvgPath"
    :alt="alt"
    :class="className"
    :style="styles"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  alt?: string
  className?: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Premium Cigar',
  width: 120,
  height: 40
})

const getSvgPath = computed(() => {
  return `/images/cigars_svg/cigar${props.type}.svg`
})

const styles = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))'
}))
</script>
