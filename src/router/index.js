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
    { path: '/quiz', name: 'quiz', component: () => import('@/views/QuizPositionnement.vue') },
    {
      path: '/creer',
      name: 'creer',
      component: () => import('@/views/CreerRessourceView.vue')
    }
  ]
})

export default router
