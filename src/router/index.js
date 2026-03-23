import { createRouter, createWebHistory } from 'vue-router'
import CatalogueView from '@/views/CatalogueView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'catalogue', component: CatalogueView },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') }
  ]
})

export default router