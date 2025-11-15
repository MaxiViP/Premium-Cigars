<template>
  <div class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <h1>О компании Premium Cigars</h1>
          <p>
            Мы — премиальный бутик сигар и аксессуаров, предлагающий исключительный
            выбор продукции для истинных ценителей. Наша миссия — предоставить
            доступ к лучшим сигарам мира и сопутствующим товарам высочайшего качества.
          </p>

          <div class="features">
            <div class="feature">
              <h3>🎯 Качество</h3>
              <p>Только сертифицированная продукция от проверенных производителей</p>
            </div>

            <div class="feature">
              <h3>🌎 Глобальный выбор</h3>
              <p>Сигары из Кубы, Доминиканы, Никарагуа и других регионов</p>
            </div>

            <div class="feature">
              <h3>💎 Экспертиза</h3>
              <p>Профессиональные консультации и индивидуальный подход</p>
            </div>
          </div>
        </div>

        <div class="about-image">
          <!-- Здесь будет изображение -->
          <div class="image-placeholder">
            <span>Изображение магазина</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about {
  padding: 2rem 0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: var(--text-light);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.feature p {
  margin: 0;
  color: var(--text-light);
}

.about-image {
  display: flex;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-text h1 {
    font-size: 2rem;
  }
}
</style>
