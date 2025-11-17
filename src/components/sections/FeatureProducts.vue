<template>
  <section class="featured-products" ref="sectionRef">
    <div class="container-feature">

      <!-- Заголовок с параллаксом -->
      <div class="section-heading" :style="parallaxStyle">
        <h2>Рекомендуемые товары</h2>
        <p>Лучшие сигары и аксессуары из нашей коллекции</p>
        <div class="decor-line"></div>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="loading" class="skeleton-container">
        <div v-for="n in 3" :key="n" class="skeleton-card"></div>
      </div>

      <!-- Слайдер -->
      <Swiper
        v-else
        class="products-slider"
        :modules="modules"
        :slides-per-view="1.2"
        :space-between="20"
        :loop="true"
        :autoplay="{ delay: 3500 }"
        :navigation="{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }"
        :breakpoints="{
          640: { slidesPerView: 2.2, spaceBetween: 25 },
          1024: { slidesPerView: 3.2, spaceBetween: 30 }
        }"
      >
        <SwiperSlide v-for="product in featuredProducts" :key="product.id">
          <ProductCard :product="product" catalogView />
        </SwiperSlide>

        <!-- Навигация -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </Swiper>

      <!-- Кнопка с параллаксом -->
      <div
        class="catalog-btn-wrapper"

      >
        <router-link to="/catalog" class="catalog-btn"        ref="buttonRef"
        :style="parallaxButtonStyle">
          Весь каталог
        </router-link>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ui/ProductCard.vue'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const productsStore = useProductsStore()

// Swiper modules
const modules = [Autoplay, Navigation]

// Загрузка (скелетон)
const loading = ref(true)
setTimeout(() => (loading.value = false), 1200)

// Товары
const featuredProducts = computed(() => productsStore.featuredProducts)

// Параллакс заголовка
const sectionRef = ref<HTMLElement | null>(null)
const parallaxY = ref(0)

const parallaxStyle = computed(() => ({
  transform: `translateY(${parallaxY.value}px)`
}))

// Параллакс кнопки
const buttonRef = ref<HTMLElement | null>(null)
const parallaxButton = ref(0)

const parallaxButtonStyle = computed(() => ({
  transform: `translateY(${parallaxButton.value}px)`
}))

onMounted(() => {
  window.addEventListener('scroll', () => {
    if (!sectionRef.value) return

    // Заголовок
    const rect = sectionRef.value.getBoundingClientRect()
    const progress = Math.min(Math.max(rect.top / 5, -40), 40)
    parallaxY.value = progress

    // Кнопка
    if (buttonRef.value) {
      const btnRect = buttonRef.value.getBoundingClientRect()
      const btnProgress = Math.min(Math.max(btnRect.top / 8, -30), 30)
      parallaxButton.value = btnProgress
    }
  })
})
</script>

<style scoped>
.container-feature {
  margin: 0 auto;
}

/* SECTION */
.featured-products {
  padding: 1rem 0 4rem;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

/* Декоративное пятно */
.featured-products::before {
  content: "";
  position: absolute;
  top: -120px;
  right: -120px;
  width: 280px;
  height: 280px;
  background: radial-gradient(rgba(201, 160, 55, 0.18), transparent);
  border-radius: 50%;
  filter: blur(40px);
}

/* Заголовок */
.section-heading {
  text-align: center;
  margin-bottom: 3rem;
  transition: transform .3s ease-out;
}

.section-heading h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-dark);
}

.section-heading p {
  color: #666;
  margin: .5rem 0 1rem;
}

.decor-line {
  width: 70px;
  height: 3px;
  background: var(--primary-color);
  margin: 0 auto;
  border-radius: 2px;
}

/* Skeleton */
.skeleton-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-card {
  height: 330px;
  background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
  border-radius: 12px;
  animation: skeleton 1.2s infinite linear;
  background-size: 200% 100%;
}

@keyframes skeleton {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* SLIDER */
.products-slider {
  width: 100%;
  margin: 0 auto 3rem;
  padding: 1rem 0 3rem;
}

/* Навигация */
.swiper-button-prev,
.swiper-button-next {
  color: var(--primary-color);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 16px;
  font-weight: bold;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Кнопка */
.catalog-btn-wrapper {
  text-align: center;
  margin-top: 2rem;
  transition: transform .3s ease-out;
}

.catalog-btn {
  display: inline-block;
  padding: 0.9rem 2.3rem;
  background-color: var(--primary-color);
  color: #e4e4e4;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: 0.25s ease;
}

.catalog-btn:hover {
  transform: translateY(-3px);
  background: var(--gold-color);
  color: black;
}

@media (max-width: 768px) {
  .featured-products {
    padding: 1.5rem 0;
  }

  .section-heading h2 {
    font-size: 1.7rem;
  }

  .skeleton-container {
    grid-template-columns: repeat(1, 1fr);
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}
</style>
