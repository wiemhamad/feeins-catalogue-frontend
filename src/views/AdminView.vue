<template>
  <div class="admin">

    <div class="admin-header">
      <h1>👑 Dashboard Administrateur</h1>
      <p>Gestion et validation des ressources pédagogiques</p>
    </div>

    <div class="tabs">
      <button :class="['tab', onglet === 'attente' ? 'tab-active' : '']" @click="onglet = 'attente'">
        ⏳ En attente
        <span class="badge" v-if="enAttente.length">{{ enAttente.length }}</span>
      </button>
      <button :class="['tab', onglet === 'toutes' ? 'tab-active' : '']" @click="onglet = 'toutes'">
        📋 Toutes les ressources
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else-if="erreur" class="error">
      ⚠️ {{ erreur }}<br/>
      <small>Vérifiez que vous êtes connecté en tant qu'administrateur</small>
    </div>

    <!-- LISTE EN ATTENTE -->
    <div v-else-if="onglet === 'attente'">
      <div v-if="enAttente.length === 0" class="empty">✅ Aucune ressource en attente de validation</div>
      <div v-else class="liste">
        <div v-for="r in enAttente" :key="r.id" class="ressource-card">
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
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">👁️ Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier" :disabled="actionEnCours === r.id">✏️ Modifier</button>
            <button @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours === r.id">✅ Valider</button>
            <button @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours === r.id">❌ Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOUTES LES RESSOURCES -->
    <div v-else>
      <div class="filtres-admin">
        <input v-model="recherche" type="text" placeholder="🔍 Rechercher..." class="input-search" />
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
        <div v-for="r in ressourcesFiltrees" :key="r.id" class="ressource-card">
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">
                {{ iconeType(r.typeSupport) }} {{ r.typeSupport }}
              </span>
              <span :class="['statut', 'statut-' + r.statut?.toLowerCase()]">{{ r.statut }}</span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom">🎓 {{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom">📂 {{ r.thematiqueNom }}</span>
              <span v-if="r.contributeurNom">👤 {{ r.contributeurNom }}</span>
            </div>
            <div v-if="r.tags && r.tags.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">👁️ Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier" :disabled="actionEnCours === r.id">✏️ Modifier</button>
            <button v-if="r.statut === 'EN_ATTENTE' || r.statut === 'REFUSEE'" @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours === r.id">✅ Valider</button>
            <button v-if="r.statut === 'EN_ATTENTE' || r.statut === 'VALIDEE'" @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours === r.id">❌ Refuser</button>
            <button @click="supprimer(r.id)" class="btn-supprimer" :disabled="actionEnCours === r.id">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODALE MODIFICATION ADMIN ===== -->
    <div v-if="modale.ouverte" class="modal-overlay" @click.self="fermerModale">
      <div class="modal">
        <div class="modal-header">
          <h3>✏️ Modifier la ressource</h3>
          <button class="modal-close" @click="fermerModale">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Titre *</label>
            <input v-model="modale.form.titre" type="text" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="modale.form.description" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Type de support</label>
              <select v-model="modale.form.typeSupport">
                <option value="VIDEO">🎥 Vidéo</option>
                <option value="H5P">🎮 H5P</option>
                <option value="PDF">📄 PDF</option>
                <option value="QUIZ">❓ Quiz</option>
                <option value="HTML">🌐 HTML</option>
                <option value="LIEN">🔗 Lien</option>
                <option value="AUTRE">📦 Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Difficulté</label>
              <select v-model="modale.form.difficulte">
                <option value="">Non précisée</option>
                <option value="DEBUTANT">🟢 Débutant</option>
                <option value="INTERMEDIAIRE">🟡 Intermédiaire</option>
                <option value="AVANCE">🔴 Avancé</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Niveau</label>
              <select v-model="modale.form.niveauId">
                <option value="">Tous niveaux</option>
                <option v-for="n in niveaux" :key="n.id" :value="String(n.id)">{{ n.nom }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Thématique</label>
              <select v-model="modale.form.thematiqueId">
                <option value="">Non précisée</option>
                <option v-for="t in thematiques" :key="t.id" :value="String(t.id)">{{ t.nom }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Durée (minutes)</label>
              <input v-model.number="modale.form.dureeMinutes" type="number" min="1" />
            </div>
            <div class="form-group">
              <label>Usage pédagogique</label>
              <select v-model="modale.form.usagePedagogique">
                <option value="">Non précisé</option>
                <option value="COURS">📖 Cours</option>
                <option value="ACTIVITE">✏️ Activité</option>
                <option value="EVALUATION_FORMATIVE">✅ Éval. formative</option>
                <option value="EVALUATION_SOMMATIVE">🔒 Éval. sommative</option>
                <option value="RESSOURCE_COMPLEMENTAIRE">📎 Complémentaire</option>
                <option value="QUIZ_POSITIONNEMENT">🎯 Quiz positionnement</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>URL d'accès</label>
            <input v-model="modale.form.urlAcces" type="url" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label>🏷️ Tags</label>
            <div class="tags-picker">
              <button
                v-for="tag in tags"
                :key="tag.id"
                type="button"
                class="tag-option"
                :class="{ active: modale.form.tagIds.includes(tag.id) }"
                @click="toggleTagModale(tag.id)"
              >#{{ tag.libelle }}</button>
            </div>
          </div>

          <div class="form-group">
            <label>Objectifs pédagogiques</label>
            <textarea v-model="modale.form.objectifsPedagogiques" rows="2"></textarea>
          </div>

          <div class="form-group">
            <label>Auteur / Partenaire</label>
            <input v-model="modale.form.auteurPartenaire" type="text" />
          </div>
        </div>

        <div v-if="modale.erreur" class="modal-error">⚠️ {{ modale.erreur }}</div>

        <div class="modal-footer">
          <button class="btn-annuler" @click="fermerModale">Annuler</button>
          <button class="btn-sauvegarder" @click="sauvegarderModification" :disabled="modale.saving">
            {{ modale.saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}
          </button>
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
const niveaux = ref([])
const thematiques = ref([])
const tags = ref([])

const modale = ref({
  ouverte: false,
  ressourceId: null,
  saving: false,
  erreur: '',
  form: {}
})

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user || user.role !== 'ADMINISTRATEUR_PEDAGOGIQUE') {
    router.push('/login')
    return
  }
  await Promise.all([chargerToutesRessources(), chargerOptions()])
})

const chargerOptions = async () => {
  try {
    const [n, t, tg] = await Promise.all([
      api.get('/api/niveaux'),
      api.get('/api/thematiques'),
      api.get('/api/tags')
    ])
    niveaux.value = n.data || []
    thematiques.value = t.data || []
    tags.value = tg.data || []
  } catch { /* silencieux */ }
}

const chargerToutesRessources = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const response = await api.get('/api/ressources/toutes')
    toutesRessources.value = response.data
  } catch {
    erreur.value = 'Erreur lors du chargement. Vérifiez votre connexion.'
  } finally {
    loading.value = false
  }
}

const ressourcesFiltrees = computed(() =>
  toutesRessources.value.filter(r => {
    const matchRecherche = !recherche.value ||
      r.titre?.toLowerCase().includes(recherche.value.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(recherche.value.toLowerCase()))
    const matchStatut = !filtreStatut.value || r.statut === filtreStatut.value
    return matchRecherche && matchStatut
  })
)

const enAttente = computed(() => toutesRessources.value.filter(r => r.statut === 'EN_ATTENTE'))
const compterStatut = (statut) => toutesRessources.value.filter(r => r.statut === statut).length

// ===== ACTIONS =====
const valider = async (id) => {
  actionEnCours.value = id
  try { await api.post(`/api/ressources/${id}/valider`); await chargerToutesRessources() }
  catch { alert('Erreur lors de la validation') }
  finally { actionEnCours.value = null }
}

const refuser = async (id) => {
  if (!confirm('Refuser cette ressource ?')) return
  actionEnCours.value = id
  try { await api.post(`/api/ressources/${id}/refuser`); await chargerToutesRessources() }
  catch { alert('Erreur lors du refus') }
  finally { actionEnCours.value = null }
}

const supprimer = async (id) => {
  if (!confirm('Supprimer définitivement cette ressource ?')) return
  actionEnCours.value = id
  try { await api.delete(`/api/ressources/${id}/supprimer`); await chargerToutesRessources() }
  catch { alert('Erreur lors de la suppression') }
  finally { actionEnCours.value = null }
}

// ===== MODALE MODIFICATION =====
const ouvrirModale = (r) => {
  modale.value = {
    ouverte: true,
    ressourceId: r.id,
    saving: false,
    erreur: '',
    form: {
      titre: r.titre || '',
      description: r.description || '',
      typeSupport: r.typeSupport || 'VIDEO',
      difficulte: r.difficulte || '',
      niveauId: r.niveauId ? String(r.niveauId) : '',
      thematiqueId: r.thematiqueId ? String(r.thematiqueId) : '',
      dureeMinutes: r.dureeMinutes || '',
      urlAcces: r.urlAcces || '',
      usagePedagogique: r.usagePedagogique || '',
      objectifsPedagogiques: r.objectifsPedagogiques || '',
      auteurPartenaire: r.auteurPartenaire || '',
      tagIds: tags.value.filter(t => r.tags?.includes(t.libelle)).map(t => t.id)
    }
  }
}

const fermerModale = () => { modale.value.ouverte = false }

const toggleTagModale = (tagId) => {
  const ids = modale.value.form.tagIds
  modale.value.form.tagIds = ids.includes(tagId)
    ? ids.filter(id => id !== tagId)
    : [...ids, tagId]
}

const sauvegarderModification = async () => {
  modale.value.saving = true
  modale.value.erreur = ''
  try {
    const f = modale.value.form
    const payload = {
      titre: f.titre,
      description: f.description,
      typeSupport: f.typeSupport,
      difficulte: f.difficulte || null,
      niveauId: f.niveauId ? Number(f.niveauId) : null,
      thematiqueId: f.thematiqueId ? Number(f.thematiqueId) : null,
      dureeMinutes: f.dureeMinutes ? Number(f.dureeMinutes) : null,
      urlAcces: f.urlAcces || null,
      usagePedagogique: f.usagePedagogique || null,
      objectifsPedagogiques: f.objectifsPedagogiques || null,
      auteurPartenaire: f.auteurPartenaire || null,
      tagIds: f.tagIds
    }
    await api.put(`/api/ressources/${modale.value.ressourceId}/modifier`, payload)
    fermerModale()
    await chargerToutesRessources()
  } catch (err) {
    modale.value.erreur = err.response?.data || 'Erreur lors de la sauvegarde.'
  } finally {
    modale.value.saving = false
  }
}

const iconeType = (type) => ({ VIDEO:'🎥',H5P:'🎮',PDF:'📄',QUIZ:'❓',HTML:'🌐',LIEN:'🔗',AUTRE:'📦' }[type] || '📦')
</script>

<style scoped>
.admin { max-width: 1000px; margin: 0 auto; padding: 20px; }
.admin-header { margin-bottom: 25px; }
.admin-header h1 { font-size: 1.8rem; color: #2c3e50; }
.admin-header p { color: #666; }

.tabs { display:flex;gap:5px;margin-bottom:25px;border-bottom:2px solid #dee2e6;padding-bottom:0; }
.tab { padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#666;border-bottom:3px solid transparent;margin-bottom:-2px;display:flex;align-items:center;gap:6px; }
.tab-active { color:#2c3e50;border-bottom-color:#2c3e50; }
.tab .badge { background:#120F34;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center; }

.loading { text-align:center;padding:50px; }
.spinner { width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #2c3e50;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px; }
@keyframes spin { to { transform:rotate(360deg); } }
.error { text-align:center;padding:30px;color:#dc3545; }
.empty { text-align:center;padding:50px;color:#27ae60;font-size:1.1rem; }

.filtres-admin { display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap; }
.input-search { flex:1;min-width:200px;padding:10px;border:2px solid #dee2e6;border-radius:8px;font-size:14px; }
.select-filtre { padding:10px;border:2px solid #dee2e6;border-radius:8px;font-size:14px;background:white; }

.stats-bar { display:flex;gap:15px;margin-bottom:20px;flex-wrap:wrap; }
.stat { padding:6px 14px;border-radius:20px;font-size:13px;font-weight:500; }
.stat-attente { background:#fff3cd;color:#856404; }
.stat-validee { background:#d4edda;color:#155724; }
.stat-refusee { background:#f8d7da;color:#721c24; }

.liste { display:flex;flex-direction:column;gap:15px; }
.ressource-card { background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;display:flex;justify-content:space-between;align-items:flex-start;gap:15px; }
.ressource-info { flex:1; }
.ressource-top { display:flex;align-items:center;gap:10px;margin-bottom:8px; }

.badge-type { padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;color:white; }
.badge-video{background:#e74c3c}.badge-h5p{background:#9b59b6}.badge-pdf{background:#e67e22}
.badge-quiz{background:#3498db}.badge-html{background:#27ae60}.badge-lien{background:#1abc9c}.badge-autre{background:#95a5a6}

.statut { padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold; }
.statut-en_attente{background:#fff3cd;color:#856404}.statut-validee{background:#d4edda;color:#155724}
.statut-refusee{background:#f8d7da;color:#721c24}.statut-archivee{background:#e2e3e5;color:#383d41}

.nomenclature { font-size:11px;color:#aaa;font-family:monospace; }
.ressource-info h3 { font-size:1rem;color:#2c3e50;margin-bottom:6px; }
.description { font-size:0.85rem;color:#666;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px; }
.meta { display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#888; }
.tags { display:flex;flex-wrap:wrap;gap:5px;margin-top:8px; }
.tag { background:#e8f4f8;color:#2980b9;padding:2px 8px;border-radius:10px;font-size:11px; }

.actions { display:flex;flex-direction:column;gap:8px;min-width:110px; }
.btn-voir,.btn-modifier,.btn-valider,.btn-refuser,.btn-supprimer {
  padding:7px 12px;border-radius:6px;cursor:pointer;font-size:12px;text-align:center;border:none;
}
.btn-voir { background:#f8f9fa;border:1px solid #dee2e6;text-decoration:none;color:#333; }
.btn-voir:hover { background:#e9ecef; }
.btn-modifier { background:#3498db;color:white; }
.btn-modifier:hover:not(:disabled) { background:#2980b9; }
.btn-valider { background:#27ae60;color:white; }
.btn-valider:hover:not(:disabled) { background:#229954; }
.btn-refuser { background:#e74c3c;color:white; }
.btn-refuser:hover:not(:disabled) { background:#c0392b; }
.btn-supprimer { background:#95a5a6;color:white; }
.btn-supprimer:hover:not(:disabled) { background:#7f8c8d; }
button:disabled { opacity:0.5;cursor:not-allowed; }

/* ===== MODALE ===== */
.modal-overlay {
  position:fixed;inset:0;background:rgba(0,0,0,0.55);
  display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;
}
.modal {
  background:white;border-radius:16px;width:100%;max-width:640px;
  max-height:90vh;display:flex;flex-direction:column;
  box-shadow:0 20px 60px rgba(0,0,0,0.3);
}
.modal-header {
  display:flex;justify-content:space-between;align-items:center;
  padding:20px 24px 16px;border-bottom:1px solid #dee2e6;
}
.modal-header h3 { margin:0;font-size:1.1rem; }
.modal-close { background:none;border:none;font-size:20px;cursor:pointer;color:#666;padding:4px; }
.modal-body { overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:14px;flex:1; }
.modal-footer { display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid #dee2e6; }
.modal-error { margin:0 24px;padding:10px 14px;background:#f8d7da;color:#721c24;border-radius:8px;font-size:13px; }

.form-group { display:flex;flex-direction:column;gap:6px; }
.form-group label { font-size:13px;font-weight:600;color:#334155; }
.form-group input,.form-group select,.form-group textarea {
  padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:8px;
  font:inherit;color:#0f172a;background:#f8fafc;
}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus {
  outline:none;border-color:#3498db;box-shadow:0 0 0 3px rgba(52,152,219,0.12);
}
.form-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }

.tags-picker { display:flex;flex-wrap:wrap;gap:6px; }
.tag-option {
  padding:4px 10px;border-radius:999px;border:1px solid #cbd5e1;
  background:#fff;color:#334155;cursor:pointer;font-size:12px;
}
.tag-option.active { background:#2980b9;border-color:#2980b9;color:white; }

.btn-annuler { padding:10px 18px;background:#e2e8f0;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
.btn-sauvegarder { padding:10px 20px;background:#3498db;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700; }
.btn-sauvegarder:hover:not(:disabled) { background:#2980b9; }
.btn-sauvegarder:disabled { opacity:0.5;cursor:not-allowed; }
</style>