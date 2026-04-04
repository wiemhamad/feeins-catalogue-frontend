<template>
  <div class="app-shell">
    <header class="site-header">
      <nav class="site-nav">

        <!-- Brand -->
        <RouterLink to="/" class="brand">
          <span class="brand-mark">F</span>
          <span class="brand-text">
            <strong>FEEINS</strong>
            <small>Catalogue de ressources</small>
          </span>
        </RouterLink>

        <!-- Links -->
        <div class="nav-links">
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/catalogue">Catalogue</RouterLink>
          <RouterLink to="/quiz">Quiz</RouterLink>

          <!-- CONTRIBUTEUR : accès à son espace de création de ressources -->
          <RouterLink
            v-if="authStore.canCreateRessource"
            to="/contributeur/ressources"
          >
            ✏️ Mes ressources
          </RouterLink>

          <!-- ENSEIGNANT : accès à son espace de création de templates -->
          <RouterLink
            v-if="authStore.canCreateTemplate && !authStore.isAdmin"
            to="/enseignant/templates"
          >
            📋 Mes templates
          </RouterLink>

          <!-- ADMIN : accès au dashboard -->
          <RouterLink v-if="authStore.isAdmin" to="/admin">
            👑 Admin
          </RouterLink>

          <!-- Si connecté : avatar + nom + rôle + déconnexion -->
          <template v-if="authStore.isLoggedIn">
            <div class="nav-user-block">
              <div class="nav-user-avatar">{{ authStore.userDisplayName.charAt(0).toUpperCase() }}</div>
              <div class="nav-user-info">
                <span class="nav-user-name">{{ authStore.userDisplayName }}</span>
                <span class="nav-user-role">{{ roleLabel }}</span>
              </div>
            </div>
            <button class="nav-user-btn" @click="logout">Déconnexion</button>
          </template>

          <!-- Si non connecté -->
          <RouterLink v-else to="/login">Connexion</RouterLink>
        </div>

      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const roleLabels = {
  ADMINISTRATEUR_PEDAGOGIQUE: '👑 Admin',
  ENSEIGNANT: '👨‍🏫 Enseignant',
  CONTRIBUTEUR: '✏️ Contributeur',
  ETUDIANT: '🎓 Étudiant',
}
const roleLabel = computed(() => roleLabels[authStore.userRole] || '👤 Utilisateur')

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style>
:root {
  color-scheme: light;
  --app-bg: #f0f6ff;
  --panel: #ffffff;
  --line: #e5e7eb;
  --text: #1f2937;
  --muted: #6b7280;
  --primary: #6366f1;
  --primary-soft: #eef2ff;
  --gradient: #140F37;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-width: 320px;
  background: linear-gradient(135deg, #0b0f2a, #1f1147);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

a { color: inherit; text-decoration: none; }

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 16px 20px 0;
  background: #140F37;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(255, 150, 190, 0.15);
}

.site-nav {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0;
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: grid; place-items: center;
  background: #D4FF00;
  color: white;
  font-weight: 800;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-text strong { font-size: 0.95rem; color: white; font-weight: 700; }
.brand-text small {
  color: rgba(255,255,255,0.85);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* NAV LINKS */
.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.nav-links a,
.nav-user-btn {
  padding: 10px 14px;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.12);
  border: none;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-links a:hover, .nav-user-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: linear-gradient(135deg, #dcc5ff 0%, #ecd9ff 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(177,136,232,0.25);
}

.nav-user-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  background: rgba(212, 255, 0, 0.12);
  border: 1px solid rgba(212, 255, 0, 0.25);
}

.nav-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4FF00, #a8cc00);
  color: #0b0f2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.nav-user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.nav-user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #D4FF00;
}

.nav-user-role {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

/* MAIN */
.app-main { flex: 1; padding: 0; }

@media (max-width: 760px) {
  .site-nav { flex-direction: column; align-items: flex-start; }
  .nav-links { width: 100%; }
}
</style>