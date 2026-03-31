<template>
  
<<<<<<< HEAD
      <router-link to="/quiz"> Quiz</router-link>
        
      </div>
    </nav>
=======
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
  --app-bg: #f4f7fb;
  --panel: #ffffff;
  --line: #e2e8f0;
  --text: #122033;
  --muted: #5b697c;
  --primary: #0f766e;
  --primary-soft: #ccfbf1;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--app-bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
}

a {
  color: inherit;
}

#app,
.app-shell {
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 16px 20px 0;
  background: linear-gradient(180deg, rgba(244, 247, 251, 0.96), rgba(244, 247, 251, 0.82));
  backdrop-filter: blur(6px);
}

.site-nav {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-size: 0.98rem;
}

.brand-text small {
  color: var(--muted);
  font-size: 0.78rem;
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-links a {
  padding: 10px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: var(--primary-soft);
  color: var(--primary);
}

.app-main {
  padding: 24px 20px 40px;
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
