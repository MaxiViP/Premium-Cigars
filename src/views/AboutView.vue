<template>
  <div class="about">
    <div class="container">
      <div class="about-content">

        <!-- Текстовая часть -->
        <div class="about-text">
          <h1>О компании Premium Cigars</h1>
          <p>
            Мы — премиальный бутик сигар и аксессуаров, предлагающий исключительный
            выбор продукции для истинных ценителей. Наша миссия — предоставить
            доступ к лучшим сигарам мира и сопутствующим товарам высочайшего качества.
          </p>

          <div class="features">
            <div class="feature">
              <h3><span class="gold-icon">🎯</span> Качество</h3>
              <p>Только сертифицированная продукция от проверенных производителей</p>
            </div>

            <div class="feature">
              <h3><span class="gold-icon">🌎</span> Глобальный выбор</h3>
              <p>Сигары из Кубы, Доминиканы, Никарагуа и других регионов</p>
            </div>

            <div class="feature">
              <h3><span class="gold-icon">💎</span> Экспертиза</h3>
              <p>Профессиональные консультации и индивидуальный подход</p>
            </div>
          </div>
        </div>

        <!-- Изображение -->
        <div class="about-image">
          <div class="image-placeholder">
            <span></span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:root {
  --gold-color: #d4af37;
  --gold-light: #f4d67c;
  --text-dark: #2c2c2c;
  --text-light: #666;
  --border: #e0e0e0;
  --shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.about {
  padding: 4rem 0;
  background: #f8f5f2;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text h1 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  position: relative;
}

.about-text h1::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: var(--gold-color);
  margin-top: 10px;
  border-radius: 2px;
}

.about-text p {
  font-size: 1.15rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: var(--text-light);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.feature {
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Золотое сияние иконок */
.gold-icon {
  display: inline-block;
  margin-right: 0.5rem;
  color: var(--gold-color);
  transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.feature:hover .gold-icon {
  transform: scale(1.3) rotate(-10deg);
  text-shadow:
    0 0 5px var(--gold-light),
    0 0 10px var(--gold-color),
    0 0 15px var(--gold-light),
    0 0 20px var(--gold-color);
}

.feature h3 {
  color: var(--gold-color);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.feature p {
  margin: 0;
  color: var(--text-dark);
}

.about-image {
  display: flex;
  justify-content: center;
}

.image-placeholder {
  width: 100%;
  max-width: 500px;
  height: 400px;
  background: url('/images/background/123.webp') left / cover no-repeat;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.image-placeholder:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-text h1 {
    font-size: 2.2rem;
  }

  .image-placeholder {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .about-text h1 {
    font-size: 1.8rem;
  }

  .image-placeholder {
    height: 250px;
  }
}
</style>
