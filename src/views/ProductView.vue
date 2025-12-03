<template>
  <div class="product-page">
    <div class="product-container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">Главная</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/catalog" class="breadcrumb-link">Каталог</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product?.name }}</span>
      </nav>

      <div v-if="product" class="product-detail">
        <!-- Основная информация -->
        <div class="product-main">
          <!-- Изображения -->
          <div class="product-images">
            <div class="product-main_action">
              <div class="product-action">
                <div v-if="product.inStock" class="in-stock-badge">В наличии</div>
                <div v-else class="out-of-stock-badge">Нет в наличии</div>
              </div>
              <div class="quick-actions">
                <button
                  class="qa-btn"
                  @click.stop.prevent="handleToggleLike"
                  :class="{ 'qa-btn--active': isLiked }"
                  :aria-label="isLiked ? 'Убрать из избранного' : 'Добавить в избранное'"
                >
                  <span v-if="isLiked">♥</span>
                  <span v-else>♡</span>
                </button>
                <button class="qa-btn" @click.stop.prevent="shareProduct">⇄</button>
              </div>
            </div>

            <div class="main-image">
              <img
                :src="getImageUrl(currentMainImage)"
                :alt="product?.name || 'Товар'"
                class="product-image"
              />
            </div>

            <div v-if="product.images.length > 1" class="image-thumbnails">
              <img
                v-for="(image, index) in product.images"
                :key="index"
                :src="getImageUrl(image)"
                :alt="`${product.name} - фото ${index + 1}`"
                class="thumbnail"
                :class="{ 'thumbnail-active': currentMainImage === image }"
                @click="setMainImage(image)"
              />
            </div>
          </div>

          <!-- Информация о товаре -->
          <div class="product-info">
            <div class="product-header">
              <h1 class="product-title">{{ product.name }}</h1>
              <div class="product-brand">{{ product.brand }}</div>
            </div>

            <div class="product-rating">
              <span class="rating-stars">★★★★★</span>
              <span class="rating-value">Рейтинг: {{ product.rating }}/5</span>
            </div>

            <div class="product-price-section">
              <div class="price-item">
                <span class="price-label">За 1 шт:</span>
                <span class="product-price">{{ formatPrice(product.pricePerUnit) }}</span>
              </div>
              <div v-if="product.pricePerBox" class="price-item">
                <span class="price-label">За коробку:</span>
                <span class="product-price">{{ formatPrice(product.pricePerBox) }}</span>
              </div>
            </div>

            <div class="product-actions">
              <button
                class="add-to-cart-btn"
                :disabled="!product.inStock"
                @click="handleAddToCart"
                :class="{ 'add-cart-btn--active': isInCart }"
              >
                <span v-if="isInCart">В корзине</span>
                <span v-else>{{ product.inStock ? 'Добавить в корзину' : 'Нет в наличии' }}</span>
              </button>
            </div>

            <div class="product-description">
              <h3>Описание</h3>
              <p>{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- Детальная информация -->
        <div class="product-details">
          <div class="details-section">
            <h3>Характеристики</h3>
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">Бренд:</span>
                <span class="spec-value">{{ product.brand }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Страна:</span>
                <span class="spec-value">{{ product.country }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Крепость:</span>
                <span class="spec-value">{{ product.strength }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Формат:</span>
                <span class="spec-value">{{ product.format }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Размер:</span>
                <span class="spec-value">{{ product.size }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Калибр:</span>
                <span class="spec-value">{{ product.ringGauge }} RG</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Длина:</span>
                <span class="spec-value">{{ product.length }} мм</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Время курения:</span>
                <span class="spec-value">{{ product.smokingTime }}</span>
              </div>
            </div>
          </div>

          <!-- Вкусовой профиль -->
          <div class="details-section">
            <h3>Вкусовой профиль</h3>
            <div class="flavor-profile">
              <div class="flavor-family">
                <strong>Семейство вкусов:</strong> {{ product.flavorFamily }}
              </div>
              <div class="flavor-notes">
                <strong>Ноты вкуса:</strong>
                <div class="flavor-tags">
                  <span v-for="note in product.flavorNotes" :key="note" class="flavor-tag">
                    {{ note }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Похожие товары -->
        <div class="related-products">
          <h3>Похожие товары</h3>
          <div class="related-grid">
            <ProductCard
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              :product="relatedProduct"
              class="related-product-card"
            />
          </div>
        </div>
      </div>

      <!-- Сообщение если товар не найден -->
      <div v-else class="product-not-found">
        <div class="not-found-icon">🚬</div>
        <h2>Товар не найден</h2>
        <p>Извините, запрашиваемый товар не существует или был удален</p>
        <router-link to="/catalog" class="back-to-catalog-btn"> Вернуться в каталог </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useProductActions } from '@/composables/useProductActions'
import ProductCard from '@/components/ui/ProductCard.vue'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types/Product'

const route = useRoute()
const productsStore = useProductsStore()
const mainImage = ref<string>('')

// Получаем ID товара из роута
const productId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : Number(id)
})

// Получаем данные товара
const product = computed(() => {
  return productsStore.getProductById(productId.value) as Product | undefined
})

// Используем композицию для действий с товаром
const { isLiked, isInCart, toggleLike, addToCart } = useProductActions(productId.value)

// Обертки для обработчиков, которые принимают PointerEvent
const handleToggleLike = (event: MouseEvent) => {
  event.stopPropagation()
  event.preventDefault()
  toggleLike()
}

const handleAddToCart = (event: MouseEvent) => {
  event.stopPropagation()
  addToCart()
}

const shareProduct = (event: MouseEvent) => {
  event.stopPropagation()
  event.preventDefault()

  if (navigator.share && product.value) {
    navigator.share({
      title: product.value.name,
      text: product.value.brand,
      url: window.location.origin + `/product/${product.value.id}`,
    })
  }
}

// Похожие товары
const relatedProducts = computed(() => {
  if (!product.value) return []

  return productsStore.products
    .filter(
      (p) =>
        p.id !== product.value!.id &&
        p.category === 'cigars' &&
        (p.brand === product.value!.brand || p.country === product.value!.country),
    )
    .slice(0, 4)
})

// Работа с изображениями
const getImageUrl = (imageName: string | undefined): string => {
  // Проверяем, что imageName не undefined
  if (!imageName || imageName.trim() === '') {
    return '/images/products/default.jpg'
  }

  if (imageName.startsWith('http') || imageName.startsWith('/')) {
    return imageName
  }

  return `/images/products/${imageName}`
}

const setMainImage = (image: string | undefined) => {
  if (image) {
    mainImage.value = image
  }
}
const currentMainImage = computed<string>(() => {
  const fallback = 'default.jpg'
  const firstImage = product.value?.images[0]
  return mainImage.value || firstImage || fallback
})

onMounted(() => {
  const images = product.value?.images
  if (images && images.length > 0) {
    mainImage.value = images[0] as string // или просто images[0]
  }
})
</script>

<style scoped>
.qa-btn--active {
  background: #e74c3c !important;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.4);
}

.qa-btn--active span {
  font-weight: bold;
}

.add-cart-btn--active {
  background: #10b981 !important;
  color: white;
}

.add-cart-btn--active:hover {
  background: #059669 !important;
  color: white;
}

.thumbnail-active {
  border-color: var(--primary-color) !important;
  border-width: 3px !important;
}

/* Остальные стили остаются без изменений */
.product-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 80px;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Хлебные крошки */
.breadcrumbs {
  padding: 2rem 0 1rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 2rem;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--primary-color);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #999;
}

.breadcrumb-current {
  color: var(--text-dark);
  font-weight: 500;
}

/* Основная информация о товаре */
.product-detail {
  margin-bottom: 4rem;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  /* margin-bottom: 3rem; */
}

.product-main_action {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* Изображения */
.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fbfaf9;
}

.main-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); */
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  border-color: var(--primary-color);
}

/* Информация о товаре */
.product-info {
  padding: 1rem 0;
}

.product-header {
  margin-bottom: 1.5rem;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-dark);
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.product-brand {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.rating-stars {
  color: var(--secondary-color);
  font-size: 1.2rem;
}

.rating-value {
  color: #666;
  font-weight: 500;
}

.product-price-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.product-price {
  /* font-family: 'Courier New', Courier, monospace; */
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  flex-shrink: 1;
  min-width: 0;
}

.price-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  min-width: 0;
}

.price-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.in-stock-badge {
  background: #10b981;
  color: white;
  padding: 6px 12px;
  width: max-content;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.out-of-stock-badge {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.quick-actions {
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qa-btn {
  background: #f7f5f5;
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

.product-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-to-cart-btn {
  flex: 1;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--gold-color);
  color: black;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.product-description p {
  line-height: 1.6;
  color: #666;
}

/* Детальная информация */
.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  /* margin-bottom: 3rem;
  padding: 2rem 0; */
  border-top: 1px solid #f0f0f0;
}

.details-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.specs-grid {
  display: flex;
  flex-direction: column;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f8f8;
}

.spec-label {
  color: #666;
  font-weight: 500;
}

.spec-value {
  color: var(--text-dark);
  font-weight: 600;
}

/* Вкусовой профиль */
.flavor-profile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flavor-family {
  font-size: 1rem;
  color: var(--text-dark);
}

.flavor-notes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.flavor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.flavor-tag {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #666;
}

/* Похожие товары */
.related-products {
  padding: 2rem 0;
  border-top: 1px solid #f0f0f0;
}

.related-products h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.related-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Сообщение об отсутствии товара */
.product-not-found {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.product-not-found h2 {
  margin: 0 0 1rem 0;
  color: var(--text-dark);
  font-weight: 500;
}

.product-not-found p {
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.back-to-catalog-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.back-to-catalog-btn:hover {
  background: #6b3710;
}

/* Адаптивность */
@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 0.4fr 0.8fr;
    gap: 3rem;
    margin-bottom: 0;
  }

  .product-details {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-title {
    font-size: 2rem;
  }

  .product-price {
    font-size: 2rem;
  }

  .product-actions {
    flex-direction: column;
  }

  .breadcrumbs {
    padding: 1rem 0 1rem;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0;
  }

  .related-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .product-container {
    padding: 0 15px;
  }

  .product-title {
    font-size: 1.75rem;
  }

  .product-main {
    grid-template-columns: 1fr;
    gap: 2px;
    margin-bottom: 0;
  }

  .price-item {
    flex-wrap: wrap;
  }

  .image-thumbnails {
    justify-content: center;
  }
}
</style>
