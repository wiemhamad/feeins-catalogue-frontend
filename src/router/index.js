import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // =====================================================
    // ROUTES PUBLIQUES — accessibles sans authentification
    // L'étudiant (et tout visiteur) consulte librement
    // =====================================================
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/catalogue', name: 'catalogue', component: () => import('@/views/CatalogueView.vue') },
    { path: '/quiz', name: 'quiz', component: () => import('@/views/QuizPositionnement.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },

    // =====================================================
    // ROUTES CONTRIBUTEUR — crée et gère ses ressources
    // =====================================================
    {
      path: '/contributeur/ressources',
      name: 'contributeur',
      component: () => import('@/views/ContributeurView.vue'),
      meta: { requiresAuth: true, roles: ['CONTRIBUTEUR', 'ADMINISTRATEUR_PEDAGOGIQUE'] }
    },

    // =====================================================
    // ROUTES ENSEIGNANT — crée et gère des templates
    // =====================================================
    {
      path: '/enseignant/templates',
      name: 'enseignant',
      component: () => import('@/views/EnseignantView.vue'),
      meta: { requiresAuth: true, roles: ['ENSEIGNANT', 'ADMINISTRATEUR_PEDAGOGIQUE'] }
    },

    // =====================================================
    // ROUTES ADMIN — valide/refuse les ressources
    // =====================================================
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['ADMINISTRATEUR_PEDAGOGIQUE'] }
    },

    // Alias de compatibilité (ancienne URL)
    { path: '/creer', redirect: '/contributeur/ressources' },
    { path: '/createur/ressources', redirect: '/contributeur/ressources' }
  ]
})

// Guard de navigation : vérifier les rôles
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!to.meta.requiresAuth) {
    return next()
  }

  if (!authStore.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
    // Redirige vers la page adaptée au rôle
    if (authStore.isAdmin) return next('/admin')
    if (authStore.isEnseignant) return next('/enseignant/templates')
    if (authStore.isContributeur) return next('/contributeur/ressources')
    return next('/catalogue')
  }

  next()
})

export default router
