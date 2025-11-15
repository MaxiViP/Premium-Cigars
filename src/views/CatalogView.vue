<template>
  <div class="catalog-page">
    <div class="catalog-container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">Главная</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">Каталог сигар</span>
      </nav>

      <!-- Заголовок и фильтры -->
      <div class="catalog-header">
        <h1 class="catalog-title">Каталог сигар</h1>
        <div class="catalog-controls">
          <div class="filter-toggle" @click="toggleFilters">
            <span>Фильтры</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
          <div class="sort-control">
            <select v-model="sortBy" class="sort-select">
              <option value="name">По названию</option>
              <option value="price">По цене</option>
              <option value="brand">По бренду</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>
      </div>

      <div class="catalog-layout">
        <div
          class="filters-overlay"
          :class="{ 'filters-overlay--active': showFilters }"
          @click="closeFilters"
        ></div>

        <!-- Боковая панель фильтров -->
        <aside class="filters-sidebar" :class="{ 'filters-sidebar--open': showFilters }">
          <div class="filters-header">
            <h3>Фильтры</h3>
            <button class="close-filters" @click="closeFilters">×</button>
          </div>

          <!-- Активные фильтры -->
          <div v-if="activeFiltersCount > 0" class="active-filters">
            <div class="active-filters-header">
              <span>Активные фильтры ({{ activeFiltersCount }})</span>
              <button @click="resetFilters" class="clear-all">Очистить все</button>
            </div>
            <div class="active-filters-tags">
              <span v-for="filter in activeFilters" :key="filter.key" class="filter-tag">
                {{ filter.label }}
                <button @click="removeFilter(filter.key, filter.value)">×</button>
              </span>
            </div>
          </div>

          <!-- Фильтр по цене - В САМЫЙ ВЕРХ -->
          <div class="filter-group">
            <h4 class="filter-title">Цена, ₽</h4>
            <div class="price-filter">
              <div class="price-inputs">
                <div class="price-input-group">
                  <label>от</label>
                  <input
                    type="number"
                    v-model.number="minPrice"
                    @change="applyFilters"
                    class="price-input"
                  />
                </div>
                <div class="price-input-group">
                  <label>до</label>
                  <input
                    type="number"
                    v-model.number="maxPrice"
                    @change="applyFilters"
                    class="price-input"
                  />
                </div>
              </div>
              <div class="price-slider">
                <input
                  type="range"
                  :min="availableMinPrice"
                  :max="availableMaxPrice"
                  v-model.number="minPrice"
                  @input="applyFilters"
                  class="range-slider"
                />
                <input
                  type="range"
                  :min="availableMinPrice"
                  :max="availableMaxPrice"
                  v-model.number="maxPrice"
                  @input="applyFilters"
                  class="range-slider"
                />
              </div>
              <div class="price-range">
                <span>{{ formatPrice(minPrice) }}</span>
                <span>—</span>
                <span>{{ formatPrice(maxPrice) }}</span>
              </div>
            </div>
          </div>

          <!-- Фильтр по брендам -->
          <div class="filter-group">
            <h4 class="filter-title">Бренд</h4>
            <div class="filter-options">
              <label v-for="brand in brands" :key="brand" class="filter-option">
                <input
                  type="checkbox"
                  :value="brand"
                  v-model="selectedBrands"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ brand }}</span>
                <span class="option-count">({{ getBrandCount(brand) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по странам -->
          <div class="filter-group">
            <h4 class="filter-title">Страна</h4>
            <div class="filter-options">
              <label v-for="country in countries" :key="country" class="filter-option">
                <input
                  type="checkbox"
                  :value="country"
                  v-model="selectedCountries"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ country }}</span>
                <span class="option-count">({{ getCountryCount(country) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по формату -->
          <div class="filter-group">
            <h4 class="filter-title">Формат</h4>
            <div class="filter-options">
              <label v-for="format in formats" :key="format" class="filter-option">
                <input
                  type="checkbox"
                  :value="format"
                  v-model="selectedFormats"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ format }}</span>
                <span class="option-count">({{ getFormatCount(format) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по крепости -->
          <div class="filter-group">
            <h4 class="filter-title">Крепость</h4>
            <div class="filter-options">
              <label v-for="strength in strengths" :key="strength" class="filter-option">
                <input
                  type="checkbox"
                  :value="strength"
                  v-model="selectedStrengths"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ strength }}</span>
                <span class="option-count">({{ getStrengthCount(strength) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по времени курения -->
          <div class="filter-group">
            <h4 class="filter-title">Время курения</h4>
            <div class="filter-options">
              <label v-for="time in smokingTimes" :key="time" class="filter-option">
                <input
                  type="checkbox"
                  :value="time"
                  v-model="selectedSmokingTimes"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ time }}</span>
                <span class="option-count">({{ getSmokingTimeCount(time) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по семейству вкусов -->
          <div class="filter-group">
            <h4 class="filter-title">Семейство вкусов</h4>
            <div class="filter-options">
              <label v-for="family in flavorFamilies" :key="family" class="filter-option">
                <input
                  type="checkbox"
                  :value="family"
                  v-model="selectedFlavorFamilies"
                  @change="applyFilters"
                />
                <span class="checkmark"></span>
                <span class="option-text">{{ family }}</span>
                <span class="option-count">({{ getFlavorFamilyCount(family) }})</span>
              </label>
            </div>
          </div>

          <!-- Фильтр по нотам вкуса -->
          <div class="filter-group">
            <h4 class="filter-title">Ноты вкуса</h4>
            <div class="flavor-tags">
              <button
                v-for="note in flavorNotes"
                :key="note"
                :class="[
                  'flavor-tag',
                  { 'flavor-tag--active': selectedFlavorNotes.includes(note) },
                ]"
                @click="toggleFlavorNote(note)"
              >
                {{ note }}
              </button>
            </div>
          </div>

          <!-- Фильтр по длине -->
          <div class="filter-group">
            <h4 class="filter-title">Длина (мм)</h4>
            <div class="range-filter">
              <div class="range-values">
                <span>{{ minLength }}</span>
                <span>{{ maxLength }}</span>
              </div>
              <input
                type="range"
                :min="availableMinLength"
                :max="availableMaxLength"
                v-model="minLength"
                @change="applyFilters"
                class="range-slider"
              />
              <input
                type="range"
                :min="availableMinLength"
                :max="availableMaxLength"
                v-model="maxLength"
                @change="applyFilters"
                class="range-slider"
              />
            </div>
          </div>

          <!-- Фильтр по калибру -->
          <div class="filter-group">
            <h4 class="filter-title">Калибр (RG)</h4>
            <div class="range-filter">
              <div class="range-values">
                <span>{{ minRingGauge }}</span>
                <span>{{ maxRingGauge }}</span>
              </div>
              <input
                type="range"
                :min="availableMinRingGauge"
                :max="availableMaxRingGauge"
                v-model="minRingGauge"
                @change="applyFilters"
                class="range-slider"
              />
              <input
                type="range"
                :min="availableMinRingGauge"
                :max="availableMaxRingGauge"
                v-model="maxRingGauge"
                @change="applyFilters"
                class="range-slider"
              />
            </div>
          </div>

          <!-- Кнопка сброса фильтров -->
          <button class="reset-filters-btn" @click="resetFilters">Сбросить все фильтры</button>
        </aside>

        <!-- Основной контент - ТОВАРЫ СПРАВА -->
        <main class="catalog-main">
          <!-- Статистика -->
          <div class="products-stats">Найдено товаров: {{ filteredProducts.length }}</div>

          <!-- Сетка товаров -->
          <div class="products-grid">
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :product="product"
              class="catalog-product-card"
            />
          </div>

          <!-- Сообщение если товаров нет -->
          <div v-if="filteredProducts.length === 0" class="no-products">
            <div class="no-products-icon">🚬</div>
            <h3>Товары не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
            <button class="reset-filters-btn" @click="resetFilters">Сбросить фильтры</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ui/ProductCard.vue'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types/Product'

const productsStore = useProductsStore()
const showFilters = ref(false)
const sortBy = ref<'name' | 'price' | 'brand' | 'rating'>('name')

// Все фильтры
const selectedBrands = ref<string[]>([])
const selectedCountries = ref<string[]>([])
const selectedFormats = ref<string[]>([])
const selectedStrengths = ref<string[]>([])
const selectedSmokingTimes = ref<string[]>([])
const selectedFlavorFamilies = ref<string[]>([])
const selectedFlavorNotes = ref<string[]>([])
const minPrice = ref(0)
const maxPrice = ref(10000)
const minLength = ref(0)
const maxLength = ref(200)
const minRingGauge = ref(0)
const maxRingGauge = ref(60)

// Получаем уникальные значения для фильтров
const cigars = computed(() => {
  return productsStore.products.filter((p) => p.category === 'cigars') as Product[]
})

// Диапазоны цен
const availableMinPrice = computed(() => {
  return Math.min(...cigars.value.map((p) => p.price))
})

const availableMaxPrice = computed(() => {
  return Math.max(...cigars.value.map((p) => p.price))
})

const brands = computed(() => {
  const allBrands = cigars.value.map((p) => p.brand)
  return [...new Set(allBrands)].sort()
})

const countries = computed(() => {
  const allCountries = cigars.value.map((p) => p.country)
  return [...new Set(allCountries)].sort()
})

const formats = computed(() => {
  const allFormats = cigars.value.map((p) => p.format)
  return [...new Set(allFormats)].sort()
})

const strengths = computed(() => {
  const allStrengths = cigars.value.map((p) => p.strength)
  return [...new Set(allStrengths)]
})

const smokingTimes = computed(() => {
  const allTimes = cigars.value.map((p) => p.smokingTime)
  return [...new Set(allTimes)].sort((a, b) => {
    const timeOrder = ['до 15 минут', 'до 20 минут', 'до 30 минут', 'до 45 минут', 'до 60 минут']
    return timeOrder.indexOf(a) - timeOrder.indexOf(b)
  })
})

const flavorFamilies = computed(() => {
  const allFamilies = cigars.value.map((p) => p.flavorFamily)
  return [...new Set(allFamilies)].sort()
})

const flavorNotes = computed(() => {
  const allNotes = cigars.value.flatMap((p) => p.flavorNotes)
  return [...new Set(allNotes)].sort()
})

// Диапазоны для слайдеров
const availableMinLength = computed(() => {
  return Math.min(...cigars.value.map((p) => p.length))
})

const availableMaxLength = computed(() => {
  return Math.max(...cigars.value.map((p) => p.length))
})

const availableMinRingGauge = computed(() => {
  return Math.min(...cigars.value.map((p) => p.ringGauge))
})

const availableMaxRingGauge = computed(() => {
  return Math.max(...cigars.value.map((p) => p.ringGauge))
})

// Функции для подсчета
const getBrandCount = (brand: string) => {
  return cigars.value.filter((p) => p.brand === brand).length
}

const getCountryCount = (country: string) => {
  return cigars.value.filter((p) => p.country === country).length
}

const getFormatCount = (format: string) => {
  return cigars.value.filter((p) => p.format === format).length
}

const getStrengthCount = (strength: string) => {
  return cigars.value.filter((p) => p.strength === strength).length
}

const getSmokingTimeCount = (time: string) => {
  return cigars.value.filter((p) => p.smokingTime === time).length
}

const getFlavorFamilyCount = (family: string) => {
  return cigars.value.filter((p) => p.flavorFamily === family).length
}

// Активные фильтры
const activeFilters = computed(() => {
  const filters = []

  // Фильтр по цене
  if (minPrice.value > availableMinPrice.value || maxPrice.value < availableMaxPrice.value) {
    filters.push({
      key: 'price',
      value: `${minPrice.value}-${maxPrice.value}`,
      label: `Цена: ${formatPrice(minPrice.value)} - ${formatPrice(maxPrice.value)}`,
    })
  }

  selectedBrands.value.forEach((brand) => {
    filters.push({ key: 'brand', value: brand, label: `Бренд: ${brand}` })
  })

  selectedCountries.value.forEach((country) => {
    filters.push({ key: 'country', value: country, label: `Страна: ${country}` })
  })

  selectedFormats.value.forEach((format) => {
    filters.push({ key: 'format', value: format, label: `Формат: ${format}` })
  })

  selectedStrengths.value.forEach((strength) => {
    filters.push({ key: 'strength', value: strength, label: `Крепость: ${strength}` })
  })

  selectedSmokingTimes.value.forEach((time) => {
    filters.push({ key: 'smokingTime', value: time, label: `Время: ${time}` })
  })

  selectedFlavorFamilies.value.forEach((family) => {
    filters.push({ key: 'flavorFamily', value: family, label: `Вкус: ${family}` })
  })

  selectedFlavorNotes.value.forEach((note) => {
    filters.push({ key: 'flavorNote', value: note, label: `Нота: ${note}` })
  })

  if (minLength.value > availableMinLength.value || maxLength.value < availableMaxLength.value) {
    filters.push({
      key: 'length',
      value: `${minLength.value}-${maxLength.value}`,
      label: `Длина: ${minLength.value}-${maxLength.value}мм`,
    })
  }

  if (
    minRingGauge.value > availableMinRingGauge.value ||
    maxRingGauge.value < availableMaxRingGauge.value
  ) {
    filters.push({
      key: 'ringGauge',
      value: `${minRingGauge.value}-${maxRingGauge.value}`,
      label: `Калибр: ${minRingGauge.value}-${maxRingGauge.value}RG`,
    })
  }

  return filters
})

const activeFiltersCount = computed(() => activeFilters.value.length)

// Фильтрация товаров
const filteredProducts = computed(() => {
  let filtered = [...cigars.value]

  // Фильтр по цене
  filtered = filtered.filter((p) => p.price >= minPrice.value && p.price <= maxPrice.value)

  // Остальные фильтры
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.value.includes(p.brand))
  }

  if (selectedCountries.value.length > 0) {
    filtered = filtered.filter((p) => selectedCountries.value.includes(p.country))
  }

  if (selectedFormats.value.length > 0) {
    filtered = filtered.filter((p) => selectedFormats.value.includes(p.format))
  }

  if (selectedStrengths.value.length > 0) {
    filtered = filtered.filter((p) => selectedStrengths.value.includes(p.strength))
  }

  if (selectedSmokingTimes.value.length > 0) {
    filtered = filtered.filter((p) => selectedSmokingTimes.value.includes(p.smokingTime))
  }

  if (selectedFlavorFamilies.value.length > 0) {
    filtered = filtered.filter((p) => selectedFlavorFamilies.value.includes(p.flavorFamily))
  }

  if (selectedFlavorNotes.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedFlavorNotes.value.some((note) => p.flavorNotes.includes(note)),
    )
  }

  filtered = filtered.filter((p) => p.length >= minLength.value && p.length <= maxLength.value)

  filtered = filtered.filter(
    (p) => p.ringGauge >= minRingGauge.value && p.ringGauge <= maxRingGauge.value,
  )

  return filtered
})

// Сортировка товаров
const sortedProducts = computed(() => {
  const products = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'name':
      return products.sort((a, b) => a.name.localeCompare(b.name))
    case 'price':
      return products.sort((a, b) => a.price - b.price)
    case 'brand':
      return products.sort((a, b) => a.brand.localeCompare(b.brand))
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating)
    default:
      return products
  }
})

// Методы фильтрации
const applyFilters = () => {
  // Фильтры применяются автоматически через computed
}

// const closeFilters = () => {
//   showFilters.value = false
// }

const resetFilters = () => {
  selectedBrands.value = []
  selectedCountries.value = []
  selectedFormats.value = []
  selectedStrengths.value = []
  selectedSmokingTimes.value = []
  selectedFlavorFamilies.value = []
  selectedFlavorNotes.value = []
  minPrice.value = availableMinPrice.value
  maxPrice.value = availableMaxPrice.value
  minLength.value = availableMinLength.value
  maxLength.value = availableMaxLength.value
  minRingGauge.value = availableMinRingGauge.value
  maxRingGauge.value = availableMaxRingGauge.value
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const closeFilters = () => {
  showFilters.value = false
}

const toggleFlavorNote = (note: string) => {
  const index = selectedFlavorNotes.value.indexOf(note)
  if (index > -1) {
    selectedFlavorNotes.value.splice(index, 1)
  } else {
    selectedFlavorNotes.value.push(note)
  }
}

const removeFilter = (key: string, value: string) => {
  switch (key) {
    case 'price':
      minPrice.value = availableMinPrice.value
      maxPrice.value = availableMaxPrice.value
      break
    case 'brand':
      selectedBrands.value = selectedBrands.value.filter((b) => b !== value)
      break
    case 'country':
      selectedCountries.value = selectedCountries.value.filter((c) => c !== value)
      break
    case 'format':
      selectedFormats.value = selectedFormats.value.filter((f) => f !== value)
      break
    case 'strength':
      selectedStrengths.value = selectedStrengths.value.filter((s) => s !== value)
      break
    case 'smokingTime':
      selectedSmokingTimes.value = selectedSmokingTimes.value.filter((t) => t !== value)
      break
    case 'flavorFamily':
      selectedFlavorFamilies.value = selectedFlavorFamilies.value.filter((f) => f !== value)
      break
    case 'flavorNote':
      selectedFlavorNotes.value = selectedFlavorNotes.value.filter((n) => n !== value)
      break
    case 'length':
      minLength.value = availableMinLength.value
      maxLength.value = availableMaxLength.value
      break
    case 'ringGauge':
      minRingGauge.value = availableMinRingGauge.value
      maxRingGauge.value = availableMaxRingGauge.value
      break
  }
}

// Инициализация
onMounted(() => {
  minPrice.value = availableMinPrice.value
  maxPrice.value = availableMaxPrice.value
  minLength.value = availableMinLength.value
  maxLength.value = availableMaxLength.value
  minRingGauge.value = availableMinRingGauge.value
  maxRingGauge.value = availableMaxRingGauge.value
})
</script>

<style scoped>
.filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.filters-overlay--active {
  opacity: 1;
  visibility: visible;
}

.catalog-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 80px;
}

.catalog-container {
  max-width: 1400px;
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

/* Заголовок и контролы */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--text-dark);
  margin: 0;
}

.catalog-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-toggle:hover {
  background: #f0f0f0;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 150px;
}

/* Основной layout - ФИЛЬТРЫ СЛЕВА, ТОВАРЫ СПРАВА */
.catalog-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1rem;
  align-items: start;
}

/* Боковая панель фильтров */
.filters-sidebar {
  position: sticky;
  top: 100px;
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.filters-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.filters-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-dark);
}

.close-filters {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-filters:hover {
  color: var(--text-dark);
}

/* Активные фильтры */
.active-filters {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.clear-all {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
}

.clear-all:hover {
  color: var(--primary-color);
}

.active-filters-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  color: #666;
}

.filter-tag button {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 1rem;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-tag button:hover {
  color: var(--primary-color);
}

/* Группы фильтров */
.filter-group {
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Фильтр по цене */
.price-filter {
  padding: 0.5rem 0;
}

.price-inputs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.price-input-group label {
  font-size: 0.8rem;
  color: #666;
}

.price-input {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;
}

.price-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.price-slider {
  margin-bottom: 0.5rem;
}

.range-slider {
  width: 100%;
  margin: 0.5rem 0;
}

.price-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

/* Остальные стили фильтров */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.filter-option:hover {
  color: var(--primary-color);
}

.filter-option input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 3px;
  position: relative;
  transition: all 0.3s ease;
}

.filter-option input:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.filter-option input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.option-text {
  font-size: 0.9rem;
  color: var(--text-light);
  flex: 1;
}

.filter-option:hover .option-text {
  color: var(--text-dark);
}

.option-count {
  color: #999;
  font-size: 0.8rem;
}

/* Теги вкусов */
.flavor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.flavor-tag {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.flavor-tag:hover {
  background: #e9ecef;
  border-color: #ccc;
}

.flavor-tag--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Слайдеры диапазонов */
.range-filter {
  padding: 0.5rem 0;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

/* Кнопка сброса */
.reset-filters-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.reset-filters-btn:hover {
  background: #f0f0f0;
  color: var(--text-dark);
}

/* Основной контент */
.catalog-main {
  min-height: 500px;
}

.products-stats {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.catalog-product-card {
  padding: 15px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.catalog-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Сообщение об отсутствии товаров */
.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-products-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-products h3 {
  margin: 0 0 1rem 0;
  color: var(--text-dark);
  font-weight: 500;
}

.no-products p {
  margin: 0 0 2rem 0;
  font-size: 0.9rem;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 280px 1fr;
    gap: 2rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .catalog-container {
    padding: 0 15px;
  }

  .catalog-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .catalog-title {
    font-size: 2rem;
  }

  .catalog-controls {
    justify-content: space-between;
  }

  .filter-toggle {
    display: flex;
  }

  .catalog-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    z-index: 1001;
    border-radius: 0;
    transition: left 0.3s ease;
    overflow-y: auto;
  }

  .filters-sidebar--open {
    left: 0;
  }

  .filters-header {
    display: flex;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .catalog-header,
  .breadcrumbs {
    position: sticky;
    top: 0;
    background: white;
    z-index: 999;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
}

@media (max-width: 480px) {
  .catalog-title {
    font-size: 1.75rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .breadcrumbs {
    padding: 1.5rem 0 1rem;
  }

  .price-inputs {
    flex-direction: column;
  }
}
</style>
