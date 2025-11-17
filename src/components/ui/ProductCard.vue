<template>
  <!-- ROOT: делаем div кликабельным — у него role=link, tabindex для клавиатуры,
       и @click будет вызывать переход -->
  <div
    :class="['product-card', { 'catalog-view': catalogView }]"
    role="link"
    tabindex="0"
    @click="goToProduct"
    @keydown.enter.prevent="goToProduct"
    @keydown.space.prevent="goToProduct"
  >
    <div class="product-image-container">
      <!-- Быстрые действия: важно — они должны прерывать всплытие, поэтому @click.stop -->
      <div class="quick-actions">
        <button class="qa-btn" @click.stop.prevent="toggleLike">❤</button>
        <button class="qa-btn" @click.stop.prevent="shareProduct">⇄</button>
      </div>

      <ProductImage :src="product.images[0]" :alt="product.name" class="product-image" />

      <!-- Метка наличия -->
      <div :class="product.inStock ? 'in-stock-badge' : 'out-of-stock-badge'">
        {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
      </div>
    </div>

    <div class="product-info">
      <div class="product-brand">{{ product.brand }}</div>
      <h3 class="product-name">{{ product.name }}</h3>

      <!-- Характеристики (опционально) -->
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
          <!-- Убрали кнопку "Подробнее" как видимый элемент — переход по клику на карточку -->
          <!-- Кнопка "В корзину" остаётся интерактивной и НЕ вызывает переход (stop) -->
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

// router для навигации
const router = useRouter()

// Навигация при клике на карточку
function goToProduct() {
  // Защита: если product нет — ничего
  if (!props.product || !('id' in props.product)) return
  router.push(`/product/${(props.product as Product).id}`)
}

// Примитивные handlers — пока заглушки, заменить реальной логикой
function toggleLike() {
  // TODO: интегрировать логику лайка
  console.log('toggle like', props.product?.id)
}

function shareProduct() {
  // TODO: интегрировать логику шаринга
  console.log('share product', props.product?.id)
}

function addToCart() {
  // TODO: интегрировать добавление в корзину
  console.log('add to cart', props.product?.id)
}
</script>

<style scoped>
.product-card.catalog-view {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Теперь карточка выглядит кликабельной */
  cursor: pointer;
  outline: none;
}

.product-card.catalog-view:focus {
  box-shadow: 0 0 0 4px rgba(139, 69, 19, 0.12); /* акцент при фокусе */
  transform: translateY(-3px);
}

.product-card.catalog-view:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

/* Изображение */
.product-image-container {
  position: relative;
  /* height: 260px; */
  border-bottom: 1px solid #f0f0f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  pointer-events: none; /* чтобы клики шли на карточку, а не на картинку */
}

.product-card.catalog-view:hover .product-image {
  transform: scale(1.06);
}

/* Быстрые действия */
.quick-actions {
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 4;
}

/* Кнопки быстрых действий — они перехватывают клик (stop) */
.qa-btn {
  background: white;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: background 0.2s ease;
}

.qa-btn:hover {
  background: #fafafa;
}

/* Наличие */
.in-stock-badge,
.out-of-stock-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  z-index: 3;
}

.in-stock-badge {
  background: #10b981;
}
.out-of-stock-badge {
  background: #ef4444;
}

/* Info */
.product-info {
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-brand {
  font-size: 0.9rem;
  color: #777;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.product-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Specs */
.product-specs {
  border-top: 1px dashed #eee;
  border-bottom: 1px dashed #eee;
  /* padding: 1rem 0; */
  margin-bottom: 1.2rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.85rem;
}

.spec-item span:first-child {
  color: #666;
}

/* Footer */
.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2px;
}

.product-price {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--primary-color);
}

.product-rating {
  margin-top: 4px;
}

.rating-stars {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* details-btn удалён как отдельная кнопка — стиль не нужен */

/* Кнопка в корзину — НЕ вызывает переход (мы добавили @click.stop) */
.add-cart-btn {
  background: var(--primary-color);
  color: white;
  padding: 0.6rem 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.add-cart-btn:hover {
  opacity: 0.85;
  background: var(--gold-color);
  color: black;
}

/* Медиазапросы: сохраняем адаптивность */
@media (max-width: 768px) {
  /* .product-image-container {
    height: 220px;
  } */

  .product-info {
    padding: 20px 5px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}

@media (max-width: 480px) {
  /* .product-image-container {
    height: 180px;
  } */
  /*
  .product-info {
    padding: 70px 0 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  } */
}
</style>
