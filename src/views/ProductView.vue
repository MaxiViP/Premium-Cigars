<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <div class="product-content">
        <div class="product-images">
          <div class="main-image">
            <ProductImage
              :src="product.images[0]"
              :alt="product.name"
              class="product-detail-image"
            />
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-brand">{{ product.brand }}</p>
          <p class="product-price">{{ formatPrice(product.price) }}</p>

          <div class="product-description">
            <p>{{ product.description }}</p>
          </div>

          <div class="product-specs" v-if="product.category === 'cigars'">
            <div class="spec-item">
              <span class="spec-label">Страна:</span>
              <span class="spec-value">{{ product.country }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Крепость:</span>
              <span class="spec-value">{{ product.strength }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Размер:</span>
              <span class="spec-value">{{ product.size }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Формат:</span>
              <span class="spec-value">{{ product.format }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Калибр:</span>
              <span class="spec-value">{{ product.ringGauge }} RG</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Длина:</span>
              <span class="spec-value">{{ product.length }} мм</span>
            </div>
          </div>

          <div class="product-specs" v-else>
            <div class="spec-item">
              <span class="spec-label">Тип:</span>
              <span class="spec-value">{{ (product as any).type }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Материал:</span>
              <span class="spec-value">{{ (product as any).material }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Бренд:</span>
              <span class="spec-value">{{ product.brand }}</span>
            </div>
          </div>

          <div class="product-rating">
            <span class="rating-stars">★★★★★</span>
            <span class="rating-value">Рейтинг: {{ product.rating }}/5</span>
          </div>

          <div class="product-actions">
            <button class="btn" @click="addToCart" :disabled="!product.inStock">
              {{ product.inStock ? 'Добавить в корзину' : 'Нет в наличии' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="product-not-found" v-else>
    <div class="container">
      <h1>Товар не найден</h1>
      <router-link to="/catalog" class="btn">Вернуться в каталог</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { formatPrice } from '@/utils/formatters'
import ProductImage from '@/components/ui/ProductImage.vue'

const route = useRoute()
const productsStore = useProductsStore()

const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : Number(id)
})

const product = computed(() => productsStore.getProductById(productId.value))

const addToCart = () => {
  alert('Товар добавлен в корзину!')
}
</script>

<style scoped>
.product-detail {
  padding: 2rem 0;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.product-detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  line-height: 1.2;
}

.product-brand {
  font-size: 1.3rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  font-weight: 500;
}

.product-price {
  font-size: 2.5rem;
  color: var(--primary-color);
  font-weight: bold;
  margin-bottom: 2rem;
}

.product-description {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.product-description p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-light);
}

.product-specs {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  color: var(--text-light);
  font-weight: 500;
}

.spec-value {
  color: var(--text-dark);
  font-weight: 600;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--background);
  border-radius: 8px;
}

.rating-stars {
  color: var(--secondary-color);
  font-size: 1.2rem;
}

.rating-value {
  color: var(--text-dark);
  font-weight: 500;
}

.product-actions {
  margin-top: 2rem;
}

.btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn:disabled {
  background: var(--text-light);
  cursor: not-allowed;
}

.product-not-found {
  padding: 4rem 0;
  text-align: center;
}

.product-not-found h1 {
  margin-bottom: 2rem;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-title {
    font-size: 2rem;
  }

  .main-image {
    height: 300px;
  }

  .product-price {
    font-size: 2rem;
  }
}
</style>
