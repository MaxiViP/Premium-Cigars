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

          <!-- Фильтр по цене (всегда) -->
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

          <!-- Фильтры только для сигар -->
          <template v-if="category === 'cigars'">
            <!-- Бренд, Страна, Формат и т.д. — как было -->
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
          </template>

          <!-- Фильтры только для аксессуаров -->
          <template v-if="category === 'accessories'">
            <div class="filter-group">
              <h4 class="filter-title">Тип аксессуара</h4>
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

            <div class="filter-group">
              <h4 class="filter-title">Материал</h4>
              <div class="filter-options">
                <label v-for="material in accessoryMaterials" :key="material" class="filter-option">
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
import { ref, computed, onMounted, watch } from 'vue'
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
  { label: 'По названию', value: 'name' },
  { label: 'По цене', value: 'price' },
  { label: 'По бренду', value: 'brand' },
  { label: 'По рейтингу', value: 'rating' },
]

// const sortBy = ref('price') // текущее значение

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
    maxLength.value = availableMaxLength.value
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

    if ((map as any)[key]) {
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

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}
const closeFilters = () => {
  showFilters.value = false
}

// Инициализация при смене категории
watch(
  category,
  () => {
    resetFilters()
  },
  { immediate: true },
)

onMounted(() => {
  resetFilters()
})
</script>
<style scoped>
/* ====================== ЕДИНЫЙ СТИЛЬ ДЛЯ ПЕРЕКЛЮЧАТЕЛЕЙ ====================== */
.category-tabs,
.sort-control .sort-buttons {
  display: flex;
  background: rgba(245, 245, 247, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 6px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* Общие стили кнопок внутри */
.category-tab,
.sort-btn {
  position: relative;
  z-index: 2;
  padding: 11px 22px;
  font-size: 15px;
  font-weight: 600;
  color: #555;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

/* Активное состояние */
.category-tab--active,
.sort-btn.active {
  color: #111;
  font-weight: 700;
}

/* Плавающая белая капсула */
.category-tabs::before,
.sort-control .sort-buttons::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  right: 6px;
  bottom: 6px;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

/* Движение капсулы — категории (2 кнопки) */
.category-tabs .category-tab:nth-child(1).category-tab--active ~ .category-tabs::before {
  transform: translateX(0%);
}
.category-tabs .category-tab:nth-child(2).category-tab--active ~ .category-tabs::before {
  transform: translateX(100%);
}

/* Движение капсулы — сортировка (4 кнопки) */
.sort-btn:nth-child(1).active ~ .sort-buttons::before {
  transform: translateX(0%);
}
.sort-btn:nth-child(2).active ~ .sort-buttons::before {
  transform: translateX(100%);
}
.sort-btn:nth-child(3).active ~ .sort-buttons::before {
  transform: translateX(200%);
}
.sort-btn:nth-child(4).active ~ .sort-buttons::before {
  transform: translateX(300%);
}

/* Ховер и нажатие */
.category-tab:hover:not(.category-tab--active),
.sort-btn:hover:not(.active) {
  color: #000;
}

.category-tab:active,
.sort-btn:active {
  transform: scale(0.96);
}

/* ====================== ОБЩИЕ СТИЛИ ====================== */
.catalog-page {
  min-height: 100vh;
  background: #fff;
  padding-top: 80px;
}

.catalog-container {
  /* max-width: 1400px; */
  margin: 0 auto;
  padding: 0 10px;
}

/* Хлебные крошки */
.breadcrumbs {
  padding: 2rem 0 1rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}
.breadcrumb-link:hover {
  color: var(--primary-color);
}
.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #999;
}
.breadcrumb-current {
  color: #111;
  font-weight: 500;
}

/* Заголовок + контролы */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #111;
  margin: 0;
}

.catalog-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Кнопка фильтров на мобильных */
.filter-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 245, 247, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-toggle:hover {
  background: #eee;
}

/* Overlay */
.filters-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.filters-overlay--active {
  opacity: 1;
  visibility: visible;
}

/* Layout */
.catalog-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Сайдбар фильтров */
.filters-sidebar {
  position: sticky;
  top: 20px;
  background: #fafafa;
  border-radius: 16px;
  /* padding: 1.75rem; */
  height: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.filters-sidebar--open {
  left: 0;
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
  font-size: 1.25rem;
}
.close-filters {
  font-size: 1.75rem;
  color: #888;
  cursor: pointer;
}

/* Активные фильтры */
.active-filters {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 10px 0 0 0;
  margin-bottom: 1.5rem;
}

.active-filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.clear-all {
  color: #666;
  text-decoration: underline;
  font-size: 0.85rem;
  cursor: pointer;
}
.clear-all:hover {
  color: var(--primary-color);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.filter-tag button {
  color: #aaa;
  font-size: 1.1rem;
}
.filter-tag button:hover {
  color: var(--primary-color);
}

/* Группы фильтров */
.filter-group {
  margin-bottom: 2rem;
}
.filter-title {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #111;
  margin-bottom: 1rem;
}

/* Цена */
.price-inputs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.price-input-group {
  flex: 1;
}
.price-input-group label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
  display: block;
}
.price-input {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 0.95rem;
}
.price-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(100, 100, 255, 0.15);
}

.range-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  margin: 12px 0;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

/* Чекбоксы */
.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
}
.filter-option input {
  display: none;
}
.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 6px;
  transition: all 0.25s;
}
.filter-option input:checked + .checkmark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}
.filter-option input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.option-text {
  flex: 1;
  font-size: 0.95rem;
}
.option-count {
  color: #888;
  font-size: 0.85rem;
}

/* Теги вкусов */
.flavor-tag {
  padding: 0.5rem 0.9rem;
  background: #f1f1f1;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.25s;
}
.flavor-tag:hover {
  background: #e5e5e5;
}
.flavor-tag--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* Кнопка сброса */
.reset-filters-btn {
  width: 100%;
  padding: 0.9rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}
.reset-filters-btn:hover {
  background: #f0f0f0;
  color: #111;
}

/* Основной контент */
.products-stats {
  color: #666;
  font-size: 0.95rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 1.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.catalog-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.catalog-product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Нет товаров */
.no-products {
  text-align: center;
  padding: 5rem 2rem;
  color: #777;
}
.no-products-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

/* ====================== АДАПТИВ ====================== */
@media (max-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .catalog-header {
    flex-direction: column;
    align-items: stretch;
  }
  .catalog-title {
    font-size: 2rem;
  }
  .filter-toggle {
    display: flex;
  }
  .catalog-layout {
    grid-template-columns: 1fr;
  }
  .filters-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 85%;
    height: 100vh;
    padding: 1.5rem;
    z-index: 1001;
    border-radius: 0;
    transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .filters-sidebar--open {
    left: 0;
  }
  .filters-header {
    display: flex;
  }
  .breadcrumbs,
  .catalog-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 998;
  }
}

@media (max-width: 480px) {
  .catalog-title {
    font-size: 1.8rem;
  }
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .price-inputs {
    flex-direction: column;
  }
  .category-tabs,
  .sort-control .sort-buttons {
    padding: 4px;
  }
  .category-tab,
  .sort-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
