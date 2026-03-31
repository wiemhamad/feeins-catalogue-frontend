<template>
  

      <router-link to="/quiz"> Quiz</router-link>
        
    

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
>>>>>>> dca4e09a648f1ff3a40715c2a0a0e2f68ff4ad1e

        <div class="nav-links">
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/catalogue">Catalogue</RouterLink>
          <RouterLink to="/quiz">Quiz</RouterLink>
          <RouterLink to="/login">Connexion</RouterLink>
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
  --app-bg: #f3f0ff;
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
}

#app,
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--gradient);
  padding: 12px 20px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
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

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.brand:hover {
  transform: scale(1.05);
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
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
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

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.nav-links a {
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.app-main {
  flex: 1;
  padding: 0;
}

@media (max-width: 760px) {
  .site-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-links {
    width: 100%;
  }
}
</style>
