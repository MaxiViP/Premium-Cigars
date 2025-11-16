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
  ],

  // 🔹 Добавляем scrollBehavior, чтобы всегда прокручивать наверх
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // Если пользователь нажал назад/вперед — возвращаем сохранённую позицию
      return savedPosition
    }
    // Всегда прокручиваем страницу наверх при переходе
    return { top: 0 }
  },
})

export default router
