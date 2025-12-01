<template>
  <div class="catalog-page">
    <div class="catalog-container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumbs">
        <router-link to="/" class="breadcrumb-link">Главная</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">Каталог {{ currentCategoryTitle }}</span>
      </nav>

      <!-- Заголовок и фильтры -->
      <div class="catalog-header">
        <h1 class="catalog-title">Каталог {{ currentCategoryTitle }}</h1>

        <!-- Переключатель категории -->
        <div class="category-tabs">
          <button
            :class="{ 'category-tab--active': category === 'cigars' }"
            @click="setCategory('cigars')"
            class="category-tab"
          >
            Сигары
          </button>
          <button
            :class="{ 'category-tab--active': category === 'accessories' }"
            @click="setCategory('accessories')"
            class="category-tab"
          >
            Аксессуары
          </button>
        </div>

        <div class="catalog-controls">
          <div class="filter-toggle" @click="toggleFilters">
            <span>Фильтры</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
          <div class="sort-control">
            <div class="sort-buttons" role="radiogroup" aria-label="Сортировка">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                :class="{ active: sortBy === option.value }"
                @click="sortBy = option.value"
                class="sort-btn"
                type="button"
              >
                {{ option.label }}
              </button>
            </div>
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
          <!-- Крестик закрытия -->
          <button class="filters-sidebar__close" @click="closeFilters" aria-label="Закрыть фильтры">
            ×
          </button>
          <!-- Кнопки управления группами -->
          <div v-if="activeFiltersCount > 0" class="filter-actions">
            <button @click="openAllGroups" class="filter-action-btn">Развернуть все</button>
            <button @click="closeAllGroups" class="filter-action-btn">Свернуть все</button>
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

          <!-- Фильтр по цене (всегда открыт) -->
          <div class="filter-group">
            <div class="filter-header" @click="toggleFilterGroup('price')">
              <h4 class="filter-title">Цена, ₽</h4>
              <svg
                class="filter-arrow"
                :class="{ 'filter-arrow--open': isGroupOpen('price') }"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M4 6l4 4 4-4" fill="currentColor" />
              </svg>
            </div>

            <transition name="filter-collapse">
              <div v-show="isGroupOpen('price')" class="filter-content">
                <div class="price-filter">
                  <div class="price-inputs">
                    <div class="price-input-group">
                      <label>от</label>
                      <input
                        type="number"
                        v-model.number="minPrice"
                        @change="applyFilters"
                        @wheel="preventScroll"
                        class="price-input"
                      />
                    </div>
                    <div class="price-input-group">
                      <label>до</label>
                      <input
                        type="number"
                        v-model.number="maxPrice"
                        @change="applyFilters"
                        @wheel="preventScroll"
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
            </transition>
          </div>

          <!-- Фильтры только для сигар -->
          <template v-if="category === 'cigars'">
            <!-- Бренд -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('brand')">
                <h4 class="filter-title">Бренд</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('brand') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('brand')" class="filter-content">
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
              </transition>
            </div>

            <!-- Страна -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('country')">
                <h4 class="filter-title">Страна</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('country') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('country')" class="filter-content">
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
              </transition>
            </div>

            <!-- Формат -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('format')">
                <h4 class="filter-title">Формат</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('format') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('format')" class="filter-content">
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
              </transition>
            </div>

            <!-- Крепость -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('strength')">
                <h4 class="filter-title">Крепость</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('strength') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('strength')" class="filter-content">
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
              </transition>
            </div>

            <!-- Время курения -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('smokingTime')">
                <h4 class="filter-title">Время курения</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('smokingTime') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('smokingTime')" class="filter-content">
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
              </transition>
            </div>

            <!-- Семейство вкусов -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('flavorFamily')">
                <h4 class="filter-title">Семейство вкусов</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('flavorFamily') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('flavorFamily')" class="filter-content">
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
              </transition>
            </div>

            <!-- Ноты вкуса -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('flavorNotes')">
                <h4 class="filter-title">Ноты вкуса</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('flavorNotes') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('flavorNotes')" class="filter-content">
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
              </transition>
            </div>

            <!-- Длина -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('length')">
                <h4 class="filter-title">Длина (мм)</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('length') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('length')" class="filter-content">
                  <div class="range-filter">
                    <div class="range-values">
                      <span>{{ minLength }}</span>
                      <span>{{ maxLength }}</span>
                    </div>
                    <input
                      type="range"
                      :min="availableMinLength"
                      :max="availableMaxLength"
                      v-model.number="minLength"
                      @input="applyFilters"
                      class="range-slider"
                    />
                    <input
                      type="range"
                      :min="availableMinLength"
                      :max="availableMaxLength"
                      v-model.number="maxLength"
                      @input="applyFilters"
                      class="range-slider"
                    />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Калибр -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('ringGauge')">
                <h4 class="filter-title">Калибр (RG)</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('ringGauge') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('ringGauge')" class="filter-content">
                  <div class="range-filter">
                    <div class="range-values">
                      <span>{{ minRingGauge }}</span>
                      <span>{{ maxRingGauge }}</span>
                    </div>
                    <input
                      type="range"
                      :min="availableMinRingGauge"
                      :max="availableMaxRingGauge"
                      v-model.number="minRingGauge"
                      @input="applyFilters"
                      class="range-slider"
                    />
                    <input
                      type="range"
                      :min="availableMinRingGauge"
                      :max="availableMaxRingGauge"
                      v-model.number="maxRingGauge"
                      @input="applyFilters"
                      class="range-slider"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <!-- Фильтры только для аксессуаров -->
          <template v-if="category === 'accessories'">
            <!-- Тип аксессуара -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('accessoryType')">
                <h4 class="filter-title">Тип аксессуара</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('accessoryType') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('accessoryType')" class="filter-content">
                  <div class="filter-options">
                    <label v-for="type in accessoryTypes" :key="type" class="filter-option">
                      <input
                        type="checkbox"
                        :value="type"
                        v-model="selectedAccessoryTypes"
                        @change="applyFilters"
                      />
                      <span class="checkmark"></span>
                      <span class="option-text">{{ accessoryTypeLabel(type) }}</span>
                      <span class="option-count">({{ getAccessoryTypeCount(type) }})</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Материал -->
            <div class="filter-group">
              <div class="filter-header" @click="toggleFilterGroup('accessoryMaterial')">
                <h4 class="filter-title">Материал</h4>
                <svg
                  class="filter-arrow"
                  :class="{ 'filter-arrow--open': isGroupOpen('accessoryMaterial') }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" fill="currentColor" />
                </svg>
              </div>

              <transition name="filter-collapse">
                <div v-show="isGroupOpen('accessoryMaterial')" class="filter-content">
                  <div class="filter-options">
                    <label
                      v-for="material in accessoryMaterials"
                      :key="material"
                      class="filter-option"
                    >
                      <input
                        type="checkbox"
                        :value="material"
                        v-model="selectedAccessoryMaterials"
                        @change="applyFilters"
                      />
                      <span class="checkmark"></span>
                      <span class="option-text">{{ material }}</span>
                      <span class="option-count">({{ getAccessoryMaterialCount(material) }})</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <button class="reset-filters-btn" @click="resetFilters">Сбросить все фильтры</button>
        </aside>

        <!-- Основной контент -->
        <main class="catalog-main">
          <div class="products-stats">Найдено товаров: {{ filteredProducts.length }}</div>

          <div class="products-grid">
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :product="product"
              class="catalog-product-card"
            />
          </div>

          <div v-if="filteredProducts.length === 0" class="no-products">
            <div class="no-products-icon"></div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ui/ProductCard.vue'
import { formatPrice } from '@/utils/formatters'
import type { Product, Accessory } from '@/types/Product'

const productsStore = useProductsStore()

interface Filter {
  key: string
  value: string
  label: string
}

type FilterMap = {
  brand: typeof selectedBrands
  country: typeof selectedCountries
  format: typeof selectedFormats
  strength: typeof selectedStrengths
  smokingTime: typeof selectedSmokingTimes
  flavorFamily: typeof selectedFlavorFamilies
  flavorNote: typeof selectedFlavorNotes
}

const sortOptions = [
  { label: 'По названию', value: 'name' as const },
  { label: 'По цене', value: 'price' as const },
  { label: 'По бренду', value: 'brand' as const },
  { label: 'По рейтингу', value: 'rating' as const },
]

// Текущая категория
const category = ref<'cigars' | 'accessories'>('cigars')

// Фильтры для сигар
const selectedBrands = ref<string[]>([])
const selectedCountries = ref<string[]>([])
const selectedFormats = ref<string[]>([])
const selectedStrengths = ref<string[]>([])
const selectedSmokingTimes = ref<string[]>([])
const selectedFlavorFamilies = ref<string[]>([])
const selectedFlavorNotes = ref<string[]>([])
const minLength = ref(100)
const maxLength = ref(250)
const minRingGauge = ref(30)
const maxRingGauge = ref(60)

// Фильтры для аксессуаров
const selectedAccessoryTypes = ref<Array<'Cutter' | 'Lighter' | 'Humidor' | 'Ashtray' | 'Case'>>([])
const selectedAccessoryMaterials = ref<string[]>([])

// Общие фильтры
const minPrice = ref(0)
const maxPrice = ref(100000)
const sortBy = ref<'name' | 'price' | 'brand' | 'rating'>('name')
const showFilters = ref(false)

// Состояние открытых/закрытых групп аккордеона
const openGroups = ref<Record<string, boolean>>({
  price: true, // Цена всегда открыта
  brand: false,
  country: false,
  format: false,
  strength: false,
  smokingTime: false,
  flavorFamily: false,
  flavorNotes: false,
  length: false,
  ringGauge: false,
  accessoryType: false,
  accessoryMaterial: false,
})

// Методы для управления аккордеоном
const toggleFilterGroup = (groupName: string) => {
  openGroups.value[groupName] = !openGroups.value[groupName]
}

const isGroupOpen = (groupName: string) => {
  return openGroups.value[groupName]
}

const openAllGroups = () => {
  Object.keys(openGroups.value).forEach((key) => {
    openGroups.value[key] = true
  })
}

const closeAllGroups = () => {
  Object.keys(openGroups.value).forEach((key) => {
    if (key !== 'price') {
      // Цену не закрываем
      openGroups.value[key] = false
    }
  })
}

// Текущие товары
const currentProducts = computed<Product[]>(() => {
  return productsStore.products.filter((p) => p.category === category.value)
})

// === Диапазоны ===
const availableMinPrice = computed(() =>
  Math.min(...currentProducts.value.map((p) => p.pricePerUnit), 0),
)
const availableMaxPrice = computed(() =>
  Math.max(...currentProducts.value.map((p) => p.pricePerUnit), 100000),
)

const availableMinLength = computed(() =>
  category.value === 'cigars' ? Math.min(...currentProducts.value.map((p) => p.length)) : 100,
)
const availableMaxLength = computed(() =>
  category.value === 'cigars' ? Math.max(...currentProducts.value.map((p) => p.length)) : 250,
)

const availableMinRingGauge = computed(() =>
  category.value === 'cigars' ? Math.min(...currentProducts.value.map((p) => p.ringGauge)) : 30,
)
const availableMaxRingGauge = computed(() =>
  category.value === 'cigars' ? Math.max(...currentProducts.value.map((p) => p.ringGauge)) : 60,
)

// === Списки фильтров для сигар ===
const brands = computed(() => [...new Set(currentProducts.value.map((p) => p.brand))].sort())
const countries = computed(() => [...new Set(currentProducts.value.map((p) => p.country))].sort())
const formats = computed(() => [...new Set(currentProducts.value.map((p) => p.format))].sort())
const strengths = computed(() => [...new Set(currentProducts.value.map((p) => p.strength))])
const smokingTimes = computed(() =>
  [...new Set(currentProducts.value.map((p) => p.smokingTime))].sort((a, b) => {
    const order = ['до 15 минут', 'до 20 минут', 'до 30 минут', 'до 45 минут', 'до 60 минут']
    return order.indexOf(a) - order.indexOf(b)
  }),
)
const flavorFamilies = computed(() =>
  [...new Set(currentProducts.value.map((p) => p.flavorFamily))].sort(),
)
const flavorNotes = computed(() =>
  [...new Set(currentProducts.value.flatMap((p) => p.flavorNotes))].sort(),
)

// === Списки фильтров для аксессуаров ===
const accessoryTypes = computed(() => {
  const acc = currentProducts.value as Accessory[]
  return [...new Set(acc.map((p) => p.type))].sort()
})

const accessoryMaterials = computed(() => {
  const acc = currentProducts.value as Accessory[]
  return [...new Set(acc.map((p) => p.material))].sort()
})

// === Подсчёты ===
const getBrandCount = (brand: string) =>
  currentProducts.value.filter((p) => p.brand === brand).length
const getCountryCount = (country: string) =>
  currentProducts.value.filter((p) => p.country === country).length
const getFormatCount = (format: string) =>
  currentProducts.value.filter((p) => p.format === format).length
const getStrengthCount = (strength: string) =>
  currentProducts.value.filter((p) => p.strength === strength).length
const getSmokingTimeCount = (time: string) =>
  currentProducts.value.filter((p) => p.smokingTime === time).length
const getFlavorFamilyCount = (family: string) =>
  currentProducts.value.filter((p) => p.flavorFamily === family).length
const getAccessoryTypeCount = (type: string) =>
  currentProducts.value.filter((p) => (p as Accessory).type === type).length
const getAccessoryMaterialCount = (material: string) =>
  currentProducts.value.filter((p) => (p as Accessory).material === material).length

// === Активные фильтры ===
const activeFilters = computed<Filter[]>(() => {
  const filters: Filter[] = []

  // Цена
  if (minPrice.value > availableMinPrice.value || maxPrice.value < availableMaxPrice.value) {
    filters.push({
      key: 'price',
      value: 'price',
      label: `Цена: ${formatPrice(minPrice.value)} — ${formatPrice(maxPrice.value)}`,
    })
  }

  if (category.value === 'cigars') {
    const map: FilterMap = {
      brand: selectedBrands,
      country: selectedCountries,
      format: selectedFormats,
      strength: selectedStrengths,
      smokingTime: selectedSmokingTimes,
      flavorFamily: selectedFlavorFamilies,
      flavorNote: selectedFlavorNotes,
    }

    // Добавляем выбранные фильтры
    ;[
      ...selectedBrands.value,
      ...selectedCountries.value,
      ...selectedFormats.value,
      ...selectedStrengths.value,
      ...selectedSmokingTimes.value,
      ...selectedFlavorFamilies.value,
      ...selectedFlavorNotes.value,
    ].forEach((val) => {
      const key = (Object.keys(map) as Array<keyof FilterMap>).find((k) =>
        map[k].value.includes(val),
      )!
      filters.push({
        key,
        value: val,
        label: `${key === 'flavorNote' ? 'Нота' : key === 'smokingTime' ? 'Время' : key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`,
      })
    })

    // Длина
    if (minLength.value > availableMinLength.value || maxLength.value < availableMaxLength.value) {
      filters.push({
        key: 'length',
        value: 'length',
        label: `Длина: ${minLength.value}–${maxLength.value} мм`,
      })
    }

    // Калибр
    if (
      minRingGauge.value > availableMinRingGauge.value ||
      maxRingGauge.value < availableMaxRingGauge.value
    ) {
      filters.push({
        key: 'ringGauge',
        value: 'ringGauge',
        label: `Калибр: ${minRingGauge.value}–${maxRingGauge.value} RG`,
      })
    }
  }

  if (category.value === 'accessories') {
    selectedAccessoryTypes.value.forEach((t) =>
      filters.push({ key: 'accessoryType', value: t, label: `Тип: ${accessoryTypeLabel(t)}` }),
    )
    selectedAccessoryMaterials.value.forEach((m) =>
      filters.push({ key: 'accessoryMaterial', value: m, label: `Материал: ${m}` }),
    )
  }

  return filters
})

const activeFiltersCount = computed(() => activeFilters.value.length)

// === Фильтрация ===
const filteredProducts = computed<Product[]>(() => {
  let list = [...currentProducts.value]

  // Цена
  list = list.filter((p) => p.pricePerUnit >= minPrice.value && p.pricePerUnit <= maxPrice.value)

  if (category.value === 'cigars') {
    if (selectedBrands.value.length)
      list = list.filter((p) => selectedBrands.value.includes(p.brand))
    if (selectedCountries.value.length)
      list = list.filter((p) => selectedCountries.value.includes(p.country))
    if (selectedFormats.value.length)
      list = list.filter((p) => selectedFormats.value.includes(p.format))
    if (selectedStrengths.value.length)
      list = list.filter((p) => selectedStrengths.value.includes(p.strength))
    if (selectedSmokingTimes.value.length)
      list = list.filter((p) => selectedSmokingTimes.value.includes(p.smokingTime))
    if (selectedFlavorFamilies.value.length)
      list = list.filter((p) => selectedFlavorFamilies.value.includes(p.flavorFamily))
    if (selectedFlavorNotes.value.length)
      list = list.filter((p) => selectedFlavorNotes.value.some((n) => p.flavorNotes.includes(n)))
    list = list.filter((p) => p.length >= minLength.value && p.length <= maxLength.value)
    list = list.filter(
      (p) => p.ringGauge >= minRingGauge.value && p.ringGauge <= maxRingGauge.value,
    )
  }

  if (category.value === 'accessories') {
    const acc = list as Accessory[]
    if (selectedAccessoryTypes.value.length)
      list = acc.filter((p) => selectedAccessoryTypes.value.includes(p.type))
    if (selectedAccessoryMaterials.value.length)
      list = acc.filter((p) => selectedAccessoryMaterials.value.includes(p.material))
  }

  return list
})

const sortedProducts = computed<Product[]>(() => {
  const list = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    case 'price':
      return list.sort((a, b) => a.pricePerUnit - b.pricePerUnit)
    case 'brand':
      return list.sort((a, b) => a.brand.localeCompare(b.brand))
    case 'rating':
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      return list
  }
})

// Функция для предотвращения прокрутки
const preventScroll = (event: WheelEvent) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement

  // Определяем направление прокрутки и изменяем значение
  if (event.deltaY < 0) {
    // Прокрутка вверх - увеличиваем значение
    target.stepUp()
  } else {
    // Прокрутка вниз - уменьшаем значение
    target.stepDown()
  }

  // Триггерим событие change для применения фильтров
  target.dispatchEvent(new Event('change'))
}

// Методы фильтрации
const applyFilters = () => {
  // Фильтры применяются автоматически через computed
}

// === Методы ===
const currentCategoryTitle = computed(() => (category.value === 'cigars' ? 'сигар' : 'аксессуаров'))

const setCategory = (cat: 'cigars' | 'accessories') => {
  category.value = cat
}

const resetFilters = () => {
  minPrice.value = availableMinPrice.value
  maxPrice.value = availableMaxPrice.value

  if (category.value === 'cigars') {
    selectedBrands.value = []
    selectedCountries.value = []
    selectedFormats.value = []
    selectedStrengths.value = []
    selectedSmokingTimes.value = []
    selectedFlavorFamilies.value = []
    selectedFlavorNotes.value = []
    minLength.value = availableMinLength.value
    maxLength.value = availableMaxLength.value
    minRingGauge.value = availableMinRingGauge.value
    maxRingGauge.value = availableMaxRingGauge.value
  } else {
    selectedAccessoryTypes.value = []
    selectedAccessoryMaterials.value = []
  }
}

const removeFilter = (key: string, value: string) => {
  if (key === 'price') {
    minPrice.value = availableMinPrice.value
    maxPrice.value = availableMaxPrice.value
  } else if (key === 'length') {
    minLength.value = availableMinLength.value
    maxLength.value = availableMaxRingGauge.value
  } else if (key === 'ringGauge') {
    minRingGauge.value = availableMinRingGauge.value
    maxRingGauge.value = availableMaxRingGauge.value
  } else if (key === 'accessoryType') {
    selectedAccessoryTypes.value = selectedAccessoryTypes.value.filter((t) => t !== value)
  } else if (key === 'accessoryMaterial') {
    selectedAccessoryMaterials.value = selectedAccessoryMaterials.value.filter((m) => m !== value)
  } else {
    const map: FilterMap = {
      brand: selectedBrands,
      country: selectedCountries,
      format: selectedFormats,
      strength: selectedStrengths,
      smokingTime: selectedSmokingTimes,
      flavorFamily: selectedFlavorFamilies,
      flavorNote: selectedFlavorNotes,
    }

    // Type guard для проверки ключа
    if (key in map) {
      const k = key as keyof FilterMap
      map[k].value = map[k].value.filter((v) => v !== value)
    }
  }
}

const toggleFlavorNote = (note: string) => {
  const i = selectedFlavorNotes.value.indexOf(note)
  if (i > -1) selectedFlavorNotes.value.splice(i, 1)
  else selectedFlavorNotes.value.push(note)
}

const accessoryTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    Cutter: 'Гильотина',
    Lighter: 'Зажигалка',
    Humidor: 'Хьюмидор',
    Ashtray: 'Пепельница',
    Case: 'Футляр',
  }
  return labels[type] || type
}

const toggleFilters = (e: MouseEvent) => {
  e.stopPropagation()
  showFilters.value = !showFilters.value

  if (window.innerWidth <= 768) {
    document.body.style.overflow = showFilters.value ? 'hidden' : ''
  }
}

const closeFilters = () => {
  showFilters.value = false
  if (window.innerWidth <= 768) {
    document.body.style.overflow = ''
  }
}
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showFilters.value) closeFilters()
}

const handleClickOutside = (event: Event) => {
  if (!showFilters.value) return

  const sidebarEl = document.querySelector('.filters-sidebar')
  if (!sidebarEl) return

  const target = event.target as Node | null
  // если клик/тап не внутри сайдбара — закрыть
  if (target && !sidebarEl.contains(target)) {
    closeFilters()
  }
}

// добавляем слушатели при монтировании и удаляем при размонтировании
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)
  resetFilters()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('touchstart', handleClickOutside)
})

// Инициализация при смене категории
watch(
  category,
  () => {
    resetFilters()
    closeAllGroups() // Закрываем все группы при смене категории
  },
  { immediate: true },
)

// Убираем обработчик при уничтожении компонента
onMounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.catalog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  padding: 1.5rem 0;
  font-size: 0.875rem;
  color: #666;
}

.breadcrumb-link {
  color: #8b4513;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.breadcrumb-separator {
  margin: 0 0.5rem;
}

.breadcrumb-current {
  color: #333;
}

.catalog-header {
  margin-bottom: 1rem;
}

.catalog-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.category-tabs {
  display: flex;
  justify-content: right;
  gap: 1rem;
  margin-bottom: 15px;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8b4513;
  }

  &--active {
    background: #8b4513;
    color: #fff;
    border-color: #8b4513;
  }
}

.catalog-controls {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 1rem;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--text-super-light);
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 40px; /* Фиксированная высота */
  min-height: 40px; /* Минимальная высота */
  box-sizing: border-box; /* Чтобы padding не увеличивал высоту */

  &:hover {
    border-color: #8b4513;
    color: #8b4513;
  }
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-buttons {
  display: flex;
  background: var(--text-super-light);
  border: 1px solid #1a1818;
  border-radius: 8px;
  overflow: hidden;
}

.sort-btn {
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid var(--text-light);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #8b4513;
    color: #fff;
  }
}

.catalog-layout {
  /* display: grid; */
  justify-content: right;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  position: relative;
}

.filters-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s ease;

  &--active {
    display: block;
    opacity: 1;
  }

  @media (max-width: 768px) {
    z-index: 9998;
  }
}

.filters-sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 400px;
  max-height: 90vh; /* ограничиваем по высоте экрана */
  background: #fff;
  z-index: 9999;
  padding: 1.5rem;
  border: 1px solid var(--dark-bg);
  border-radius: 0 0 20px;
  overflow-y: auto; /* скролл если контент выше max-height */

  transition: left 0.35s cubic-bezier(0.32, 0, 0.07, 1);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: background 0.3s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &.filters-sidebar--open {
    left: 0;
  }

  /* Крестик закрытия */
  .filters-sidebar__close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: #666;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .filters-sidebar__close:hover {
    color: #000;
    transform: rotate(90deg);
  }

  /* Адаптивность для мобильных */
  @media (max-width: 768px) {
    width: 65%;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 1rem;
  }
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
    padding: 1rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e5e5;
  }
}

.close-filters {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }

  @media (max-width: 768px) {
    display: flex;
    font-size: 2rem;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 768px) {
    position: sticky;
    top: 80px;
    background: #fff;
    z-index: 1;
    margin-bottom: 1rem;
    padding: 1rem 0;
  }
}

.filter-action-btn {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
    border-color: #ccc;
  }
}

.active-filters {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9f5f2;
  border-radius: 8px;

  @media (max-width: 768px) {
    position: sticky;
    top: 140px;
    background: #fff;
    z-index: 1;
    margin-bottom: 1rem;
  }
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.clear-all {
  background: none;
  border: none;
  color: #8b4513;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
}

.active-filters-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: #8b4513;
  color: #fff;
  border-radius: 16px;
  font-size: 0.75rem;

  button {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      color: #ffd700;
    }
  }
}

/* Стили для аккордеона фильтров */
.filter-group {
  border-bottom: 1px solid #e5e5e5;
  padding: 0.5rem 0;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
    border-radius: 4px;

    .filter-title {
      color: #8b4513;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

.filter-arrow {
  transition: transform 0.3s ease;
  color: #666;

  &--open {
    transform: rotate(180deg);
  }
}

.filter-content {
  overflow: hidden;
}

/* Анимация раскрытия/закрытия */
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.filter-collapse-enter-from,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.filter-options {
  max-height: 250px;
  overflow-y: auto;
  overflow-y: overlay;
  padding: 0.5rem 0;
  margin-right: -0.5rem;
  padding-right: 0.5rem;

  /* Скрываем скроллбар по умолчанию */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  /* Показываем скроллбар при наведении на контейнер */
  &:hover {
    scrollbar-color: #c1c1c1 #f1f1f1;

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  @media (max-width: 768px) {
    /* max-height: 200px; */
  }

  @media (max-width: 480px) {
    max-height: 150px;
  }
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
    border-radius: 4px;
  }

  input[type='checkbox'] {
    margin-right: 0.5rem;
  }
}

.option-text {
  flex: 1;
  font-size: 0.875rem;
}

.option-count {
  font-size: 0.75rem;
  color: #666;
}

/* Стили для остальных элементов фильтров */
.price-filter {
  padding: 0.5rem 0;
}

.price-inputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-input-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;

  label {
    font-size: 0.875rem;
    color: #666;
  }
}

.price-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #8b4513;
  }
}

.price-slider {
  position: relative;
  height: 20px;
  margin-bottom: 0.5rem;
}

.range-slider {
  position: absolute;
  width: 85%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #8b4513;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #8b4513;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
}

.price-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
}

.flavor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.flavor-tag {
  padding: 0.5rem 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8b4513;
  }

  &--active {
    background: #8b4513;
    color: #fff;
    border-color: #8b4513;
  }
}

.range-filter {
  padding: 0.5rem 0;
}

.range-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.reset-filters-btn {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: #8b4513;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f9f5f2;
    border-color: #8b4513;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    margin: 2rem 0 1rem 0;
  }
}

.catalog-main {
  min-height: 500px;
}

.products-stats {
  display: flex;
  justify-content: right;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.catalog-product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.no-products {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}
.no-products-icon {
  background-image: url('/images/cigars_svg/cigar3.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  width: 100px; /* или нужный размер */
  height: 100px; /* или нужный размер */
  display: inline-block; /* или block/flex в зависимости от контекста */
}
.no-products h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.no-products p {
  margin-bottom: 1.5rem;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .catalog-controls {
    flex-direction: row;
    align-items: stretch;
  }

  .filter-toggle {
    display: flex;
  }

  .sort-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 колонки одинаковой ширины */
    gap: 2px; /* расстояние между кнопками */
    justify-items: stretch; /* кнопки растягиваются по ширине ячейки */
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .catalog-container {
    padding: 0 0.5rem;
  }

  .catalog-title {
    font-size: 1.5rem;
  }

  .category-tabs {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    padding: 0.75rem;
  }

  .filter-header {
    padding: 0.75rem 0;
  }

  .catalog-controls {
    justify-content: justify-content;
    flex-direction: column;
  }
}
</style>
