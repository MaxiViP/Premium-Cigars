<template>
  <section class="featured-products">
    <div class="container">
      <div class="section-title">
        <h2>Рекомендуемые товары</h2>
        <p>Лучшие сигары и аксессуары из нашей коллекции</p>
      </div>

      <div class="products-container">
        <div class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <div class="text-center">
        <router-link to="/catalog" class="btn">Весь каталог</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ui/ProductCard.vue'

const productsStore = useProductsStore()
const featuredProducts = computed(() => productsStore.featuredProducts)
</script>

<style scoped>
.featured-products {
  padding: 2rem 0;
  background: var(--white);
}

.products-container {
  display: flex;
  justify-content: center;
}

.text-center {
  text-align: center;
  margin-top: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

@media (max-width: 768px) {
  .featured-products {
    padding: 3rem 0;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}
</style>
