import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('@/views/ContactsView.vue'),
    },

    // Вход по телефону (компонент есть: src/components/auth/LoginPhone.vue)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/auth/LoginPhone.vue'),
    },

    // OAuth success (компонент есть: src/components/auth/AuthSuccess.vue)
    {
      path: '/auth/success',
      name: 'auth-success',
      component: () => import('@/components/auth/AuthSuccess.vue'),
    },

    // Личный кабинет (компонент есть: src/components/Profile.vue)
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/components/auth/Profile.vue'),
    },

    // Корзина (компонент есть: src/components/auth/Cart.vue)
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/components/auth/Cart.vue'),
    },
  ],

  // Всегда прокручивать наверх при навигации
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
