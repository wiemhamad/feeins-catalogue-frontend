<template>
  <div class="templates-page">

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>📋 Scénarios pédagogiques</h1>
        <p>Découvrez les templates construits par les enseignants à partir des ressources FEEINS validées.</p>
      </div>
    </section>

    <section class="templates-layout">

      <!-- SIDEBAR FILTRES -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Filtres</h2>
          <button v-if="filtreType !== ''" class="clear-btn" @click="filtreType = ''">✕ Réinitialiser</button>
        </div>

        <div class="sidebar-block">
          <h3>Type</h3>
          <div class="filter-group">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              class="filter-btn"
              :class="{ active: filtreType === opt.value }"
              @click="filtreType = filtreType === opt.value ? '' : opt.value"
            >
              <span class="checkbox"></span>
              {{ opt.label }}
            </button>
          </div>
        </div>
      </aside>

      <!-- CONTENU PRINCIPAL -->
      <section class="templates-content">

        <!-- BARRE RECHERCHE -->
        <div class="toolbar">
          <div class="toolbar-left">
            <h2>Templates disponibles</h2>
            <span class="count">{{ templatesFiltres.length }} résultat(s)</span>
          </div>
          <input
            v-model="recherche"
            type="text"
            class="search-input"
            placeholder="🔍 Rechercher un template..."
          />
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="state-panel">
          <div class="loader"></div>
          Chargement des templates...
        </div>

        <!-- VIDE -->
        <div v-else-if="templatesFiltres.length === 0" class="state-panel empty">
          <h3>Aucun template trouvé</h3>
          <p>Essayez de modifier votre recherche ou vos filtres.</p>
        </div>

        <!-- GRILLE -->
        <div v-else class="cards-shell">
          <div class="cards-bg"></div>
          <div class="template-grid">
            <article
              v-for="t in templatesFiltres"
              :key="t.id"
              class="template-card"
              style="cursor:pointer"
              @click="router.push('/templates/' + t.id)"
            >
              <!-- BADGE type -->
              <div class="card-top">
                <span class="modif-badge" :class="t.modifiable ? 'modif-open' : 'modif-locked'">
                  {{ t.modifiable ? '🔓 Modifiable' : '🔒 Clé en main' }}
                </span>
              </div>

              <h3 class="card-title">{{ t.nom }}</h3>
              <p class="card-desc">{{ t.description || 'Aucune description disponible.' }}</p>

              <!-- RESSOURCES ASSOCIÉES -->
              <div v-if="t.ressources && t.ressources.length" class="ressources-preview">
                <div class="ressources-label">📚 Ressources incluses :</div>
                <div class="ressources-list">
                  <span
                    v-for="r in t.ressources.slice(0, 4)"
                    :key="r.id"
                    class="ressource-chip"
                    :class="'chip-' + r.typeSupport?.toLowerCase()"
                  >
                    {{ iconeType(r.typeSupport) }} {{ r.titre }}
                  </span>
                  <span v-if="t.ressources.length > 4" class="ressource-chip chip-more">
                    +{{ t.ressources.length - 4 }} autres
                  </span>
                </div>
              </div>
              <div v-else class="ressources-empty">Aucune ressource associée.</div>

              <!-- FOOTER -->
              <div class="card-footer">
                <span class="card-meta">{{ t.ressources?.length || 0 }} ressource(s)</span>
                <span class="card-link" @click.stop="router.push('/templates/' + t.id)">Voir les ressources →</span>
              </div>
            </article>
          </div>
        </div>

      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const templates = ref([])
const router = useRouter()
const loading = ref(true)
const recherche = ref('')
const filtreType = ref('')  // '' | 'modifiable' | 'locked'

const typeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'modifiable', label: '🔓 Modifiable' },
  { value: 'locked', label: '🔒 Clé en main' }
]

const templatesFiltres = computed(() => {
  return templates.value.filter(t => {
    const q = recherche.value.toLowerCase()
    const matchQ = !q ||
      t.nom?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.ressources?.some(r => r.titre?.toLowerCase().includes(q))
    const matchType =
      filtreType.value === '' ||
      (filtreType.value === 'modifiable' && t.modifiable) ||
      (filtreType.value === 'locked' && !t.modifiable)
    return matchQ && matchType
  })
})

const iconeType = (type) =>
  ({ VIDEO: '🎥', H5P: '🎮', PDF: '📄', QUIZ: '❓', HTML: '🌐', LIEN: '🔗', AUTRE: '📦' }[type] || '📦')

onMounted(async () => {
  try {
    const { data } = await api.get('/api/templates/public')
    templates.value = data || []
  } catch {
    templates.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.templates-page { display:flex;flex-direction:column;min-height:100vh; }

/* HERO */
.hero-section {
  position:relative;overflow:hidden;min-height:220px;
  background:linear-gradient(135deg, #1d4ed8 0%, #312e81 50%, #4c1d95 100%);
  padding:60px 20px;display:grid;place-items:center;text-align:center;color:white;
}
.hero-content h1 { margin:0 0 12px;font-size:2.2rem;font-weight:800; }
.hero-content p { margin:0;font-size:1rem;opacity:0.9;max-width:560px; }

/* LAYOUT */
.templates-layout {
  max-width:1280px;margin:0 auto;padding:40px 20px;width:100%;
  display:grid;grid-template-columns:240px 1fr;gap:28px;
}

/* SIDEBAR */
.sidebar {
  position:sticky;top:80px;height:fit-content;
  background:white;border:1px solid #e5e7eb;border-radius:12px;
  padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.05);
}
.sidebar-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f3f4f6; }
.sidebar-header h2 { margin:0;font-size:1rem;font-weight:700;color:#1f2937; }
.clear-btn { padding:4px 10px;font-size:0.78rem;background:#fee2e2;color:#dc2626;border:none;border-radius:6px;cursor:pointer;font-weight:600; }
.sidebar-block { margin-bottom:16px; }
.sidebar-block h3 { margin:0 0 10px;font-size:0.9rem;font-weight:700;color:#374151; }
.filter-group { display:flex;flex-direction:column;gap:6px; }
.filter-btn {
  display:flex;align-items:center;gap:10px;padding:9px 12px;
  border:1px solid transparent;background:transparent;border-radius:8px;
  cursor:pointer;color:#6b7280;font-size:0.88rem;text-align:left;
}
.filter-btn:hover { background:#f9fafb;color:#374151; }
.filter-btn.active { background:linear-gradient(135deg,#dbeafe,#e9d5ff);color:#6366f1;font-weight:600;border-color:#6366f1; }
.checkbox { width:16px;height:16px;border:2px solid #d1d5db;border-radius:4px;flex-shrink:0;display:grid;place-items:center; }
.filter-btn.active .checkbox { background:#6366f1;border-color:#6366f1; }
.filter-btn.active .checkbox::after { content:'✓';color:white;font-size:11px; }

/* CONTENT */
.templates-content { display:flex;flex-direction:column;gap:20px; }
.toolbar { display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap; }
.toolbar-left { display:flex;align-items:center;gap:12px; }
.toolbar-left h2 { margin:0;font-size:1.5rem;font-weight:800;color:#D4FF00; }
.count { padding:5px 12px;background:#f3f4f6;color:#6b7280;border-radius:20px;font-size:0.82rem;font-weight:600; }
.search-input {
  min-height:40px;padding:0 14px;border:1px solid #e5e7eb;border-radius:10px;
  background:white;color:#1f2937;font-size:0.9rem;min-width:240px;
}
.search-input:focus { outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1); }

/* CARDS SHELL */
.cards-shell {
  position:relative;overflow:hidden;padding:20px;border-radius:14px;
  background:linear-gradient(135deg,#3b0764,#312e81 55%,#1d4ed8);min-height:200px;
}
.cards-bg {
  position:absolute;inset:0;
  background:radial-gradient(circle at 80% 70%,rgba(255,255,255,0.18),transparent 18%),
             radial-gradient(circle at 25% 30%,rgba(255,255,255,0.12),transparent 12%);
}
.template-grid {
  position:relative;z-index:1;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;
}

/* STATE */
.state-panel {
  display:grid;place-items:center;min-height:260px;border-radius:12px;
  background:rgba(255,255,255,0.95);color:#6b7280;text-align:center;padding:40px 20px;
}
.loader { width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px; }
@keyframes spin { to { transform:rotate(360deg); } }
.state-panel.empty h3 { margin:0 0 8px;color:#1f2937; }
.state-panel.empty p { margin:0;color:#9ca3af;font-size:0.92rem; }

/* TEMPLATE CARD */
.template-card {
  display:flex;flex-direction:column;gap:10px;padding:18px;
  border:1px solid rgba(226,232,240,0.9);border-radius:14px;
  background:rgba(255,255,255,0.97);min-height:200px;
}
.card-top { display:flex;justify-content:flex-end; }
.modif-badge { padding:3px 10px;border-radius:999px;font-size:0.7rem;font-weight:700; }
.modif-open { background:#dcfce7;color:#166534; }
.modif-locked { background:#fef3c7;color:#92400e; }

.card-title { margin:0;font-size:0.96rem;font-weight:800;color:#1e293b;line-height:1.35; }
.card-desc { margin:0;color:#64748b;font-size:0.82rem;line-height:1.55;flex:1; }

/* Ressources associées */
.ressources-preview { display:flex;flex-direction:column;gap:6px; }
.ressources-label { font-size:0.75rem;font-weight:700;color:#475569; }
.ressources-list { display:flex;flex-wrap:wrap;gap:5px; }
.ressource-chip {
  padding:3px 8px;border-radius:6px;font-size:0.68rem;font-weight:600;
  max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.chip-video { background:#fee2e2;color:#991b1b; }
.chip-h5p { background:#f3e8ff;color:#6d28d9; }
.chip-pdf { background:#fff7ed;color:#c2410c; }
.chip-quiz { background:#eff6ff;color:#1d4ed8; }
.chip-html { background:#dcfce7;color:#166534; }
.chip-lien { background:#e0f2fe;color:#0369a1; }
.chip-autre { background:#f1f5f9;color:#475569; }
.chip-more { background:#f1f5f9;color:#94a3b8; }
.ressources-empty { font-size:0.75rem;color:#cbd5e1;font-style:italic; }

/* FOOTER */
.card-footer { display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px solid #eef2f7; }
.card-meta { color:#94a3b8;font-size:0.74rem; }
.card-link { color:#6366f1;font-size:0.74rem;font-weight:700;text-decoration:none; }
.card-link:hover { text-decoration:underline; }

@media (max-width:1024px) { .templates-layout { grid-template-columns:1fr; } .sidebar { position:static; } }
@media (max-width:640px) { .toolbar { flex-direction:column;align-items:stretch; } .search-input { min-width:unset;width:100%; } }
</style>