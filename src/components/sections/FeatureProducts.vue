<template>
  <section class="featured-products" ref="sectionRef">
    <div class="container-feature">
      <!-- Заголовок с параллаксом -->
      <div class="section-heading" :style="parallaxStyle">
        <h2 tabindex="-1" autofocus>Рекомендуемые товары</h2>
        <p>Лучшие сигары и аксессуары из нашей коллекции</p>
        <div class="decor-line"></div>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="loading" class="skeleton-container">
        <div v-for="n in 3" :key="n" class="skeleton-card"></div>
      </div>

      <!-- Слайдер -->
      <div v-else class="slider-wrapper">
        <Swiper
          class="products-slider"
          :modules="modules"
          :slides-per-view="1.2"
          :space-between="20"
          :loop="true"
          :centered-slides="true"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true,
          }"
          :speed="800"
          :navigation="{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }"
          :breakpoints="{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 20,
              autoplay: { delay: 3000 },
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 25,
              autoplay: { delay: 3500 },
            },
            1024: {
              slidesPerView: 3.2,
              spaceBetween: 30,
              autoplay: { delay: 4000 },
            },
          }"
          @swiper="onSwiper"
        >
          <SwiperSlide v-for="product in featuredProducts" :key="product.id">
            <div class="slide-inner">
              <ProductCard :product="product" :catalog-view="true" />
            </div>
          </SwiperSlide>

          <!-- Навигация -->
          <div class="swiper-button-prev">
            <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
              <path
                d="M10.617 0.0762C10.8882 0.347 10.8882 0.7866 10.617 1.0578L1.8024 9.8724L10.617 18.687C10.8882 18.9582 10.8882 19.3979 10.617 19.669C10.3459 19.9402 9.9062 19.9402 9.635 19.669L0.5659 10.5999C0.1641 10.1981 0.1641 9.5467 0.5659 9.145L9.635 0.0762C9.9062 -0.195 10.3459 -0.195 10.617 0.0762Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="swiper-button-next">
            <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
              <path
                d="M0.383 0.0762C0.1118 0.347 0.1118 0.7866 0.383 1.0578L9.1976 9.8724L0.383 18.687C0.1118 18.9582 0.1118 19.3979 0.383 19.669C0.6542 19.9402 1.0938 19.9402 1.365 19.669L10.4341 10.5999C10.8359 10.1981 10.8359 9.5467 10.4341 9.145L1.365 0.0762C1.0938 -0.195 0.6542 -0.195 0.383 0.0762Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Swiper>
      </div>

      <!-- Кнопка -->
      <div class="catalog-btn-wrapper">
        <router-link to="/catalog" class="catalog-btn">
          <span>Весь каталог</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
              fill="currentColor"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import ProductCard from '@/components/ui/ProductCard.vue'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { Swiper as SwiperType } from 'swiper'

const productsStore = useProductsStore()
const authStore = useAuthStore()

// Swiper modules
const modules = [Autoplay, Navigation]

// Имитация задержки (загрузка)
const loading = ref(true)
setTimeout(() => {
  loading.value = false
}, 1200)

// Товары
const featuredProducts = computed(() => productsStore.featuredProducts)

// Swiper instance
const swiperInstance = ref<SwiperType | null>(null)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper

  // Убедимся, что автоплей работает
  if (swiper.autoplay?.running === false) {
    swiper.autoplay.start()
  }

  // Проверка автоплея
  console.log('Swiper инициализирован. Autoplay running:', swiper.autoplay?.running)
}

// Parallax
const sectionRef = ref<HTMLElement | null>(null)
const parallaxY = ref(0)

const parallaxStyle = computed(() => ({
  transform: `translateY(${parallaxY.value}px)`,
}))

// Функция для принудительного обновления автоплея
const ensureAutoplay = () => {
  if (swiperInstance.value && !swiperInstance.value.autoplay?.running) {
    console.log('Перезапуск автоплея')
    swiperInstance.value.autoplay?.start()
  }
}

onMounted(() => {
  // Проверяем и запускаем автоплей через 2 секунды после загрузки
  setTimeout(ensureAutoplay, 1000)

  // Проверяем каждые 5 секунд
  const autoplayCheckInterval = setInterval(ensureAutoplay, 5000)

  // Parallax эффект
  window.addEventListener('scroll', () => {
    if (!sectionRef.value) return
    const rect = sectionRef.value.getBoundingClientRect()
    const progress = Math.min(Math.max(rect.top / 5, -40), 40)
    parallaxY.value = progress
  })

  onUnmounted(() => {
    clearInterval(autoplayCheckInterval)
  })
})
</script>

<style scoped>
.container-feature {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* SECTION */
.featured-products {
  padding: 3rem 0 5rem;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

/* Декор элементы */
.featured-products::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 280px;
  height: 280px;
  background: radial-gradient(rgba(201, 160, 55, 0.15), transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
}

.featured-products::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 200px;
  height: 200px;
  background: radial-gradient(rgba(139, 139, 139, 0.08), transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  z-index: 0;
}

/* Заголовок */
.section-heading {
  text-align: center;
  margin-bottom: 4rem;
  transition: transform 0.3s ease-out;
  position: relative;
  z-index: 1;
}

.section-heading h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #2c3e50 0%, #4a6572 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-heading p {
  color: #666;
  font-size: 1.1rem;
  margin: 0.5rem 0 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.decor-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--gold-color));
  margin: 0 auto;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.decor-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

/* Skeleton */
.skeleton-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-card {
  height: 380px;
  background: linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
  border-radius: 16px;
  animation: skeleton 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Slider Wrapper */
.slider-wrapper {
  position: relative;
  margin: 0 auto 4rem;
  padding: 1rem 0;
}

/* SLIDER */
.products-slider {
  width: 100%;
  /* padding: 2rem 0 4rem; */
  position: relative;
  overflow: visible !important;
}

/* Стили для слайдов через deep */
:deep(.products-slider .swiper-wrapper) {
  align-items: center;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.products-slider .slide-inner) {
  padding: 5px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.products-slider .swiper-slide) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* Центральный слайд */
:deep(.swiper-slide-active .slide-inner) {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

:deep(.swiper-slide-active) {
  z-index: 10;
}

/* Боковые слайды */
:deep(.swiper-slide-prev .slide-inner),
:deep(.swiper-slide-next .slide-inner) {
  transform: scale(0.95);
  opacity: 0.85;
}

/* Крайние слайды */
:deep(
  .swiper-slide:not(.swiper-slide-active):not(.swiper-slide-next):not(.swiper-slide-prev)
    .slide-inner
) {
  transform: scale(0.9);
  opacity: 0.6;
}

/* Кнопки слайдера */
.swiper-button-prev,
.swiper-button-next {
  color: var(--text-dark);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-prev {
  left: -20px;
}

.swiper-button-next {
  right: -20px;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.swiper-button-prev svg,
.swiper-button-next svg {
  width: 14px;
  height: 24px;
  transition: transform 0.3s ease;
}

.swiper-button-prev:hover svg {
  transform: translateX(-2px);
}

.swiper-button-next:hover svg {
  transform: translateX(2px);
}

.swiper-button-prev::after,
.swiper-button-next::after {
  display: none;
}

/* Catalog button */
.catalog-btn-wrapper {
  text-align: center;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.catalog-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--gold-color));
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.catalog-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.7s ease;
}

.catalog-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.catalog-btn:hover::before {
  left: 100%;
}

.catalog-btn:hover svg {
  transform: translateX(4px);
}

.catalog-btn svg {
  transition: transform 0.3s ease;
  width: 16px;
  height: 16px;
}

/* Адаптация */
@media (max-width: 1200px) {
  .container-feature {
    padding: 0 1.5rem;
  }

  .swiper-button-prev {
    left: 10px;
  }

  .swiper-button-next {
    right: 10px;
  }
}

@media (max-width: 768px) {
  .featured-products {
    padding: 2rem 0 3rem;
  }

  .container-feature {
    padding: 0 1rem;
  }

  .section-heading {
    margin-bottom: 2.5rem;
  }

  .section-heading h2 {
    font-size: 2rem;
  }

  .section-heading p {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .slider-wrapper {
    margin: 0 auto 3rem;
    padding: 0.5rem 0;
  }

  .products-slider {
    padding: 1rem 0 2rem;
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }

  .skeleton-container {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }

  .catalog-btn {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }

  :deep(.products-slider .slide-inner) {
    padding: 3px;
  }
}

@media (max-width: 480px) {
  .section-heading h2 {
    font-size: 1.7rem;
  }

  .featured-products::before {
    width: 180px;
    height: 180px;
    top: -60px;
    right: -60px;
  }
}
</style>
