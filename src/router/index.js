import { createRouter, createWebHistory } from 'vue-router'
import CatalogueView from '@/views/CatalogueView.vue'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/catalogue', name: 'catalogue', component: () => import('@/views/CatalogueView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') },
    { path: '/quiz', name: 'quiz', component: () => import('@/views/QuizPositionnement.vue') }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)
  authStore.hydrate()

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: authStore.isLoggedIn ? 'catalogue' : 'login' }
  }

  if (to.meta.requiresCreator && !authStore.canCreate) {
    return { name: authStore.isLoggedIn ? 'catalogue' : 'login' }
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.isLoggedIn) {
    if (authStore.isAdmin) {
      return { name: 'admin' }
    }

    if (authStore.canCreate) {
      return { name: 'creator-resources' }
    }

    return { name: 'catalogue' }
  }
})

export default router
