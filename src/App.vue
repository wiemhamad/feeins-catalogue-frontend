<template>
  <div class="app-shell">

    <header class="site-header" :class="{ scrolled: isScrolled }">
      <nav class="site-nav">

        <!-- BRAND -->
        <RouterLink to="/" class="brand">
          <span class="brand-mark">F</span>
          <div class="brand-text">
            <strong>FEEINS</strong>
            <small>CATALOGUE DE RESSOURCES</small>
          </div>
        </RouterLink>

        <!-- NAV CENTER -->
        <div class="nav-center">
          <RouterLink to="/" class="nav-item">Accueil</RouterLink>
          <RouterLink to="/catalogue" class="nav-item">Catalogue</RouterLink>
          <RouterLink to="/templates" class="nav-item">Templates</RouterLink>
          <RouterLink to="/quiz" class="nav-item">Test de profilage</RouterLink>
          <RouterLink v-if="authStore.canCreateRessource" to="/contributeur/ressources" class="nav-item nav-item-accent">Mes ressources</RouterLink>
          <RouterLink v-if="authStore.canCreateTemplate && !authStore.isAdmin" to="/enseignant/templates" class="nav-item nav-item-accent">Mes templates</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" class="nav-item nav-item-admin">Administration</RouterLink>
        </div>

        <!-- NAV RIGHT -->
        <div class="nav-right">
          <template v-if="authStore.isLoggedIn">
            <div class="user-pill">
              <div class="user-avatar">{{ authStore.userDisplayName.charAt(0).toUpperCase() }}</div>
              <div class="user-info">
                <span class="user-name">{{ authStore.userDisplayName }}</span>
                <span class="user-role">{{ roleLabel }}</span>
              </div>
            </div>
            <button class="btn-logout" @click="logout">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Déconnexion
            </button>
          </template>
          <RouterLink v-else to="/login" class="btn-login">
            Connexion →
          </RouterLink>
        </div>

      </nav>

      <!-- BOTTOM GLOW LINE -->
      <div class="header-line"></div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()
const isScrolled = ref(false)

const roleLabels = {
  ADMINISTRATEUR_PEDAGOGIQUE: 'Administrateur',
  ENSEIGNANT: 'Enseignant',
  CONTRIBUTEUR: 'Contributeur',
  ETUDIANT: 'Étudiant',
}
const roleLabel = computed(() => roleLabels[authStore.userRole] || 'Utilisateur')

const logout = () => { authStore.logout(); router.push('/') }

const onScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  --bg: #07091a;
  --surface: rgba(255,255,255,0.04);
  --border: rgba(255,255,255,0.08);
  --text: #f1f5f9;
  --muted: rgba(255,255,255,0.45);
  --accent: #d4ff00;
  --accent-dim: rgba(212,255,0,0.15);
  --indigo: #6366f1;
  --indigo-dim: rgba(99,102,241,0.15);
  --radius: 14px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  min-width: 320px;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; }

#app { min-height: 100vh; display: flex; flex-direction: column; }

/* ===== BACKGROUND AMBIENT ===== */
.app-shell {
  position: relative;
  isolation: isolate;
}
.app-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 80% 50% at 10% 0%, rgba(212,255,0,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 90% 10%, rgba(99,102,241,0.1) 0%, transparent 55%),
    radial-gradient(ellipse 50% 60% at 50% 100%, rgba(20,15,55,0.8) 0%, transparent 70%);
  pointer-events: none;
}

/* ===== HEADER ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 24px 0;
  transition: padding 0.3s ease;
}
.site-header.scrolled { padding: 8px 24px 0; }

.site-nav {
  max-width: 1260px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px 10px 12px;
  border-radius: 20px 20px 0 0;
  background: rgba(10, 12, 28, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.07);
  border-bottom: none;
  box-shadow:
    0 -1px 0 rgba(255,255,255,0.04) inset,
    0 2px 32px rgba(0,0,0,0.4);
}

.header-line {
  max-width: 1260px;
  margin: 0 auto;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(212,255,0,0.3) 20%,
    rgba(99,102,241,0.4) 50%,
    rgba(212,255,0,0.3) 80%,
    transparent
  );
}

/* BRAND */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
}
.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d4ff00 0%, #8cc200 100%);
  display: grid;
  place-items: center;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: #0a0c1c;
  box-shadow: 0 0 20px rgba(212,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3);
  flex-shrink: 0;
}
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-text strong {
  font-family: 'Syne', sans-serif;
  font-weight: 900;
  font-size: 0.9rem;
  color: white;
  letter-spacing: 0.02em;
}
.brand-text small {
  font-size: 0.58rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
}

/* NAV CENTER */
.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-wrap: wrap;
}

.nav-item {
  position: relative;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}
.nav-item:hover { color: white; background: rgba(255,255,255,0.06); }

.nav-item.router-link-active {
  color: white;
  background: rgba(255,255,255,0.08);
}
.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
}

.nav-item-accent {
  color: rgba(212,255,0,0.75);
  background: rgba(212,255,0,0.06);
  border: 1px solid rgba(212,255,0,0.12);
}
.nav-item-accent:hover { color: var(--accent); background: rgba(212,255,0,0.1); }
.nav-item-accent.router-link-active {
  color: var(--accent);
  background: rgba(212,255,0,0.1);
  border-color: rgba(212,255,0,0.2);
}
.nav-item-accent.router-link-active::after { background: var(--accent); }

.nav-item-admin {
  color: rgba(167,139,250,0.85);
  background: rgba(99,102,241,0.08);
  border: 1px solid rgba(99,102,241,0.15);
}
.nav-item-admin:hover { color: #c4b5fd; background: rgba(99,102,241,0.12); }
.nav-item-admin.router-link-active {
  color: #c4b5fd;
  background: rgba(99,102,241,0.12);
}

/* NAV RIGHT */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: 999px;
  background: rgba(212,255,0,0.07);
  border: 1px solid rgba(212,255,0,0.15);
  cursor: default;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4ff00, #8cc200);
  color: #0a0c1c;
  display: grid;
  place-items: center;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 0.78rem;
  flex-shrink: 0;
}
.user-info { display: flex; flex-direction: column; line-height: 1.15; }
.user-name { font-size: 0.8rem; font-weight: 600; color: var(--accent); }
.user-role { font-size: 0.66rem; color: var(--muted); font-weight: 400; }

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-logout:hover {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.2);
  color: #fca5a5;
}
.btn-logout svg { opacity: 0.7; flex-shrink: 0; }

.btn-login {
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, #d4ff00, #a8cc00);
  color: #0a0c1c;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(212,255,0,0.2);
}
.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212,255,0,0.3);
}

.app-main { flex: 1; }

@media (max-width: 900px) {
  .site-header { padding: 10px 12px 0; }
  .site-nav { border-radius: 16px 16px 0 0; padding: 8px; gap: 8px; flex-wrap: wrap; }
  .nav-center { justify-content: flex-start; gap: 2px; order: 3; width: 100%; padding: 6px 0 2px; border-top: 1px solid rgba(255,255,255,0.05); }
  .nav-right { margin-left: auto; }
  .user-info { display: none; }
  .user-pill { padding: 5px; }
}
</style>