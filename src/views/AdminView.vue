<template>
  <div class="admin">

    <!-- HEADER -->
    <div class="admin-header">
      <h1>👑 Dashboard Administrateur</h1>
      <p>Gestion et validation des ressources pédagogiques</p>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button
        :class="['tab', onglet === 'attente' ? 'tab-active' : '']"
        @click="onglet = 'attente'"
      >
        ⏳ En attente
        <span class="badge" v-if="enAttente.length">{{ enAttente.length }}</span>
      </button>
      <button
        :class="['tab', onglet === 'toutes' ? 'tab-active' : '']"
        @click="onglet = 'toutes'"
      >
        📋 Toutes les ressources
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <!-- ERREUR -->
    <div v-else-if="erreur" class="error">
      ⚠️ {{ erreur }}
      <br />
      <small>Vérifiez que vous êtes connecté en tant qu'administrateur</small>
    </div>

    <!-- LISTE EN ATTENTE -->
    <div v-else-if="onglet === 'attente'">
      <div v-if="enAttente.length === 0" class="empty">
        ✅ Aucune ressource en attente de validation
      </div>
      <div v-else class="liste">
        <div
          v-for="r in enAttente"
          :key="r.id"
          class="ressource-card"
        >
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">
                {{ iconeType(r.typeSupport) }} {{ r.typeSupport }}
              </span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom">🎓 {{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom">📂 {{ r.thematiqueNom }}</span>
              <span v-if="r.dureeMinutes">⏱ {{ r.dureeMinutes }} min</span>
              <span v-if="r.difficulte">📊 {{ r.difficulte }}</span>
              <span v-if="r.contributeurNom">👤 {{ r.contributeurNom }}</span>
            </div>
            <div v-if="r.tags && r.tags.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="actions">
            <a
              v-if="r.urlAcces"
              :href="r.urlAcces"
              target="_blank"
              class="btn-voir"
            >
              👁️ Voir
            </a>
            <button
              @click="valider(r.id)"
              class="btn-valider"
              :disabled="actionEnCours === r.id"
            >
              ✅ Valider
            </button>
            <button
              @click="refuser(r.id)"
              class="btn-refuser"
              :disabled="actionEnCours === r.id"
            >
              ❌ Refuser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOUTES LES RESSOURCES -->
    <div v-else>
      <div class="filtres-admin">
        <input
          v-model="recherche"
          type="text"
          placeholder="🔍 Rechercher..."
          class="input-search"
        />
        <select v-model="filtreStatut" class="select-filtre">
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">⏳ En attente</option>
          <option value="VALIDEE">✅ Validée</option>
          <option value="REFUSEE">❌ Refusée</option>
          <option value="ARCHIVEE">📦 Archivée</option>
        </select>
      </div>

      <div class="stats-bar">
        <span class="stat stat-attente">⏳ {{ compterStatut('EN_ATTENTE') }} en attente</span>
        <span class="stat stat-validee">✅ {{ compterStatut('VALIDEE') }} validées</span>
        <span class="stat stat-refusee">❌ {{ compterStatut('REFUSEE') }} refusées</span>
      </div>

      <div class="liste">
        <div
          v-for="r in ressourcesFiltrees"
          :key="r.id"
          class="ressource-card"
        >
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">
                {{ iconeType(r.typeSupport) }} {{ r.typeSupport }}
              </span>
              <span :class="['statut', 'statut-' + r.statut?.toLowerCase()]">
                {{ r.statut }}
              </span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom">🎓 {{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom">📂 {{ r.thematiqueNom }}</span>
              <span v-if="r.contributeurNom">👤 {{ r.contributeurNom }}</span>
            </div>
          </div>

          <!-- ACTIONS selon statut -->
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">
              👁️ Voir
            </a>
            <button
              v-if="r.statut === 'EN_ATTENTE' || r.statut === 'REFUSEE'"
              @click="valider(r.id)"
              class="btn-valider"
              :disabled="actionEnCours === r.id"
            >
              ✅ Valider
            </button>
            <button
              v-if="r.statut === 'EN_ATTENTE' || r.statut === 'VALIDEE'"
              @click="refuser(r.id)"
              class="btn-refuser"
              :disabled="actionEnCours === r.id"
            >
              ❌ Refuser
            </button>
            <button
              @click="supprimer(r.id)"
              class="btn-supprimer"
              :disabled="actionEnCours === r.id"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const loading = ref(false)
const erreur = ref('')
const onglet = ref('attente')
const recherche = ref('')
const filtreStatut = ref('')
const actionEnCours = ref(null)
const toutesRessources = ref([])

// Vérifier que l'utilisateur est admin
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user || user.role !== 'ADMINISTRATEUR_PEDAGOGIQUE') {
    router.push('/login')
    return
  }
  chargerToutesRessources()
})

const chargerToutesRessources = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const response = await api.get('/api/ressources/toutes')
    toutesRessources.value = response.data
  } catch (err) {
    erreur.value = 'Erreur lors du chargement. Vérifiez votre connexion.'
  } finally {
    loading.value = false
  }
}

// Ressources filtrées
const ressourcesFiltrees = computed(() => {
  return toutesRessources.value.filter(r => {
    const matchRecherche = !recherche.value ||
      r.titre?.toLowerCase().includes(recherche.value.toLowerCase())
    const matchStatut = !filtreStatut.value || r.statut === filtreStatut.value
    return matchRecherche && matchStatut
  })
})

// Ressources en attente seulement
const enAttente = computed(() =>
  toutesRessources.value.filter(r => r.statut === 'EN_ATTENTE')
)

const compterStatut = (statut) =>
  toutesRessources.value.filter(r => r.statut === statut).length

// Actions
const valider = async (id) => {
  actionEnCours.value = id
  try {
    await api.post(`/api/ressources/${id}/valider`)
    await chargerToutesRessources()
  } catch (err) {
    alert('Erreur lors de la validation')
  } finally {
    actionEnCours.value = null
  }
}

const refuser = async (id) => {
  if (!confirm('Refuser cette ressource ?')) return
  actionEnCours.value = id
  try {
    await api.post(`/api/ressources/${id}/refuser`)
    await chargerToutesRessources()
  } catch (err) {
    alert('Erreur lors du refus')
  } finally {
    actionEnCours.value = null
  }
}

const supprimer = async (id) => {
  if (!confirm('Supprimer définitivement cette ressource ?')) return
  actionEnCours.value = id
  try {
    await api.delete(`/api/ressources/${id}/supprimer`)
    await chargerToutesRessources()
  } catch (err) {
    alert('Erreur lors de la suppression')
  } finally {
    actionEnCours.value = null
  }
}

const iconeType = (type) => {
  const icones = {
    VIDEO: '🎥', H5P: '🎮', PDF: '📄',
    QUIZ: '❓', HTML: '🌐', LIEN: '🔗', AUTRE: '📦'
  }
  return icones[type] || '📦'
}
</script>

<style scoped>
.admin { max-width: 1000px; margin: 0 auto; padding: 20px; }

.admin-header { margin-bottom: 25px; }
.admin-header h1 { font-size: 1.8rem; color: #2c3e50; }
.admin-header p { color: #666; }

.tabs {
  display: flex; gap: 5px; margin-bottom: 25px;
  border-bottom: 2px solid #dee2e6; padding-bottom: 0;
}
.tab {
  padding: 10px 20px; border: none; background: none;
  cursor: pointer; font-size: 14px; font-weight: 500;
  color: #666; border-bottom: 3px solid transparent;
  margin-bottom: -2px; display: flex; align-items: center; gap: 6px;
}
.tab-active { color: #2c3e50; border-bottom-color: #2c3e50; }
.tab .badge {
  background: #120F34 0%; color: white;
  border-radius: 50%; width: 20px; height: 20px;
  font-size: 11px; display: flex; align-items: center; justify-content: center;
}

.loading { text-align: center; padding: 50px; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #f3f3f3;
  border-top: 4px solid #2c3e50; border-radius: 50%;
  animation: spin 1s linear infinite; margin: 0 auto 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { text-align: center; padding: 30px; color: #dc3545; }
.empty { text-align: center; padding: 50px; color: #27ae60; font-size: 1.1rem; }

.filtres-admin {
  display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;
}
.input-search {
  flex: 1; min-width: 200px; padding: 10px;
  border: 2px solid #dee2e6; border-radius: 8px; font-size: 14px;
}
.select-filtre {
  padding: 10px; border: 2px solid #dee2e6;
  border-radius: 8px; font-size: 14px; background: white;
}

.stats-bar {
  display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;
}
.stat {
  padding: 6px 14px; border-radius: 20px;
  font-size: 13px; font-weight: 500;
}
.stat-attente  { background: #fff3cd; color: #856404; }
.stat-validee  { background: #d4edda; color: #155724; }
.stat-refusee  { background: #f8d7da; color: #721c24; }

.liste { display: flex; flex-direction: column; gap: 15px; }

.ressource-card {
  background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 20px; display: flex;
  justify-content: space-between; align-items: flex-start; gap: 15px;
}

.ressource-info { flex: 1; }
.ressource-top {
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
}

.badge-type {
  padding: 3px 10px; border-radius: 12px;
  font-size: 11px; font-weight: bold; color: white;
}
.badge-video { background: #e74c3c; }
.badge-h5p   { background: #9b59b6; }
.badge-pdf   { background: #e67e22; }
.badge-quiz  { background: #3498db; }
.badge-html  { background: #27ae60; }
.badge-lien  { background: #1abc9c; }
.badge-autre { background: #95a5a6; }

.statut {
  padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;
}
.statut-en_attente  { background: #fff3cd; color: #856404; }
.statut-validee     { background: #d4edda; color: #155724; }
.statut-refusee     { background: #f8d7da; color: #721c24; }
.statut-archivee    { background: #e2e3e5; color: #383d41; }

.nomenclature { font-size: 11px; color: #aaa; font-family: monospace; }

.ressource-info h3 { font-size: 1rem; color: #2c3e50; margin-bottom: 6px; }
.description {
  font-size: 0.85rem; color: #666;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 10px;
}

.meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; color: #888; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tag {
  background: #e8f4f8; color: #2980b9;
  padding: 2px 8px; border-radius: 10px; font-size: 11px;
}

.actions {
  display: flex; flex-direction: column; gap: 8px; min-width: 100px;
}
.btn-voir {
  padding: 7px 12px; background: #f8f9fa; border: 1px solid #dee2e6;
  border-radius: 6px; text-decoration: none; font-size: 12px;
  text-align: center; color: #333;
}
.btn-voir:hover { background: #e9ecef; }
.btn-valider {
  padding: 7px 12px; background: #27ae60; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 12px;
}
.btn-valider:hover:not(:disabled) { background: #229954; }
.btn-refuser {
  padding: 7px 12px; background: #e74c3c; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 12px;
}
.btn-refuser:hover:not(:disabled) { background: #c0392b; }
.btn-supprimer {
  padding: 7px 12px; background: #95a5a6; color: white;
  border: none; border-radius: 6px; cursor: pointer; font-size: 12px;
}
.btn-supprimer:hover:not(:disabled) { background: #7f8c8d; }

button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>