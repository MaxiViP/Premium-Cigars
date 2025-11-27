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
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/auth/LoginPhone.vue'),
    },
    // ✅ ДОБАВЬТЕ ЭТОТ МАРШРУТ
    {
      path: '/auth/success',
      name: 'AuthSuccess',
      component: () => import('@/components/auth/AuthSuccess.vue'),
      meta: { requiresAuth: false, hideNavigation: true },
    },
    // ✅ ДОБАВЬТЕ МАРШРУТ ДЛЯ ОШИБОК
    {
      path: '/auth/failure',
      name: 'auth-failure',
      component: () => import('@/components/auth/AuthFailure.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/components/auth/UserProfile.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
