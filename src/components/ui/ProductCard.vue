<template>
  <div
    :class="['product-card', { 'catalog-view': catalogView }]"
    role="link"
    tabindex="0"
    @click="goToProduct"
    @keydown.enter.prevent="goToProduct"
    @keydown.space.prevent="goToProduct"
  >
    <!-- Изображение -->
    <div class="product-image-wrapper">
      <div class="quick-actions">
        <button class="qa-btn" @click.stop.prevent="toggleLike">❤</button>
        <button class="qa-btn" @click.stop.prevent="shareProduct">⇄</button>
      </div>

      <div class="in-stock-badge" v-if="product.inStock">В наличии</div>
      <div class="out-of-stock-badge" v-else>Нет в наличии</div>

      <ProductImage :src="product.images[0]" :alt="product.name" class="product-image" />

      <!-- Overlay с цветом #FBFAF9 -->
      <div class="image-overlay"></div>
    </div>

    <div class="product-info">
      <div class="product-brand">{{ product.brand }}</div>
      <h3 class="product-name">{{ product.name }}</h3>

      <div v-if="product.category === 'cigars'" class="product-specs">
        <div class="spec-item">
          <span>Крепость:</span><span>{{ product.strength }}</span>
        </div>
        <div class="spec-item">
          <span>Формат:</span><span>{{ product.format }}</span>
        </div>
        <div class="spec-item">
          <span>Размер:</span><span>{{ product.ringGauge }} RG / {{ product.length }}mm</span>
        </div>
      </div>

      <div class="product-footer">
        <div class="left">
          <div class="product-price">{{ formatPrice(product.pricePerUnit) }}</div>
          <div class="product-rating">
            <span class="rating-stars">★★★★★</span>
            <span class="rating-value">{{ product.rating }}</span>
          </div>
        </div>

        <div class="right">
          <button
            v-if="product.inStock"
            class="add-cart-btn"
            @click.stop.prevent="addToCart"
            aria-label="Добавить в корзину"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product, Accessory } from '@/types/Product'
import { formatPrice } from '@/utils/formatters'
import ProductImage from './ProductImage.vue'



interface Props {
  product: Product | Accessory
  catalogView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  catalogView: false,
})

const router = useRouter()

const emit = defineEmits<{
  (e: 'toggle-like', id: number): void
  (e: 'share-product', id: number): void
  (e: 'add-to-cart', id: number): void
}>()

function toggleLike() {
  if (!props.product?.id) return
  emit('toggle-like', props.product.id)
}

function shareProduct() {
  if (!props.product?.id) return
  emit('share-product', props.product.id)
}

function addToCart() {
  if (!props.product?.id) return
  emit('add-to-cart', props.product.id)
}

function goToProduct() {
  if (!props.product || !('id' in props.product)) return
  router.push(`/product/${(props.product as Product).id}`)
}


</script>

<style scoped>
.product-card.catalog-view {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.28s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  outline: none;
  height: 100%;
}

.product-card.catalog-view:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.14);
  z-index: 10;
}

.product-card.catalog-view:focus {
  box-shadow: 0 0 0 4px rgba(139, 69, 19, 0.18);
  transform: translateY(-3px);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 14px 14px 0 0;
  background-color: #fbfaf9;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fbfaf9;
  object-fit: contain;
  object-position: center;
  transition: transform 0.35s ease;
}

.product-card.catalog-view:hover .product-image {
  transform: scale(1.05);
}

/* Overlay с цветом #FBFAF9 */
.image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    #FBFAF9 0%,
    rgba(251, 250, 249, 0) 10%,
    rgba(251, 250, 249, 0) 90%,
    #FBFAF9 100%
  );
}

.quick-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qa-btn {
  background: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qa-btn:hover {
  background: #f5f5f5;
  transform: scale(1.08);
}

.in-stock-badge,
.out-of-stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.in-stock-badge {
  background: #10b981;
}
.out-of-stock-badge {
  background: #ef4444;
}

.product-info {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top: 1px solid #eee;
}

.product-brand {
  font-size: 0.88rem;
  font-weight: 600;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.product-name {
  font-size: 1.18rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 14px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-specs {
  border-top: 1px dashed #e2e2e2;
  border-bottom: 1px dashed #e2e2e2;
  padding: 10px 0;
  margin-bottom: 16px;
  font-size: 0.86rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}
.spec-item span:first-child {
  color: #666;
  font-weight: 500;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}
.product-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--primary-color, #b8860b);
}
.product-rating {
  margin-top: 4px;
  font-size: 0.9rem;
}
.rating-stars {
  color: var(--secondary-color, #d4af37);
}

.add-cart-btn {
  background: var(--primary-color, #b8860b);
  color: #fff;
  padding: 11px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.add-cart-btn:hover {
  background: #fff;
  color: #000;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .product-info {
    padding: 20px 12px;
  }
  .product-name {
    font-size: 1.1rem;
  }
  .product-price {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .product-info {
    padding: 18px 10px;
  }
  .add-cart-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>
