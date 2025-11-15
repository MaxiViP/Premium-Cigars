<template>
  <div class="product-card">
    <div class="product-image">
      <ProductImage
        :src="product.images[0]"
        :alt="product.name"
        class="product-img"
      />
      <div class="product-overlay">
        <router-link :to="`/product/${product.id}`" class="view-details">
          Подробнее
        </router-link>
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-brand">{{ product.brand }}</p>
      <p class="product-price">{{ formatPrice(product.price) }}</p>

      <div v-if="product.category === 'cigars'" class="product-specs">
        <span class="spec">{{ product.strength }}</span>
        <span class="spec">{{ product.format }}</span>
        <span class="spec">{{ product.ringGauge }} RG</span>
      </div>

      <div v-else class="product-specs">
        <span class="spec">{{ (product as any).type }}</span>
        <span class="spec">{{ (product as any).material }}</span>
      </div>

      <div class="product-rating">
        <span class="rating-stars">★★★★★</span>
        <span class="rating-value">{{ product.rating }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Accessory } from '@/types/Product'
import { formatPrice } from '@/utils/formatters'
import ProductImage from './ProductImage.vue'

interface Props {
  product: Product | Accessory
}

defineProps<Props>()
</script>
<style scoped>

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}


.product-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.view-details {
  background: var(--secondary-color);
  color: var(--text-dark);
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.view-details:hover {
  background: #b8941f;
  transform: translateY(-2px);
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--text-dark);
  font-weight: bold;
  line-height: 1.3;
  height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-brand {
  margin: 0 0 0.5rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
}

.product-price {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-color);
}

.product-specs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.spec {
  background: var(--background);
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

.rating-value {
  color: var(--text-light);
  font-size: 0.8rem;
  font-weight: 500;
}

/* Обеспечиваем одинаковую высоту карточек */
@media (min-width: 769px) {
  .product-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-rating {
    margin-top: auto;
  }
}
</style>
