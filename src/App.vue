<template>
  <div class="app-shell">
    <header class="site-header">
      <nav class="site-nav">
        <RouterLink to="/" class="brand">
          <span class="brand-mark">F</span>
          <span class="brand-text">
            <strong>FEEINS</strong>
            <small>Catalogue de ressources</small>
          </span>
        </RouterLink>

        <div class="nav-links">
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/catalogue">Catalogue</RouterLink>
          <RouterLink to="/quiz">Test de profilage</RouterLink>
          <RouterLink v-if="authStore.canCreateRessource" to="/contributeur/ressources">Mes ressources</RouterLink>
          <RouterLink v-if="authStore.canCreateTemplate && !authStore.isAdmin" to="/enseignant/templates">Mes templates</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin">Administration</RouterLink>

          <template v-if="authStore.isLoggedIn">
            <div class="nav-user-block">
              <div class="nav-user-avatar">{{ authStore.userDisplayName.charAt(0).toUpperCase() }}</div>
              <div class="nav-user-info">
                <span class="nav-user-name">{{ authStore.userDisplayName }}</span>
                <span class="nav-user-role">{{ roleLabel }}</span>
              </div>
            </div>
            <button class="nav-user-btn" @click="logout">Deconnexion</button>
          </template>

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
  ADMINISTRATEUR_PEDAGOGIQUE: 'Administrateur',
  ENSEIGNANT: 'Enseignant',
  CONTRIBUTEUR: 'Contributeur',
  ETUDIANT: 'Etudiant',
}

const roleLabel = computed(() => roleLabels[authStore.userRole] || 'Utilisateur')

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
  --gradient: #140f37;
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

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 18px 20px 0;
  background:
    linear-gradient(180deg, rgba(7, 10, 29, 0.94), rgba(15, 18, 46, 0.9)),
    linear-gradient(90deg, rgba(212,255,0,0.08), transparent 25%, transparent 75%, rgba(124, 104, 255, 0.08));
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 40px rgba(6, 10, 26, 0.28);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.site-nav {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 18px;
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom: none;
  border-radius: 24px 24px 0 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 84px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  position: relative;
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, #d4ff00, #9fc400),
    linear-gradient(180deg, rgba(255,255,255,0.3), transparent);
  color: #111827;
  font-weight: 800;
  font-size: 1.02rem;
  box-shadow: 0 10px 24px rgba(212,255,0,0.22);
  position: relative;
  overflow: hidden;
}

.brand-mark::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255,255,255,0.28), transparent 52%);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  position: relative;
  padding-right: 18px;
}

.brand-text strong { font-size: 0.95rem; color: white; font-weight: 700; }

.brand-text small {
  color: rgba(255,255,255,0.85);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.brand-text::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 34px;
  transform: translateY(-50%);
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.28), transparent);
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-links a,
.nav-user-btn {
  padding: 10px 15px;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.nav-links a:hover,
.nav-user-btn:hover {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.16);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: linear-gradient(135deg, rgba(212,255,0,0.2), rgba(255,255,255,0.14));
  color: #f8fff1;
  border-color: rgba(212,255,0,0.2);
  box-shadow: 0 8px 20px rgba(141,168,28,0.16);
}

.nav-user-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(212,255,0,0.14), rgba(255,255,255,0.06));
  border: 1px solid rgba(212, 255, 0, 0.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.nav-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4ff00, #a8cc00);
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
  color: #d4ff00;
}

.nav-user-role {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

.app-main { flex: 1; padding: 0; }

.app-shell {
  position: relative;
  isolation: isolate;
}

.app-shell::before,
.app-shell::after {
  content: "";
  position: fixed;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(70px);
  opacity: 0.52;
}

.app-shell::before {
  width: 360px;
  height: 620px;
  top: 120px;
  left: -130px;
  background:
    radial-gradient(circle at 30% 30%, rgba(212, 255, 0, 0.7), transparent 56%),
    radial-gradient(circle at 70% 70%, rgba(92, 225, 255, 0.42), transparent 60%);
}

.app-shell::after {
  width: 390px;
  height: 640px;
  top: 220px;
  right: -150px;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.28), transparent 46%),
    radial-gradient(circle at 40% 70%, rgba(116, 104, 255, 0.5), transparent 58%);
}

@media (max-width: 760px) {
  .site-nav { flex-direction: column; align-items: flex-start; }
  .nav-links { width: 100%; }
  .brand-text::after { display: none; }
  .app-shell::before,
  .app-shell::after {
    opacity: 0.28;
    filter: blur(62px);
  }
}
</style>
