<template>
  <div class="home">
    <HeroSection />
    <FeaturedProducts />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturedProducts from '@/components/sections/FeatureProducts.vue'
</script>

<style scoped>
.home {
  min-height: calc(100vh - 80px);
}
</style>
