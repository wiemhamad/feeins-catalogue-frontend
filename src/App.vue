<template>
<<<<<<< HEAD
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar">
      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">F</div>
        <span>FEEINS</span>
  
      </div>

      <div class="nav-links">
        <router-link to="/">Catalogue</router-link>
        <router-link to="/login">Connexion</router-link>  
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
>>>>>>> c3be1c632355a06eacb3c91e4a69bddbd5d1f536

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
  </div>
</template>

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

<<<<<<< HEAD
.navbar {
  background: #b58ea5; color: white;
  padding: 5px 030px;
  display: flex; justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 100;
=======
* {
  box-sizing: border-box;
>>>>>>> c3be1c632355a06eacb3c91e4a69bddbd5d1f536
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
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.brand-logo {
  width: 28px; height: 28px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  border-radius: 7px;
  color: white;
  font-weight: 800;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
}
.brand span {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
  flex: 1;
}
.brand-nav {
  display: flex;
  gap: 5px;
  align-items: center;
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
