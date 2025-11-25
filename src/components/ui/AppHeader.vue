<template>
  <div>
    <header class="app-header">
      <nav class="navbar">
        <div class="container">
          <!-- Логотип -->
          <router-link to="/" class="logo">
            <div class="logo-icon">
              <img src="/logo.png" alt="Premium Logo" class="logo-image" />
            </div>
            <div class="logo-text">
              <h1>Premium Cigars</h1>
              <p class="logo-subtitle">Элитные табачные изделия</p>
            </div>
          </router-link>

          <!-- Десктоп навигация -->
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
          <!-- АВТОРИЗАЦИЯ: ДЕСКТОП -->
          <div class="auth-buttons">
            <!-- Не авторизован — показываем кнопку входа -->
            <button v-if="!isAuthenticated" @click="showAuthModal = true" class="btn-auth">
              Вход / Регистрация
            </button>

            <!-- Авторизован — показываем кнопку с именем и переходом в профиль -->
            <router-link v-else to="/profile" class="btn-profile">
              <div class="profile-avatar">
                <img
                  :src="auth.user?.avatar || '/default-avatar.png'"
                  alt="avatar"
                  class="avatar-img"
                />
              </div>
              <span class="profile-name">
                {{ displayName }}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="2" />
              </svg>
            </router-link>
          </div>

          <!-- Кнопка открытия мобильного меню -->
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

          <!-- АВТОРИЗАЦИЯ: ДЕСКТОП -->
          <div class="auth-buttons">
            <!-- Не авторизован — показываем кнопку входа -->
            <button v-if="!isAuthenticated" @click="showAuthModal = true" class="btn-auth">
              Вход / Регистрация
            </button>

            <!-- Авторизован — показываем кнопку с именем и переходом в профиль -->
            <router-link v-else to="/profile" class="btn-profile">
              <div class="profile-avatar">
                <img
                  :src="auth.user?.avatar || '/default-avatar.png'"
                  alt="avatar"
                  class="avatar-img"
                />
              </div>
              <span class="profile-name">
                {{ displayName }}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="2" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Модальное окно авторизации -->
    <AuthModal :isOpen="showAuthModal" :onClose="() => (showAuthModal = false)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthModal from '@/components/ui/AuthModal.vue'

const isMobileMenuOpen = ref(false)
const showAuthModal = ref(false)
const auth = useAuthStore()

// Красивое отображение имени: имя → email@ → первая часть email → Гость
const displayName = computed(() => {
  if (!auth.user) return 'Гость'
  return auth.user.name || auth.user.email?.split('@')[0] || 'Пользователь'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Открытие модального окна из мобильного меню
const openAuthMobile = () => {
  showAuthModal.value = true
  closeMobileMenu()
}

const isAuthenticated = computed(() => !!auth.token)

const logout = () => {
  auth.logout()
  closeMobileMenu()
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
  gap: 2px;
}

/* Логотип */
.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 3px;
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
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.8),
    0 0 5px rgba(0, 0, 0, 0.6);
}

.logo-subtitle {
  margin: 0;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 0.5px;
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.8),
    0 0 5px rgba(0, 0, 0, 0.6);
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
  padding: 12.8px 19.2px;
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
  color: var(--white);
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.8),
    0 2px 5px rgba(0, 0, 0, 0.6);
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
  /* background: rgba(218, 172, 22, 0.15); */
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

.mobile-auth-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--gold-color);
  color: var(--white);
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}
.mobile-auth-btn:hover {
  background: var(--gold-light);
}

.btn-auth {
  background: var(--gold-color);
  color: black;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-auth:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
}

/* КНОПКА С ИМЕНЕМ ПОЛЬЗОВАТЕЛЯ */
.btn-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.4);
  padding: 0.6rem 1rem;
  border-radius: 16px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.btn-profile:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--gold-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--gold-color);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

/* МОБИЛЬНЫЙ ПРОФИЛЬ */
.mobile-profile-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: white;
  text-decoration: none;
}

.mobile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--gold-color);
}

.mobile-name {
  font-weight: 600;
  color: var(--gold-color);
}

.mobile-email {
  font-size: 0.9rem;
  color: #ccc;
}

/* Мобильное меню */
.mobile-menu-btn {
  display: flex;
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

@media (max-width: 930px) {
  .logo-subtitle {
    display: none;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-text {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }

  .logo-text {
    display: none;
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

  .nav-links {
    gap: 0;
  }
  .nav-link {
    padding: 12px;
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
