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
.category-tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  margin-right: 1rem;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab--active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

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
  /* padding: 0 20px; */
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
  top: 0;
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  /* max-height: calc(100vh - 140px); */
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
  width: 100%;
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
  width: 95%;
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
  min-height: 735px;
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
  gap: 8px;
  margin-bottom: 15px;
}

.catalog-product-card {
  padding: 1px;
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
    /* gap: 2rem; */
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .filters-sidebar {
    padding: 0 16px 0 0;
  }
}

@media (max-width: 768px) {
  /* .catalog-container {
    padding: 0 15px;
  } */

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
    padding: 15px;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    z-index: 1001;
    border-radius: 0 0 25px 0;
    transition: left 0.3s ease;
    overflow-y: auto;
  }

  .filters-sidebar--open {
    left: 0;
  }

  .filters-header {
    display: flex;
  }

  /* .products-grid {
    grid-template-columns: 1fr;
  } */

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
