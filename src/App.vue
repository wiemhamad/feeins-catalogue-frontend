<template>
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
  background: #b58ea5; color: white;
  padding: 5px 030px;
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