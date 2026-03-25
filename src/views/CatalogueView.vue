<template>
  <div class="catalogue-page">
    <section class="catalogue-layout">
      <aside class="sidebar">
        <div class="sidebar-block">
          <div class="sidebar-title">Filtres</div>
        </div>

        <div class="sidebar-block">
          <h2>Niveau</h2>
          <button
            v-for="niveau in niveauxFiltres"
            :key="String(niveau.value)"
            type="button"
            class="filter-link"
            :class="{ active: filtres.niveauId === niveau.value }"
            @click="setFiltre('niveauId', niveau.value)"
          >
            {{ niveau.label }}
          </button>
        </div>

        <div class="sidebar-block">
          <h2>Type de contenu</h2>
          <button
            v-for="type in typesFiltres"
            :key="String(type.value)"
            type="button"
            class="filter-link"
            :class="{ active: filtres.typeSupport === type.value }"
            @click="setFiltre('typeSupport', type.value)"
          >
            {{ type.label }}
          </button>
        </div>

        <button type="button" class="reset-button" @click="resetFiltres">
          Reinitialiser
        </button>
      </aside>

      <section class="catalogue-content">
        <div class="catalogue-toolbar">
          <div>
            <h1>Catalogue ({{ total }})</h1>
          </div>

          <div class="toolbar-actions">
            <input
              v-model="keyword"
              type="text"
              class="search-input"
              placeholder="Rechercher..."
              @input="onSearch"
            />

            <select v-model="tri" class="sort-select" @change="appliquerTriLocal">
              <option value="pertinence">Pertinence</option>
              <option value="recent">Plus recent</option>
              <option value="duree">Duree</option>
            </select>
          </div>
        </div>

        <div class="cards-shell">
          <div class="cards-space"></div>

          <div v-if="loading" class="state-panel">Chargement du catalogue...</div>
          <div v-else-if="ressources.length === 0" class="state-panel">
            Aucune ressource ne correspond aux filtres actuels.
          </div>

          <div v-else class="resource-grid">
            <RessourceCard
              v-for="ressource in ressources"
              :key="ressource.id"
              :ressource="ressource"
              action-label="Voir la ressource"
            />
          </div>
        </div>
      </section>
    </section>

    <footer class="page-footer">
      <div class="footer-column">
        <h3>FEEINS</h3>
        <p>Former des Enseignants et des Etudiants Ingenieurs au Numerique en Sante.</p>
      </div>
      <div class="footer-column">
        <h3>Liens Utiles</h3>
        <a href="#">A propos</a>
        <a href="#">Contact</a>
        <a href="#">Mentions legales</a>
      </div>
      <div class="footer-column">
        <h3>Partenaires</h3>
        <div class="partners">
          <span>UC</span>
          <span>unit</span>
          <span>ISIS</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/api/axios'
import RessourceCard from '@/components/RessourceCard.vue'

const ressources = ref([])
const niveaux = ref([])
const loading = ref(true)
const keyword = ref('')
const tri = ref('pertinence')
const filtres = ref({
  niveauId: null,
  typeSupport: null
})

let searchTimer = null

const niveauxFiltres = computed(() => [
  { value: null, label: 'Tous les niveaux' },
  ...niveaux.value.map((niveau) => ({
    value: niveau.id,
    label: niveau.nom
  }))
])

const typesFiltres = [
  { value: null, label: 'Tous les types' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'H5P', label: 'H5P (Interactif)' },
  { value: 'PDF', label: 'PDF' }
]

const total = computed(() => ressources.value.length)

const chargerNiveaux = async () => {
  try {
    const response = await api.get('/api/niveaux')
    niveaux.value = response.data || []
  } catch (error) {
    niveaux.value = []
  }
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

    if (filtres.value.typeSupport) {
      payload.typeSupport = filtres.value.typeSupport
    }

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
  await chargerNiveaux()
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
    typeSupport: null
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
  max-width: 1180px;
  margin: 0 auto;
}

.catalogue-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 18px;
}

.sidebar,
.catalogue-content,
.page-footer {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.sidebar {
  padding: 18px;
  height: fit-content;
}

.sidebar-title {
  font-size: 0.95rem;
  font-weight: 800;
}

.sidebar-block + .sidebar-block {
  margin-top: 18px;
}

.sidebar-block h2 {
  margin: 0 0 10px;
  font-size: 0.82rem;
  text-transform: uppercase;
  color: #475569;
}

.filter-link {
  display: block;
  width: 100%;
  padding: 8px 0;
  border: none;
  background: transparent;
  text-align: left;
  color: #64748b;
  cursor: pointer;
}

.filter-link.active {
  color: #0f766e;
  font-weight: 700;
}

.reset-button {
  width: 100%;
  min-height: 40px;
  margin-top: 8px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
}

.catalogue-content {
  padding: 18px;
}

.catalogue-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.catalogue-toolbar h1 {
  margin: 0;
  font-size: 1.7rem;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.search-input,
.sort-select {
  min-height: 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 12px;
  color: #334155;
}

.search-input {
  min-width: 220px;
}

.cards-shell {
  position: relative;
  overflow: hidden;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b0764, #312e81 55%, #1d4ed8);
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.state-panel {
  display: grid;
  place-items: center;
  min-height: 240px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #64748b;
}

.page-footer {
  margin-top: 18px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 24px;
}

.footer-column h3 {
  margin: 0 0 10px;
  font-size: 0.92rem;
}

.footer-column p,
.footer-column a {
  display: block;
  margin: 0 0 8px;
  color: #64748b;
  text-decoration: none;
}

.partners {
  display: flex;
  gap: 12px;
}

.partners span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 28px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
}

@media (max-width: 960px) {
  .catalogue-layout,
  .resource-grid,
  .page-footer {
    grid-template-columns: 1fr;
  }

  .catalogue-toolbar,
  .toolbar-actions {
    flex-direction: column;
  }

  .search-input {
    min-width: 0;
    width: 100%;
  }
}
</style>
