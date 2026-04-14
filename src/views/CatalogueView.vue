<template>
  <div class="catalogue-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="space-background">
        <div class="glow glow-left"></div>
        <div class="glow glow-right"></div>
      </div>
      <div class="hero-content">
        <h1>Explorer le Catalogue</h1>
        <p>Découvrez plus de {{ total }} ressources pédagogiques pour enrichir vos cours</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="catalogue-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Filtres</h2>
          <button v-if="hasActiveFilters" type="button" class="clear-all-btn" @click="resetFiltres">
            ✕ Réinitialiser
          </button>
        </div>

        <!-- RECHERCHE -->
        <div class="sidebar-block">
          <div class="search-sidebar">
            <input v-model="keyword" type="text" placeholder="🔍 Rechercher..." @input="onSearch" />
          </div>
        </div>

        <!-- NIVEAUX -->
        <div class="sidebar-block">
          <h3>Niveau</h3>
          <div class="filter-group">
            <button
              v-for="niveau in niveauxFiltres"
              :key="String(niveau.value)"
              type="button"
              class="filter-checkbox"
              :class="{ active: filtres.niveauId === niveau.value }"
              @click="setFiltre('niveauId', niveau.value)"
            >
              <span class="checkbox"></span>{{ niveau.label }}
            </button>
          </div>
        </div>

        <!-- THÉMATIQUES -->
        <div class="sidebar-block" v-if="thematiques.length">
          <h3>Thématique</h3>
          <div class="filter-group">
            <button
              v-for="t in thematiques"
              :key="t.id"
              type="button"
              class="filter-checkbox"
              :class="{ active: filtres.thematiqueId === t.id }"
              @click="setFiltre('thematiqueId', t.id)"
            >
              <span class="checkbox"></span>{{ t.nom }}
            </button>
          </div>
        </div>

        <!-- TYPE DE CONTENU -->
        <div class="sidebar-block" v-if="typesFiltres.length">
          <h3>Type de contenu</h3>
          <div class="filter-group">
            <button
              v-for="type in typesFiltres"
              :key="String(type.value)"
              type="button"
              class="filter-checkbox"
              :class="{ active: filtres.typeSupport === type.value }"
              @click="setFiltre('typeSupport', type.value)"
            >
              <span class="checkbox"></span>{{ type.label }}
            </button>
          </div>
        </div>

        <!-- DIFFICULTÉ -->
        <div class="sidebar-block" v-if="difficultes.length">
          <h3>Difficulté</h3>
          <div class="filter-group">
            <button
              v-for="d in difficultes"
              :key="d.value"
              type="button"
              class="filter-checkbox"
              :class="{ active: filtres.difficulte === d.value }"
              @click="setFiltre('difficulte', d.value)"
            >
              <span class="checkbox"></span>{{ d.label }}
            </button>
          </div>
        </div>

        <!-- TAGS -->
        <div class="sidebar-block" v-if="tags.length">
          <h3>Tags</h3>
          <div class="tags-cloud">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              class="tag-btn"
              :class="{ active: filtres.tag === tag.libelle }"
              @click="setFiltre('tag', tag.libelle)"
            >
              #{{ tag.libelle }}
            </button>
          </div>
        </div>
      </aside>

      <section class="catalogue-content">
        <!-- Toolbar -->
        <div class="catalogue-toolbar">
          <div class="toolbar-left">
            <h2>Ressources</h2>
            <span class="resource-count">{{ total }} résultats</span>
          </div>

          <div class="toolbar-right">
      
            <div class="search-wrapper">
              <input
                v-model="keyword"
                type="text"
                class="search-input"
                placeholder="Rechercher une ressource..."
                @input="onSearch"
              />
            </div>

            <select v-model="tri" class="sort-select" @change="appliquerTriLocal">
              <option value="pertinence">Pertinence</option>
              <option value="recent">Plus récent</option>
              <option value="duree">Durée</option>
            </select>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="active-filters">
          <div class="filter-tag" v-if="filtres.niveauId">
            Niveau: <strong>{{ getActiveNiveauLabel }}</strong>
            <button @click="setFiltre('niveauId', null)" class="tag-remove">✕</button>
          </div>
          <div class="filter-tag" v-if="filtres.typeSupport">
            Type: <strong>{{ getActivetypeLabel }}</strong>
            <button @click="setFiltre('typeSupport', null)" class="tag-remove">✕</button>
          </div>
          <div class="filter-tag" v-if="keyword">
            Mot-clé: <strong>"{{ keyword }}"</strong>
            <button @click="keyword = ''; charger()" class="tag-remove">✕</button>
          </div>
        </div>

        <!-- Resource Grid -->
        <div class="cards-shell">
          <div class="cards-space"></div>

          <div v-if="loading" class="state-panel loading">
            <div class="loader"></div>
            Chargement du catalogue...
          </div>
          <div v-else-if="ressources.length === 0" class="state-panel empty">
            <h3>Aucune ressource trouvée</h3>
            <p>Essayez de modifier vos filtres ou votre recherche</p>
          </div>

          <div v-else class="resource-grid">
            <RessourceCard
              v-for="ressource in ressources"
              :key="ressource.id"
              :ressource="ressource"
              action-label="Consulter"
            />
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/api/axios'
import { useRoute } from 'vue-router'
import RessourceCard from '@/components/RessourceCard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const ressources = ref([])
const niveaux = ref([])
const loading = ref(true)
const keyword = ref('')
const tri = ref('pertinence')
const filtres = ref({
  niveauId: null,
  typeSupport: null,
  thematiqueId: null,
  difficulte: null,
  tag: null
})

let searchTimer = null

const niveauxFiltres = computed(() => [
  { value: null, label: 'Tous les niveaux' },
  ...niveaux.value.map((niveau) => ({
    value: niveau.id,
    label: niveau.nom
  }))
])

const typesFiltres = ref([])
const difficultes = ref([])
const thematiques = ref([])
const tags = ref([])

const total = computed(() => ressources.value.length)

const hasActiveFilters = computed(() => {
  return filtres.value.niveauId !== null ||
         filtres.value.typeSupport !== null ||
         filtres.value.thematiqueId !== null ||
         filtres.value.difficulte !== null ||
         filtres.value.tag !== null ||
         keyword.value.trim() !== ''
})

const getActiveNiveauLabel = computed(() => {
  const niveau = niveaux.value.find(n => n.id === filtres.value.niveauId)
  return niveau?.nom || ''
})

const getActivetypeLabel = computed(() => {
  const type = typesFiltres.value.find(t => t.value === filtres.value.typeSupport)
  return type?.label || ''
})

const chargerReferentiels = async () => {
  try {
    const [n, t, tg, types, diffs] = await Promise.all([
      api.get('/api/niveaux'),
      api.get('/api/thematiques'),
      api.get('/api/tags'),
      api.get('/api/filtres-config/actifs/TYPE_SUPPORT'),
      api.get('/api/filtres-config/actifs/DIFFICULTE')
    ])
    niveaux.value = n.data || []
    thematiques.value = t.data || []
    tags.value = tg.data || []
    typesFiltres.value = (types.data || []).map(f => ({ value: f.valeur, label: f.libelle }))
    difficultes.value = (diffs.data || []).map(f => ({ value: f.valeur, label: f.libelle }))
  } catch { /* silencieux */ }
}

const charger = async () => {
  loading.value = true

  try {
    const payload = {}

    if (keyword.value.trim()) {
      payload.keyword = keyword.value.trim()
    }

    if (filtres.value.niveauId) {
      payload.niveauId = filtres.value.niveauId
    }

    if (filtres.value.typeSupport)  payload.typeSupport  = filtres.value.typeSupport
    if (filtres.value.thematiqueId) payload.thematiqueId = filtres.value.thematiqueId
    if (filtres.value.difficulte)   payload.difficulte   = filtres.value.difficulte
    if (filtres.value.tag)          payload.tag          = filtres.value.tag

    const response = Object.keys(payload).length > 0
      ? await api.post('/api/ressources/rechercher', payload)
      : await api.get('/api/ressources')

    ressources.value = response.data || []
    appliquerTriLocal()
  } catch (error) {
    ressources.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await chargerReferentiels()
  // Appliquer les filtres du quiz de positionnement si présents
  const q = route.query
  if (q.difficulte) filtres.value.difficulte = q.difficulte
  if (q.thematiqueId) filtres.value.thematiqueId = Number(q.thematiqueId)
  if (q.typeSupport) filtres.value.typeSupport = q.typeSupport
  if (q.dureeMax) filtres.value.dureeMax = Number(q.dureeMax)  // handled in search payload
  await charger()
})

const setFiltre = (key, value) => {
  filtres.value[key] = filtres.value[key] === value ? null : value
  charger()
}

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(charger, 350)
}

const resetFiltres = () => {
  keyword.value = ''
  tri.value = 'pertinence'
  filtres.value = {
    niveauId: null,
    typeSupport: null,
    thematiqueId: null,
    difficulte: null,
    tag: null
  }
  charger()
}

const appliquerTriLocal = () => {
  if (tri.value === 'duree') {
    ressources.value = [...ressources.value].sort((a, b) => (a.dureeMinutes || 0) - (b.dureeMinutes || 0))
    return
  }

  if (tri.value === 'recent') {
    ressources.value = [...ressources.value].sort(
      (a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0)
    )
    return
  }
}
</script>

<style scoped>
.catalogue-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 300px;
  background: linear-gradient(135deg, #d4ff00ba 10%, #222240 50%, #120F34 100%);
  padding: 80px 20px;
  display: grid;
  place-items: center;
  text-align: center;
  color: white;
}

.space-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15), transparent 25%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1), transparent 25%);
}

.glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.glow-left {
  left: -100px;
  top: 50px;
  background: rgba(255, 255, 255, 0.3);
}

.glow-right {
  right: -50px;
  bottom: 100px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  margin: 0 0 16px;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-content p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.95;
}

/* Main Layout */
.catalogue-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 28px;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.clear-all-btn {
  padding: 4px 10px;
  font-size: 0.8rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #fecaca;
}

.sidebar-block {
  margin-bottom: 20px;
}

.sidebar-block h3 {
  margin: 0 0 12px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: left;
}

.filter-checkbox:hover {
  background: #f9fafb;
  color: #374151;
}

.filter-checkbox.active {
  background: linear-gradient(135deg, #dbeafe, #e9d5ff);
  color: #6366f1;
  font-weight: 600;
  border-color: #6366f1;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.filter-checkbox.active .checkbox {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: #6366f1;
  color: white;
  font-size: 12px;
}

.filter-checkbox.active .checkbox::after {
  content: '✓';
}

/* Content Section */
.catalogue-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.catalogue-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-left h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #D4FF00;
}

.resource-count {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.creator-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f766e, #0ea5e9);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search-input {
  width: 100%;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.sort-select {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover {
  border-color: #d1d5db;
}

.sort-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Active Filters */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 10px;
  border-left: 4px solid #0ea5e9;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #bae6fd;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #0369a1;
}

.filter-tag strong {
  font-weight: 700;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: #0ea5e9;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.tag-remove:hover {
  color: #0369a1;
  scale: 1.2;
}

/* Cards Shell */
.cards-shell {
  position: relative;
  overflow: hidden;
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b0764, #312e81 55%, #1d4ed8);
  min-height: 200px;
}

.cards-space {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.18), transparent 18%),
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.12), transparent 12%);
}

.resource-grid,
.state-panel {
  position: relative;
  z-index: 1;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.state-panel {
  display: grid;
  place-items: center;
  min-height: 260px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #6b7280;
  text-align: center;
  padding: 40px 20px;
}

.state-panel.loading {
  font-weight: 500;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-panel.empty {
  flex-direction: column;
}

.state-panel h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 1.2rem;
}

.state-panel p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .catalogue-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .hero-content h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .catalogue-layout {
    padding: 24px 16px;
    gap: 20px;
  }

  .catalogue-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    flex-direction: column;
  }

  .search-wrapper,
  .sort-select {
    width: 100%;
  }

  .resource-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
  }

  .hero-section {
    min-height: 240px;
    padding: 60px 20px;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-content p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .catalogue-layout {
    padding: 16px;
  }

  .toolbar-left h2 {
    font-size: 1.3rem;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-block h3 {
    font-size: 0.85rem;
  }

  .filter-checkbox {
    font-size: 0.8rem;
    padding: 8px 10px;
  }

  .active-filters {
    gap: 6px;
    padding: 10px;
  }

  .filter-tag {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
}

.search-sidebar input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #dee2e6;
  border-radius: 10px;
  font: inherit;
  font-size: 13px;
  color: #1f2937;
  background: #f9fafb;
}
.search-sidebar input:focus { outline: none; border-color: #6366f1; }

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-btn {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.tag-btn:hover { border-color: #6366f1; color: #6366f1; }
.tag-btn.active { background: #6366f1; border-color: #6366f1; color: white; }
</style>