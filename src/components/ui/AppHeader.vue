<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="/logo.png" alt="Premium Logo" class="logo-image" />
          </div>

          <div class="logo-text">
            <h1>Premium Cigars</h1>
            <p class="logo-subtitle">Элитные табачные изделия</p>
          </div>
        </router-link>

        <ul class="nav-links">
          <li>
            <router-link to="/" class="nav-link">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Главная</span>
            </router-link>
          </li>
          <li>
            <router-link to="/catalog" class="nav-link">
              <span class="nav-icon">📦</span>
              <span class="nav-text">Каталог</span>
            </router-link>
          </li>
          <li>
            <router-link to="/about" class="nav-link">
              <span class="nav-icon">ℹ️</span>
              <span class="nav-text">О нас</span>
            </router-link>
          </li>
          <li>
            <router-link to="/contacts" class="nav-link">
              <span class="nav-icon">📞</span>
              <span class="nav-text">Контакты</span>
            </router-link>
          </li>
        </ul>

        <!-- Мобильное меню -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
      </div>
    </nav>

    <!-- Мобильное меню -->
    <div class="mobile-menu" :class="{ 'mobile-menu--open': isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="nav-icon">🏠</span> Главная
        </router-link>
        <router-link to="/catalog" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="nav-icon">📦</span> Каталог
        </router-link>
        <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="nav-icon">ℹ️</span> О нас
        </router-link>
        <router-link to="/contacts" class="mobile-nav-link" @click="closeMobileMenu">
          <span class="nav-icon">📞</span> Контакты
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
 

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon img.logo-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.app-header {
  background: linear-gradient(135deg, #7dd6e6 0%, #f09a44 50%, #e15050 100%);
  color: var(--white);
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  animation: slideInDown 0.6s ease-out;
}

.navbar {
  padding: 2px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  position: relative;
}

/* Логотип */
.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  /* font-size: 2rem; */
  background: linear-gradient(45deg, var(--gold-color), var(--gold-light));
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.logo-text h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--gold-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  margin: 0;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Навигация */
.nav-links {
  display: flex;
  list-style: none;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.nav-text {
  white-space: nowrap;
}

.nav-link .nav-text {
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link .nav-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold-color), var(--gold-light));
  transition: width 0.4s ease;
}

.nav-link:hover .nav-text::after,
.nav-link.router-link-active .nav-text::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold-color);
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(212, 175, 55, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.nav-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.nav-link:hover .nav-icon {
  transform: scale(1.2);
}

/* Мобильное меню */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.mobile-menu-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-color);
}

.menu-bar {
  width: 20px;
  height: 2px;
  background: var(--gold-color);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover .menu-bar {
  background: var(--white);
  transform: scale(1.1);
}

.mobile-menu {
  position: fixed;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #6b6868 0%, #2c1f0e 100%);
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  transition: all 0.4s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.mobile-menu--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0 25px 25px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.mobile-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold-color), var(--gold-light));
  transition: width 0.4s ease;
}

.mobile-nav-link:hover::after,
.mobile-nav-link.router-link-active::after {
  width: 100%;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(212, 175, 55, 0.2);
  color: var(--gold-color);
  border-color: rgba(212, 175, 55, 0.4);
  transform: translateX(10px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .logo-text h1 {
    font-size: 1.4rem;
  }
  .logo-subtitle {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .navbar .container {
    padding: 0 2px;
  }
  .logo-text h1 {
    font-size: 1.2rem;
  }
  .logo-subtitle {
    display: none;
  }
  .mobile-menu-content {
    padding: 1.5rem;
  }
}

/* Анимация появления */
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
