<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-brand">
        📚 FEEINS Catalogue
      </div>
      <div class="nav-links">
        <router-link to="/">Catalogue</router-link>
        <router-link to="/login">Connexion</router-link>
      </div>
    </nav>

    <!-- PAGE -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; background: #f5f6fa; }

.navbar {
  background: #2c3e50; color: white;
  padding: 15px 30px;
  display: flex; justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 100;
}
.nav-brand { font-size: 1.3rem; font-weight: bold; }
.nav-links { display: flex; gap: 20px; }
.nav-links a {
  color: white; text-decoration: none;
  padding: 5px 10px; border-radius: 6px;
  transition: background 0.2s;
}
.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255,255,255,0.2);
}

main { padding: 20px; }
</style>
```

---

### Structure finale
```
src/
├── api/
│   └── axios.js          ✅
├── stores/
│   └── ressource.js      ✅
├── views/
│   └── CatalogueView.vue ✅
├── router/
│   └── index.js          ✅
├── App.vue               ✅
└── main.js