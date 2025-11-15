<template>
  <div class="catalog">
    <div class="container">
      <div class="catalog-header">
        <h1>Каталог товаров</h1>
        <p>Элитные сигары и аксессуары для истинных ценителей</p>

        <div class="catalog-filters">
          <button
            v-for="category in categories"
            :key="category.key"
            :class="['filter-btn', { active: activeCategory === category.key }]"
            @click="setActiveCategory(category.key)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div class="catalog-content">
        <div class="products-container">
          <div class="products-grid">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <div class="catalog-empty" v-if="filteredProducts.length === 0">
            <p>Товары не найдены</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ui/ProductCard.vue'

const productsStore = useProductsStore()
const activeCategory = ref<string>('all')

const categories = [
  { key: 'all', name: 'Все товары' },
  { key: 'cigars', name: 'Сигары' },
  { key: 'accessories', name: 'Аксессуары' }
]

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return productsStore.products
  } else if (activeCategory.value === 'cigars') {
    return productsStore.cigars
  } else {
    return productsStore.accessories
  }
})

const setActiveCategory = (category: string) => {
  activeCategory.value = category
}
</script>

<style scoped>
.catalog {
  padding: 2rem 0;
  min-height: 80vh;
}

.catalog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.catalog-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.catalog-header p {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.catalog-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 1rem;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-color);
  color: var(--white);
}

.catalog-content {
  display: flex;
  justify-content: center;
}

.products-container {
  width: 100%;
  max-width: 1200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.catalog-empty {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-light);
}

.catalog-empty p {
  font-size: 1.2rem;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .catalog-header h1 {
    font-size: 2rem;
  }

  .catalog-filters {
    gap: 0.5rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
