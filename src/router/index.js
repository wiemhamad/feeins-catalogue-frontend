import { createRouter, createWebHistory } from 'vue-router'
import CatalogueView from '@/views/CatalogueView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/catalogue', name: 'catalogue', component: () => import('@/views/CatalogueView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') }
  ]
})

export default router