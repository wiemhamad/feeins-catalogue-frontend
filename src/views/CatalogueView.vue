<template>
  <div class="catalogue-page">

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Explorer le Catalogue</h1>
        <p>{{ total }} ressource{{ total > 1 ? 's' : '' }} pédagogique{{ total > 1 ? 's' : '' }} disponible{{ total > 1 ? 's' : '' }}</p>
      </div>
    </section>

    <section class="catalogue-layout">

      <!-- ===== SIDEBAR FILTRES ===== -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Filtres</h2>
          <button v-if="hasActiveFilters" class="clear-all-btn" @click="resetFiltres">✕ Tout effacer</button>
        </div>

        <!-- Recherche texte -->
        <div class="sidebar-block">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="keyword"
              type="text"
              class="search-input"
              placeholder="Rechercher..."
              @input="onSearch"
            />
          </div>
        </div>

        <!-- Niveaux (depuis la BDD) -->
        <div class="sidebar-block">
          <h3>Niveau</h3>
          <div class="filter-group">
            <button
              v-for="n in niveaux"
              :key="n.id"
              class="filter-btn"
              :class="{ active: filtres.niveauId === n.id }"
              @click="toggleFiltre('niveauId', n.id)"
            >
              <span class="check"></span> 🎓 {{ n.nom }}
            </button>
          </div>
        </div>

        <!-- Thématiques (depuis la BDD) -->
        <div class="sidebar-block">
          <h3>Thématique</h3>
          <div class="filter-group">
            <button
              v-for="t in thematiques"
              :key="t.id"
              class="filter-btn"
              :class="{ active: filtres.thematiqueId === t.id }"
              @click="toggleFiltre('thematiqueId', t.id)"
            >
              <span class="check"></span> {{ t.nom }}
            </button>
          </div>
        </div>

        <!-- Types de contenu -->
        <div class="sidebar-block">
          <h3>Type de contenu</h3>
          <div class="filter-group">
            <button
              v-for="type in typesFiltres"
              :key="type.value"
              class="filter-btn"
              :class="{ active: filtres.typeSupport === type.value }"
              @click="toggleFiltre('typeSupport', type.value)"
            >
              <span class="check"></span> {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Difficulté -->
        <div class="sidebar-block">
          <h3>Difficulté</h3>
          <div class="filter-group">
            <button v-for="d in difficultes" :key="d.value" class="filter-btn"
              :class="{ active: filtres.difficulte === d.value }"
              @click="toggleFiltre('difficulte', d.value)">
              <span class="check"></span> {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Tags (depuis la BDD) -->
        <div class="sidebar-block">
          <h3>Tags</h3>
          <div class="tags-cloud">
            <button
              v-for="tag in tags"
              :key="tag.id"
              class="tag-btn"
              :class="{ active: filtres.tag === tag.libelle }"
              @click="toggleFiltre('tag', tag.libelle)"
            >
              #{{ tag.libelle }}
            </button>
          </div>
        </div>
      </aside>

      <!-- ===== CONTENU PRINCIPAL ===== -->
      <section class="catalogue-content">

        <!-- Barre d'outils -->
        <div class="catalogue-toolbar">
          <div class="toolbar-left">
            <h2>Ressources</h2>
            <span class="resource-count">{{ total }} résultat{{ total > 1 ? 's' : '' }}</span>
          </div>
          <div class="toolbar-right">
            <select v-model="tri" class="sort-select" @change="appliquerTri">
              <option value="recent">Plus récent</option>
              <option value="duree-asc">Durée ↑</option>
              <option value="duree-desc">Durée ↓</option>
              <option value="alpha">A → Z</option>
            </select>
          </div>
        </div>

        <!-- Filtres actifs -->
        <div v-if="hasActiveFilters" class="active-filters">
          <div v-if="keyword" class="filter-pill">
            🔍 "{{ keyword }}" <button @click="keyword=''; charger()">✕</button>
          </div>
          <div v-if="filtres.niveauId" class="filter-pill">
            🎓 {{ niveaux.find(n=>n.id===filtres.niveauId)?.nom }}
            <button @click="toggleFiltre('niveauId', filtres.niveauId)">✕</button>
          </div>
          <div v-if="filtres.thematiqueId" class="filter-pill">
            📂 {{ thematiques.find(t=>t.id===filtres.thematiqueId)?.nom }}
            <button @click="toggleFiltre('thematiqueId', filtres.thematiqueId)">✕</button>
          </div>
          <div v-if="filtres.typeSupport" class="filter-pill">
            {{ typesFiltres.find(t=>t.value===filtres.typeSupport)?.label }}
            <button @click="toggleFiltre('typeSupport', filtres.typeSupport)">✕</button>
          </div>
          <div v-if="filtres.difficulte" class="filter-pill">
            {{ difficultes.find(d=>d.value===filtres.difficulte)?.label }}
            <button @click="toggleFiltre('difficulte', filtres.difficulte)">✕</button>
          </div>
          <div v-if="filtres.tag" class="filter-pill">
            #{{ filtres.tag }} <button @click="toggleFiltre('tag', filtres.tag)">✕</button>
          </div>
        </div>

        <!-- GRILLE -->
        <div class="cards-shell">
          <div v-if="loading" class="state-panel">
            <div class="loader"></div>
            Chargement du catalogue...
          </div>

          <div v-else-if="ressources.length === 0" class="state-panel empty">
            <div class="empty-icon">🔎</div>
            <h3>Aucune ressource trouvée</h3>
            <p>Essayez de modifier vos filtres</p>
            <button class="reset-btn" @click="resetFiltres">Réinitialiser les filtres</button>
          </div>

          <div v-else class="resource-grid">
            <RessourceCard
              v-for="r in ressources"
              :key="r.id"
              :ressource="r"
              action-label="Consulter"
              @click="ouvrirDetail(r)"
            />
          </div>
        </div>
      </section>
    </section>

    <!-- ===== MODALE DÉTAIL RESSOURCE ===== -->
    <div v-if="ressourceDetail" class="modal-overlay" @click.self="ressourceDetail = null">
      <div class="modal-detail">
        <button class="modal-close" @click="ressourceDetail = null">✕</button>

        <div class="detail-top">
          <span class="type-badge-lg" :class="'type-' + ressourceDetail.typeSupport?.toLowerCase()">
            {{ iconeType(ressourceDetail.typeSupport) }} {{ ressourceDetail.typeSupport }}
          </span>
          <span v-if="ressourceDetail.difficulte" class="diff-badge-lg" :class="diffClass(ressourceDetail.difficulte)">
            {{ labelDiff(ressourceDetail.difficulte) }}
          </span>
        </div>

        <h2>{{ ressourceDetail.titre }}</h2>
        <p class="detail-nomenclature">{{ ressourceDetail.nomenclature }}</p>
        <p class="detail-desc">{{ ressourceDetail.description }}</p>

        <div class="detail-meta-grid">
          <div v-if="ressourceDetail.niveauNom" class="detail-meta-item">
            <span class="meta-label">Niveau</span>
            <span class="meta-val">🎓 {{ ressourceDetail.niveauNom }}</span>
          </div>
          <div v-if="ressourceDetail.thematiqueNom" class="detail-meta-item">
            <span class="meta-label">Thématique</span>
            <span class="meta-val">📂 {{ ressourceDetail.thematiqueNom }}</span>
          </div>
          <div v-if="ressourceDetail.dureeMinutes" class="detail-meta-item">
            <span class="meta-label">Durée</span>
            <span class="meta-val">⏱ {{ ressourceDetail.dureeMinutes }} min</span>
          </div>
          <div v-if="ressourceDetail.usagePedagogique" class="detail-meta-item">
            <span class="meta-label">Usage</span>
            <span class="meta-val">{{ formatUsage(ressourceDetail.usagePedagogique) }}</span>
          </div>
          <div v-if="ressourceDetail.auteurPartenaire" class="detail-meta-item">
            <span class="meta-label">Auteur</span>
            <span class="meta-val">✍️ {{ ressourceDetail.auteurPartenaire }}</span>
          </div>
          <div v-if="ressourceDetail.contributeurNom" class="detail-meta-item">
            <span class="meta-label">Contributeur</span>
            <span class="meta-val">👤 {{ ressourceDetail.contributeurNom }}</span>
          </div>
        </div>

        <div v-if="ressourceDetail.objectifsPedagogiques" class="detail-section">
          <h4>🎯 Objectifs pédagogiques</h4>
          <p>{{ ressourceDetail.objectifsPedagogiques }}</p>
        </div>

        <div v-if="ressourceDetail.competencesVisees" class="detail-section">
          <h4>🏆 Compétences visées</h4>
          <p>{{ ressourceDetail.competencesVisees }}</p>
        </div>

        <div v-if="ressourceDetail.tags?.length" class="detail-tags">
          <span v-for="tag in ressourceDetail.tags" :key="tag" class="detail-tag">#{{ tag }}</span>
        </div>

        <div class="detail-actions">
          <button class="btn-fermer" @click="ressourceDetail = null">Fermer</button>
          <a
            v-if="ressourceDetail.urlAcces && !ressourceDetail.urlAcces.startsWith('[')"
            :href="ressourceDetail.urlAcces"
            target="_blank"
            rel="noopener"
            class="btn-ouvrir"
          >
            🔗 Ouvrir la ressource
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/api/axios'
import RessourceCard from '@/components/RessourceCard.vue'
import { diffClass, labelDiff } from '@/utils/ressource-ui'

// ===== DONNÉES =====
const ressources = ref([])
const niveaux = ref([])
const thematiques = ref([])
const tags = ref([])
const loading = ref(true)
const ressourceDetail = ref(null)

// ===== FILTRES =====
const keyword = ref('')
const tri = ref('recent')
const filtres = ref({
  niveauId: null,
  thematiqueId: null,
  typeSupport: null,
  difficulte: null,
  tag: null
})

let searchTimer = null

const typesFiltres = [
  { value: 'VIDEO',  label: '🎥 Vidéo' },
  { value: 'H5P',   label: '🎮 H5P interactif' },
  { value: 'PDF',   label: '📄 PDF' },
  { value: 'QUIZ',  label: '❓ Quiz' },
  { value: 'HTML',  label: '🌐 HTML' },
  { value: 'LIEN',  label: '🔗 Lien externe' },
]

const difficultes = [
  { value: 'DEBUTANT',      label: '🟢 Débutant' },
  { value: 'INTERMEDIAIRE', label: '🟡 Intermédiaire' },
  { value: 'AVANCE',        label: '🔴 Avancé' },
]

const total = computed(() => ressources.value.length)

const hasActiveFilters = computed(() =>
  keyword.value.trim() !== '' ||
  Object.values(filtres.value).some(v => v !== null)
)

// ===== CHARGEMENT =====
const chargerReferentiels = async () => {
  const [n, t, tg] = await Promise.all([
    api.get('/api/niveaux'),
    api.get('/api/thematiques'),
    api.get('/api/tags')
  ])
  niveaux.value = n.data || []
  thematiques.value = t.data || []
  tags.value = tg.data || []
}

const charger = async () => {
  loading.value = true
  try {
    const payload = {}
    if (keyword.value.trim())    payload.keyword = keyword.value.trim()
    if (filtres.value.niveauId)     payload.niveauId = filtres.value.niveauId
    if (filtres.value.thematiqueId) payload.thematiqueId = filtres.value.thematiqueId
    if (filtres.value.typeSupport)  payload.typeSupport = filtres.value.typeSupport
    if (filtres.value.difficulte)   payload.difficulte = filtres.value.difficulte
    if (filtres.value.tag)          payload.tag = filtres.value.tag

    const hasFiltre = Object.keys(payload).length > 0
    const response = hasFiltre
      ? await api.post('/api/ressources/rechercher', payload)
      : await api.get('/api/ressources')

    ressources.value = response.data || []
    appliquerTri()
  } catch {
    ressources.value = []
  } finally {
    loading.value = false
  }
}

// ===== FILTRES =====
const toggleFiltre = (key, value) => {
  filtres.value[key] = filtres.value[key] === value ? null : value
  charger()
}

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(charger, 350)
}

const resetFiltres = () => {
  keyword.value = ''
  tri.value = 'recent'
  filtres.value = { niveauId:null, thematiqueId:null, typeSupport:null, difficulte:null, tag:null }
  charger()
}

// ===== TRI =====
const appliquerTri = () => {
  const r = [...ressources.value]
  if (tri.value === 'recent')
    r.sort((a,b) => new Date(b.dateCreation||0) - new Date(a.dateCreation||0))
  else if (tri.value === 'duree-asc')
    r.sort((a,b) => (a.dureeMinutes||0) - (b.dureeMinutes||0))
  else if (tri.value === 'duree-desc')
    r.sort((a,b) => (b.dureeMinutes||0) - (a.dureeMinutes||0))
  else if (tri.value === 'alpha')
    r.sort((a,b) => a.titre?.localeCompare(b.titre))
  ressources.value = r
}

// ===== DÉTAIL =====
const ouvrirDetail = (r) => { ressourceDetail.value = r }

const iconeType = (t) =>
  ({ VIDEO:'🎥',H5P:'🎮',PDF:'📄',QUIZ:'❓',HTML:'🌐',LIEN:'🔗',AUTRE:'📦' }[t]||'📦')

const formatUsage = (u) => ({
  COURS: '📖 Cours',
  ACTIVITE: '✏️ Activité',
  EVALUATION_FORMATIVE: '✅ Éval. formative',
  EVALUATION_SOMMATIVE: '🔒 Éval. sommative',
  RESSOURCE_COMPLEMENTAIRE: '📎 Complémentaire',
  QUIZ_POSITIONNEMENT: '🎯 Quiz positionnement'
}[u] || u)

onMounted(async () => {
  await chargerReferentiels()
  await charger()
})
</script>

<style scoped>
.catalogue-page { display:flex;flex-direction:column;min-height:100vh; }

/* HERO */
.hero-section {
  background: linear-gradient(135deg,#d4ff00ba 10%,#222240 50%,#120F34 100%);
  padding: 70px 20px;
  display: grid; place-items: center; text-align: center; color: white;
}
.hero-content h1 { margin:0 0 12px;font-size:2.4rem;font-weight:800; }
.hero-content p  { margin:0;font-size:1rem;opacity:0.9; }

/* LAYOUT */
.catalogue-layout {
  max-width:1300px;margin:0 auto;padding:36px 20px;width:100%;
  display:grid;grid-template-columns:260px 1fr;gap:28px;
}

/* SIDEBAR */
.sidebar {
  position:sticky;top:80px;height:fit-content;
  background:white;border:1px solid #e5e7eb;border-radius:14px;
  padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.05);
  max-height:calc(100vh - 100px);overflow-y:auto;
}
.sidebar-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f3f4f6; }
.sidebar-header h2 { margin:0;font-size:1rem;font-weight:700; }
.clear-all-btn { padding:4px 10px;font-size:0.78rem;background:#fee2e2;color:#dc2626;border:none;border-radius:6px;cursor:pointer;font-weight:600; }

.sidebar-block { margin-bottom:20px; }
.sidebar-block h3 { margin:0 0 10px;font-size:0.88rem;font-weight:700;color:#374151; }

/* Champ recherche */
.search-wrapper { position:relative; }
.search-icon { position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px; }
.search-input { width:100%;padding:9px 12px 9px 32px;border:1.5px solid #e5e7eb;border-radius:10px;font:inherit;font-size:13px;color:#1f2937; }
.search-input:focus { outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1); }

/* Filtres boutons */
.filter-group { display:flex;flex-direction:column;gap:4px; }
.filter-btn {
  display:flex;align-items:center;gap:8px;
  padding:8px 10px;border:1px solid transparent;background:transparent;
  border-radius:8px;cursor:pointer;font-size:0.84rem;color:#6b7280;text-align:left;
  transition:all 0.15s;
}
.filter-btn:hover { background:#f9fafb;color:#374151; }
.filter-btn.active { background:linear-gradient(135deg,#eef2ff,#f5f3ff);color:#6366f1;font-weight:700;border-color:#6366f1; }
.check {
  width:16px;height:16px;border:1.5px solid #d1d5db;border-radius:4px;flex-shrink:0;
  display:grid;place-items:center;transition:all 0.15s;
}
.filter-btn.active .check { background:#6366f1;border-color:#6366f1; }
.filter-btn.active .check::after { content:'✓';color:white;font-size:11px; }

/* Tags cloud */
.tags-cloud { display:flex;flex-wrap:wrap;gap:6px; }
.tag-btn {
  padding:4px 10px;border-radius:999px;border:1px solid #e2e8f0;
  background:#f8fafc;color:#475569;font-size:0.72rem;font-weight:600;cursor:pointer;
  transition:all 0.15s;
}
.tag-btn:hover { border-color:#6366f1;color:#6366f1; }
.tag-btn.active { background:#6366f1;border-color:#6366f1;color:white; }

/* CONTENT */
.catalogue-content { display:flex;flex-direction:column;gap:18px; }

.catalogue-toolbar { display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap; }
.toolbar-left { display:flex;align-items:center;gap:12px; }
.toolbar-left h2 { margin:0;font-size:1.5rem;font-weight:800;color:#D4FF00; }
.resource-count { padding:5px 12px;background:#f3f4f6;color:#6b7280;border-radius:20px;font-size:0.82rem;font-weight:600; }
.sort-select { min-height:38px;padding:0 12px;border:1.5px solid #e5e7eb;border-radius:10px;background:white;color:#1f2937;font-size:0.88rem;cursor:pointer; }
.sort-select:focus { outline:none;border-color:#6366f1; }

/* Filtres actifs pills */
.active-filters { display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:#f0f4ff;border-radius:10px;border-left:4px solid #6366f1; }
.filter-pill {
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 12px;background:white;border:1px solid #c7d2fe;border-radius:999px;
  font-size:0.82rem;color:#4338ca;
}
.filter-pill button { background:none;border:none;color:#6366f1;cursor:pointer;font-size:0.9rem;padding:0;line-height:1; }

/* GRILLE */
.cards-shell {
  position:relative;padding:20px;border-radius:16px;min-height:200px;
  background:linear-gradient(135deg,#3b0764,#312e81 55%,#1d4ed8);
}
.resource-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(290px,1fr));
  gap:18px;
  position:relative;z-index:1;
}

.state-panel { display:grid;place-items:center;min-height:260px;border-radius:12px;background:rgba(255,255,255,0.95);color:#6b7280;text-align:center;padding:40px 20px;position:relative;z-index:1; }
.loader { width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px; }
@keyframes spin { to { transform:rotate(360deg); } }
.state-panel.empty { flex-direction:column; }
.empty-icon { font-size:2.5rem;margin-bottom:8px; }
.state-panel h3 { margin:0 0 8px;color:#1f2937; }
.state-panel p { margin:0 0 16px;color:#9ca3af; }
.reset-btn { padding:10px 20px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700; }

/* ===== MODALE DÉTAIL ===== */
.modal-overlay {
  position:fixed;inset:0;background:rgba(0,0,0,0.6);
  display:flex;align-items:center;justify-content:center;z-index:300;padding:20px;
}
.modal-detail {
  background:white;border-radius:20px;width:100%;max-width:640px;
  max-height:90vh;overflow-y:auto;padding:28px;
  position:relative;box-shadow:0 24px 64px rgba(0,0,0,0.4);
}
.modal-close { position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8; }

.detail-top { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
.type-badge-lg { padding:5px 14px;border-radius:999px;font-size:0.82rem;font-weight:800;color:white; }
.type-video{background:#e74c3c}.type-h5p{background:#9b59b6}.type-pdf{background:#e67e22}
.type-quiz{background:#3498db}.type-html{background:#27ae60}.type-lien{background:#1abc9c}.type-autre{background:#7f8c8d}
.diff-badge-lg { padding:5px 12px;border-radius:999px;font-size:0.78rem;font-weight:700; }
.diff-green{background:#dcfce7;color:#15803d}.diff-orange{background:#fef3c7;color:#b45309}.diff-red{background:#fee2e2;color:#b91c1c}

.modal-detail h2 { margin:0 0 4px;font-size:1.4rem;font-weight:900;color:#1e293b;line-height:1.3; }
.detail-nomenclature { font-size:11px;color:#94a3b8;font-family:monospace;margin:0 0 14px; }
.detail-desc { color:#475569;font-size:0.9rem;line-height:1.7;margin:0 0 20px; }

.detail-meta-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px; }
.detail-meta-item { background:#f8fafc;border-radius:10px;padding:10px 14px; }
.meta-label { display:block;font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px; }
.meta-val { font-size:0.88rem;font-weight:600;color:#1e293b; }

.detail-section { margin-bottom:16px; }
.detail-section h4 { margin:0 0 6px;font-size:0.9rem;font-weight:700;color:#334155; }
.detail-section p { margin:0;font-size:0.86rem;color:#475569;line-height:1.65; }

.detail-tags { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px; }
.detail-tag { background:#eef2ff;color:#4338ca;padding:4px 12px;border-radius:999px;font-size:0.75rem;font-weight:600; }

.detail-actions { display:flex;gap:12px;justify-content:flex-end;padding-top:16px;border-top:1px solid #e2e8f0; }
.btn-fermer { padding:11px 20px;background:#e2e8f0;border:none;border-radius:10px;cursor:pointer;font-weight:700;color:#334155; }
.btn-ouvrir { padding:11px 22px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px; }
.btn-ouvrir:hover { background:linear-gradient(135deg,#4f46e5,#4338ca); }

/* RESPONSIVE */
@media (max-width:1024px) { .catalogue-layout { grid-template-columns:1fr; } .sidebar { position:static;max-height:none; } }
@media (max-width:640px) { .resource-grid { grid-template-columns:1fr; } .detail-meta-grid { grid-template-columns:1fr; } }
</style>