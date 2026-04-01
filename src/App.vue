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
          <RouterLink to="/login">Connexion</RouterLink>
          <router-link
  v-if="isConnecte && (user.role === 'ENSEIGNANT' || user.role === 'ADMINISTRATEUR_PEDAGOGIQUE')"
  to="/creer"
>
   Créer
</router-link>
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
import AppFooter from './components/AppFooter.vue'
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
  --gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--app-bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

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
  background: linear-gradient(135deg, #1a0533 0%, #b471be 100%);
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-weight: 800;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-text strong {
  font-size: 0.95rem;
  color: white;
  font-weight: 700;
}

.brand-text small {
  color: rgba(255, 255, 255, 0.85);
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

.nav-links a {
  padding: 10px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: linear-gradient(135deg, #dcc5ff 0%, #ecd9ff 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(177, 136, 232, 0.25);
}

/* MAIN */
.app-main {
  flex: 1;
  padding: 0;
}

/* RESPONSIVE */
@media (max-width: 760px) {
  .site-nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
  }
}
</style>
