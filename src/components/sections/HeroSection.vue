<template>
  <section class="hero-section">
    <div class="hero-background">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Элитные сигары премиум-класса</h1>

          <p class="hero-subtitle">
            Откройте для себя мир изысканных вкусов и непревзойдённого качества от лучших
            производителей Кубы, Доминиканы и Никарагуа
          </p>

          <div class="hero-actions">
            <router-link to="/catalog" class="btn btn-primary">Смотреть каталог</router-link>
            <router-link to="/about" class="btn btn-secondary">О нас</router-link>

            <!-- Кнопка Telegram с выезжающей подписью -->
            <a
              href="https://t.me/PremiumCigarsBot"
              target="_blank"
              rel="noopener"
              class="btn-link btn-primary telegram-button"
              aria-label="Заказать в Telegram"
            >
              <svg
                class="telegram-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12C24 5.373 18.628 0 12 0zm5.056 8.304l-1.87 8.807c-.142.66-.51.82-1.03.51l-2.845-2.097-1.372 1.321c-.152.152-.28.28-.574.28l.206-2.918 5.313-4.802c.232-.206-.05-.32-.36-.114l-6.565 4.13-2.823-.883c-.61-.19-.622-.61.128-.902l10.99-4.234c.51-.19.954.122.792.883z"
                />
              </svg>

              <span class="telegram-text">Заказать доставку</span>
            </a>
          </div>

          <div class="hero-features">
            <div class="feature">
              <SvgCigar :type="1" :width="30" :height="12" class="feature-icon" />
              <span>Премиальное качество</span>
            </div>
            <div class="feature">
              <SvgCigar :type="5" :width="30" :height="12" class="feature-icon" />
              <span>Прямые поставки</span>
            </div>
            <div class="feature">
              <SvgCigar :type="9" :width="30" :height="12" class="feature-icon" />
              <span>Экспертная консультация</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero-section {
  height: 60vh;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  border-bottom: 25px;
}

.hero-background {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 25px 25px;
  background-image: url('/hero.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0));

  backdrop-filter: blur(-4px);

  z-index: 1;
}

.hero-background::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;

  background: radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.18), transparent 60%);

  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: #fff;
}

/* =======================================
   CONTENT
======================================= */
.hero-content {
  text-align: center;
  color: white;
  /* max-width: 850px; */
  margin: 0 auto;
  /* padding: 25px 0 0; */
  z-index: 3;
  position: relative;
}

.hero-title {
  font-size: 3.8rem;
  margin-top: 1.5rem;
  margin-bottom: 1.4rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(92deg, #d4af37, #fff1a3, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s ease-in-out infinite;
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hero-subtitle {
  font-size: 1.4rem;
  opacity: 0.85;
  margin-bottom: 2.8rem;
  color: var(--dark-bg);
  text-shadow:
    0 0 1px rgba(0, 0, 0, 0.8),
    0 0 5px rgba(0, 0, 0, 0.6);
}

/* =======================================
   BUTTONS
======================================= */
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.4rem;
  margin-bottom: 3.5rem;
}

.telegram-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 70px;
  height: 70px;
  border-radius: 40px;
  overflow: hidden;
  transition: all 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}

.telegram-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  transition: all 0.42s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.telegram-text {
  position: absolute;
  left: 25px;
  font-weight: 600;
  font-size: 1.15rem;
  color: rgb(17, 17, 17);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}

/* При наведении — расширяемся и показываем текст */
.telegram-button:hover {
  width: 240px; /* или сколько нужно под текст */
  padding-right: 24px;
  gap: 12px;
}

.telegram-button:hover .telegram-icon {
  width: 30px;
  height: 30px;
  display: none;
}

.telegram-button:hover .telegram-text {
  opacity: 1;
  transform: translateX(0);
}

/* Поддержка тача (клик = hover) */
@media (hover: none) {
  .telegram-button:active {
    width: 240px;
    padding-right: 24px;
  }
  .telegram-button:active .telegram-text {
    opacity: 1;
    transform: translateX(0);
  }
}
.btn {
  display: flex;
  align-items: anchor-center;
  padding: 1rem 2.6rem;
  border-radius: 40px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;
  font-size: 1.15rem;
}

.btn-primary {
  background: #d4af37;
  color: #1a1a1a;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.35);
}

.btn-primary:hover {
  background: var(--gold-color);
  color: var(--dark-bg);
  border: 2px solid #d4af37;
  transform: translateY(-3px);
}

.btn-secondary {
  background: transparent;
  backdrop-filter: blur(2px);
  border: 2px solid rgb(231, 229, 224);
  color: rgb(12, 12, 12);
}

.btn-secondary:hover {
  background: var( --gold-color);
  color: #111;
  transform: translateY(-3px);
}

/* =======================================
   FEATURES
======================================= */
.hero-features {
  display: flex;
  gap: 2.8rem;
  justify-content: center;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--text-dark);
  background: rgba(255, 255, 255, 0.12);
  padding: 0.7rem 1.3rem;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  transition: 0.3s;
}

.feature:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}

/* MOBILE */
@media (max-width: 768px) {
  .hero-actions {
    flex-wrap: wrap;
    margin-bottom: 0;
  }

  /* .hero-section {
    height: 60vh;
  } */

  .hero-title {
    font-size: 2.7rem;
  }
  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }
  /* .floating-cigar {
      display: none;
    } */

  .hero-features {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.7rem;
    margin-bottom: 1rem;
    margin-top: 0;
  }
  .hero-background {
    height: 50vh;
    border-radius: 50px;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  /* .hero-section {
    min-height: 500px;

  } */

  .btn {
    padding: 8px;
    font-weight: 200;
  }
}
</style>
