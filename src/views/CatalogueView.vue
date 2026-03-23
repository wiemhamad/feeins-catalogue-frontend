<template>
  <div class="catalogue-page">

    <!-- ===== MAIN CONTENT ===== -->
    <div class="catalogue-layout">

      <!-- SIDEBAR FILTRES -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
          <span>Filtres</span>
        </div>

        <!-- Niveau -->
        <div class="filter-group">
          <div class="filter-label">
            <span>Niveau</span>
            <span class="filter-icon-group">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </span>
          </div>
          <ul class="filter-list">
            <li
              v-for="niveau in niveauxFiltres"
              :key="niveau.value"
              class="filter-item"
              :class="{ active: filtres.niveauId === niveau.value }"
              @click="setFiltre('niveauId', niveau.value)"
            >
              <span>{{ niveau.label }}</span>
              <span v-if="niveau.stars" class="stars">{{ niveau.stars }}</span>
            </li>
          </ul>
        </div>

        <!-- Type de contenu -->
        <div class="filter-group">
          <div class="filter-label">Type de contenu</div>
          <ul class="filter-list">
            <li
              v-for="type in typesFiltres"
              :key="type.value"
              class="filter-item"
              :class="{ active: filtres.typeSupport === type.value }"
              @click="setFiltre('typeSupport', type.value)"
            >
              {{ type.label }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="catalogue-main">

        <!-- Header -->
        <div class="catalogue-header">
          <h1 class="catalogue-title">
            Catalogue <span class="count-badge">({{ total }})</span>
          </h1>
          <div class="header-controls">
            <div class="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                v-model="keyword"
                type="text"
                placeholder="Rechercher..."
                @input="onSearch"
              />
            </div>
            <div class="sort-box">
              <select v-model="tri" @change="appliquerFiltres">
                <option value="pertinence">Pertinence</option>
                <option value="recent">Plus récent</option>
                <option value="duree">Durée</option>
              </select>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
          </div>
        </div>

        <!-- Grid avec fond spatial -->
        <div class="grid-wrapper">
          <div class="space-bg">
            <div class="space-nebula"></div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="cards-grid">
            <div v-for="i in 5" :key="i" class="card-skeleton"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="ressources.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>Aucune ressource trouvée</p>
            <button @click="resetFiltres" class="btn-reset">Réinitialiser les filtres</button>
          </div>

          <!-- Cards -->
          <div v-else class="cards-grid">
            <div
              v-for="(ressource, index) in ressources"
              :key="ressource.id"
              class="resource-card"
              :class="{ 'card-large': index === 2 || index === 4 }"
              @click="$router.push(`/ressource/${ressource.id}`)"
            >
              <div class="card-top">
                <div class="card-type-icon" :style="{ background: iconBg(ressource.typeSupport) }">
                  <span>{{ iconeEmoji(ressource.typeSupport) }}</span>
                </div>
                <span class="card-diff" :class="diffClass(ressource.difficulte)">
                  {{ labelDiff(ressource.difficulte) }}
                </span>
              </div>

              <h3 class="card-title">{{ ressource.titre }}</h3>
              <p class="card-desc">{{ ressource.description }}</p>

              <div class="card-tags">
                <span v-for="tag in (ressource.tags || []).slice(0, 3)" :key="tag" class="tag">
                  #{{ tag }}
                </span>
              </div>

              <div class="card-footer">
                <span class="card-duree">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                  {{ ressource.dureeMinutes || 15 }} min
                </span>
                <a class="card-link" @click.stop="$router.push(`/ressource/${ressource.id}`)">
                  Voir la ressource →
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-grid">

        <div class="footer-brand">
          <div class="footer-logo">
            <div class="logo-square">F</div>
            <strong>FEEINS</strong>
          </div>
          <p>Former des Enseignants et des Étudiants Ingénieurs au Numérique en Santé.<br/>
          Un projet de l'ISIS pour centraliser les ressources pédagogiques.</p>
        </div>

        <div class="footer-links">
          <h4>Liens Utiles</h4>
          <ul>
            <li><a href="#">À propos</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Mentions légales</a></li>
          </ul>
        </div>

        <div class="footer-partners">
          <h4>Partenaires</h4>
          <div class="partners-logos">
            <div class="partner-logo">
              <div class="logo-placeholder logo-uc">INU<br/><small>Champollion</small></div>
            </div>
            <div class="partner-logo">
              <div class="logo-placeholder logo-unit">unit<br/><small>fondation</small></div>
            </div>
            <div class="partner-logo partner-full">
              <div class="logo-placeholder logo-isis">
                <span>🏥</span> ISIS<br/><small>Ingénierie Santé Numérique</small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const ressources = ref([])
const loading = ref(true)
const keyword = ref('')
const tri = ref('pertinence')
const filtres = ref({ niveauId: null, typeSupport: null })

let searchTimer = null

const niveauxFiltres = [
  { value: null,  label: 'Tous les niveaux', stars: null },
  { value: 1,     label: 'Débutant',         stars: '★★★' },
  { value: 2,     label: 'Intermédiaire',     stars: '★★☆' },
  { value: 3,     label: 'Avancé',            stars: '★★★' },
]

const typesFiltres = [
  { value: null,        label: 'Tous les types' },
  { value: 'VIDEO',     label: 'Vidéo' },
  { value: 'QUIZ',      label: 'Quiz' },
  { value: 'H5P',       label: 'H5P (Interactif)' },
  { value: 'PDF',       label: 'PDF' },
]

const total = computed(() => ressources.value.length)

const charger = async () => {
  loading.value = true
  try {
    const payload = {}
    if (keyword.value) payload.keyword = keyword.value
    if (filtres.value.niveauId) payload.niveauId = filtres.value.niveauId
    if (filtres.value.typeSupport) payload.typeSupport = filtres.value.typeSupport

    let res
    if (Object.keys(payload).length > 0) {
      res = await api.post('/api/ressources/rechercher', payload)
    } else {
      res = await api.get('/api/ressources')
    }
    ressources.value = res.data
  } catch (e) {
    ressources.value = []
  } finally {
    loading.value = false
  }
}

onMounted(charger)

const setFiltre = (key, value) => {
  filtres.value[key] = filtres.value[key] === value ? null : value
  charger()
}

const appliquerFiltres = () => charger()

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(charger, 400)
}

const resetFiltres = () => {
  keyword.value = ''
  filtres.value = { niveauId: null, typeSupport: null }
  charger()
}

const iconeEmoji = (type) => {
  const m = { VIDEO: '🎥', H5P: '🧩', PDF: '📄', QUIZ: '❓', HTML: '🌐', LIEN: '🔗' }
  return m[type] || '📦'
}

const iconBg = (type) => {
  const m = {
    VIDEO: 'linear-gradient(135deg,#4facfe,#667eea)',
    H5P:   'linear-gradient(135deg,#a855f7,#7c3aed)',
    PDF:   'linear-gradient(135deg,#f87171,#ef4444)',
    QUIZ:  'linear-gradient(135deg,#34d399,#059669)',
    HTML:  'linear-gradient(135deg,#fb923c,#ea580c)',
    LIEN:  'linear-gradient(135deg,#a3e635,#65a30d)',
  }
  return m[type] || 'linear-gradient(135deg,#94a3b8,#64748b)'
}

const diffClass = (d) => ({
  DEBUTANT: 'diff-green', INTERMEDIAIRE: 'diff-orange', AVANCE: 'diff-red'
}[d] || 'diff-green')

const labelDiff = (d) => ({
  DEBUTANT: 'Débutant', INTERMEDIAIRE: 'Intermédiaire', AVANCE: 'Avancé'
}[d] || 'Débutant')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

* { box-sizing: border-box; }

.catalogue-page {
  font-family: 'DM Sans', sans-serif;
  background: #f8f9fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== LAYOUT ===== */
.catalogue-layout {
  display: flex;
  gap: 0;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 30px 24px;
  align-items: flex-start;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 190px;
  flex-shrink: 0;
  padding-right: 24px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 24px;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.filter-icon-group { color: #9ca3af; }

.filter-list {
  list-style: none;
  padding: 0; margin: 0;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 2px;
}

.filter-item:hover { background: #f0f0f8; }
.filter-item.active {
  background: #ede9fe;
  color: #7c3aed;
  font-weight: 600;
}

.stars { color: #f59e0b; font-size: 11px; letter-spacing: -1px; }

/* ===== MAIN ===== */
.catalogue-main { flex: 1; min-width: 0; }

.catalogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.catalogue-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a2e;
}

.count-badge {
  font-size: 1.2rem;
  color: #9ca3af;
  font-weight: 600;
}

.header-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 14px;
  color: #9ca3af;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: #7c3aed; color: #7c3aed; }
.search-box input {
  border: none; outline: none;
  font-size: 0.85rem; color: #374151;
  width: 160px; font-family: 'DM Sans', sans-serif;
  background: transparent;
}
.search-box input::placeholder { color: #9ca3af; }

.sort-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  color: #374151;
}
.sort-box select {
  border: none; outline: none;
  font-size: 0.85rem; color: #374151;
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  cursor: pointer;
}

/* ===== GRID WRAPPER ===== */
.grid-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 400px;
}

.space-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 60% 50%, #2d0b5e 0%, #1a0533 40%, #0d0820 70%, #150530 100%);
  z-index: 0;
}

.space-nebula {
  position: absolute;
  width: 500px; height: 500px;
  background: radial-gradient(ellipse, rgba(180, 80, 255, 0.5) 0%, rgba(120, 40, 200, 0.3) 40%, transparent 70%);
  right: -100px; bottom: -100px;
  border-radius: 50%;
  filter: blur(60px);
}

/* ===== CARDS GRID ===== */
.cards-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 2px;
  padding: 2px;
}

/* Last card in row of 3 + 2 spans full col 3 */
.cards-grid .resource-card:nth-child(3) {
  grid-row: 1;
  grid-column: 3;
}
.cards-grid .resource-card:nth-child(5) {
  grid-row: 2;
  grid-column: 3;
}

.resource-card {
  background: rgba(255, 255, 255, 0.97);
  padding: 22px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.resource-card:hover { background: white; }

/* Rounded corners on outer cards */
.cards-grid .resource-card:nth-child(1) { border-radius: 18px 0 0 0; }
.cards-grid .resource-card:nth-child(2) { border-radius: 0; }
.cards-grid .resource-card:nth-child(3) { border-radius: 0 18px 0 0; }
.cards-grid .resource-card:nth-child(4) { border-radius: 0 0 0 18px; }
.cards-grid .resource-card:nth-child(5) { border-radius: 0 0 18px 0; }

/* If only 5 items: 4th goes to bottom-left */
.cards-grid .resource-card:nth-child(4) {
  grid-row: 2;
  grid-column: 1 / 3;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.card-type-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
}

.card-diff {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.diff-green  { color: #16a34a; background: #dcfce7; }
.diff-orange { color: #d97706; background: #fef3c7; }
.diff-red    { color: #dc2626; background: #fee2e2; }

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.98rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  line-height: 1.3;
}

.card-desc {
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.tag {
  font-size: 11px;
  color: #6366f1;
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 6px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f5;
  margin-top: auto;
}

.card-duree {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.card-link {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  cursor: pointer;
  text-decoration: none;
}
.card-link:hover { text-decoration: underline; }

/* Empty & Loading */
.empty-state {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 300px; gap: 12px;
  color: rgba(255,255,255,0.7);
  padding: 40px;
}
.empty-icon { font-size: 48px; opacity: 0.5; }
.btn-reset {
  background: rgba(255,255,255,0.15); color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 20px; border-radius: 8px;
  cursor: pointer; font-size: 13px;
  transition: background 0.2s;
}
.btn-reset:hover { background: rgba(255,255,255,0.25); }

.card-skeleton {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  min-height: 200px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

/* ===== FOOTER ===== */
.footer {
  background: white;
  border-top: 1px solid #f0f0f5;
  padding: 40px 24px;
  margin-top: 40px;
}

.footer-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.logo-square {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  border-radius: 8px;
  color: white;
  font-weight: 800;
  font-size: 16px;
  display: flex; align-items: center; justify-content: center;
}

.footer-logo strong {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  color: #1a1a2e;
}

.footer-brand p {
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.6;
}

.footer-links h4, .footer-partners h4 {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 14px;
}

.footer-links ul {
  list-style: none; padding: 0; margin: 0;
}
.footer-links ul li { margin-bottom: 8px; }
.footer-links ul li a {
  font-size: 0.85rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links ul li a:hover { color: #7c3aed; }

.partners-logos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.logo-placeholder {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
}

.logo-placeholder small { font-weight: 400; display: block; }

.logo-uc   { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
.logo-unit { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.logo-isis { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
.partner-full { width: 100%; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .catalogue-layout { flex-direction: column; padding: 20px; }
  .sidebar { width: 100%; padding-right: 0; margin-bottom: 20px; }
  .filter-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .filter-item { white-space: nowrap; }
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cards-grid .resource-card:nth-child(n) {
    grid-column: auto; grid-row: auto;
    border-radius: 12px;
  }
  .footer-grid { grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 600px) {
  .cards-grid { grid-template-columns: 1fr; }
  .catalogue-header { flex-direction: column; align-items: flex-start; }
  .header-controls { flex-direction: column; width: 100%; }
  .search-box { width: 100%; }
  .search-box input { width: 100%; }
}
</style>