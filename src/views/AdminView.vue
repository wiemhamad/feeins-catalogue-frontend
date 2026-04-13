<template>
  <div class="admin">

    <div class="admin-header">
      <h1>👑 Dashboard Administrateur</h1>
      <p>Gestion et validation des ressources pédagogiques</p>
    </div>

    <div class="tabs">
      <button :class="['tab', onglet === 'attente' ? 'tab-active' : '']" @click="onglet = 'attente'">
        ⏳ En attente <span class="badge" v-if="enAttente.length">{{ enAttente.length }}</span>
      </button>
      <button :class="['tab', onglet === 'toutes' ? 'tab-active' : '']" @click="onglet = 'toutes'">
        📋 Toutes les ressources
      </button>
      <button :class="['tab', onglet === 'referentiels' ? 'tab-active' : '']" @click="onglet = 'referentiels'; chargerReferentiels()">
        🗂️ Référentiels des filtres
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div><p>Chargement...</p>
    </div>
    <div v-else-if="erreur" class="error">⚠️ {{ erreur }}</div>

    <!-- EN ATTENTE -->
    <div v-else-if="onglet === 'attente'">
      <div v-if="enAttente.length === 0" class="empty">✅ Aucune ressource en attente</div>
      <div v-else class="liste">
        <div v-for="r in enAttente" :key="r.id" class="ressource-card">
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">{{ iconeType(r.typeSupport) }} {{ r.typeSupport }}</span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom">🎓 {{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom">📂 {{ r.thematiqueNom }}</span>
              <span v-if="r.dureeMinutes">⏱ {{ r.dureeMinutes }} min</span>
              <span v-if="r.contributeurNom">👤 {{ r.contributeurNom }}</span>
            </div>
            <div v-if="r.tags && r.tags.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">👁️ Voir</a>
            <button @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours === r.id">✅ Valider</button>
            <button @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours === r.id">❌ Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RÉFÉRENTIELS -->
    <div v-else-if="onglet === 'referentiels'" class="referentiels">
      <div class="ref-intro">
        <p>Gérez ici les filtres qui apparaissent dans le catalogue. Toute modification est immédiatement visible.</p>
      </div>
      <div class="ref-grid">

        <!-- TAGS -->
        <div class="ref-card">
          <div class="ref-card-header"><h3>🏷️ Tags</h3><span class="ref-count">{{ tags.length }}</span></div>
          <p class="ref-card-desc">Mots-clés filtrables dans le catalogue</p>
          <div class="ref-add-row">
            <input v-model="newTag" type="text" placeholder="Nouveau tag..." class="ref-input" @keyup.enter="ajouterTag" />
            <button @click="ajouterTag" class="ref-btn-add" :disabled="!newTag.trim()">+ Ajouter</button>
          </div>
          <div v-if="refMsg.tags" class="ref-msg" :class="refMsg.tags.type">{{ refMsg.tags.text }}</div>
          <div class="ref-list">
            <div v-for="tagItem in tags" :key="tagItem.id" class="ref-item">
              <div v-if="editTag && editTag.id === tagItem.id" class="ref-item-edit">
                <input v-model="editTag.libelle" class="ref-input-sm" @keyup.enter="sauvegarderTag" @keyup.escape="editTag = null" />
                <button @click="sauvegarderTag" class="ref-btn-save">💾</button>
                <button @click="editTag = null" class="ref-btn-cancel">✕</button>
              </div>
              <div v-else class="ref-item-view">
                <span class="ref-pill ref-pill-tag">#{{ tagItem.libelle }}</span>
                <div class="ref-item-actions">
                  <button @click="startEditTag(tagItem)" class="ref-btn-edit">✏️</button>
                  <button @click="supprimerTag(tagItem.id, tagItem.libelle)" class="ref-btn-del">🗑️</button>
                </div>
              </div>
            </div>
            <div v-if="tags.length === 0" class="ref-empty">Aucun tag</div>
          </div>
        </div>

        <!-- NIVEAUX -->
        <div class="ref-card">
          <div class="ref-card-header"><h3>🎓 Niveaux</h3><span class="ref-count">{{ niveaux.length }}</span></div>
          <p class="ref-card-desc">Niveaux académiques des apprenants</p>
          <div class="ref-add-row">
            <input v-model="newNiveau" type="text" placeholder="Nouveau niveau..." class="ref-input" @keyup.enter="ajouterNiveau" />
            <button @click="ajouterNiveau" class="ref-btn-add" :disabled="!newNiveau.trim()">+ Ajouter</button>
          </div>
          <div v-if="refMsg.niveaux" class="ref-msg" :class="refMsg.niveaux.type">{{ refMsg.niveaux.text }}</div>
          <div class="ref-list">
            <div v-for="n in niveaux" :key="n.id" class="ref-item">
              <div v-if="editNiveau && editNiveau.id === n.id" class="ref-item-edit">
                <input v-model="editNiveau.nom" class="ref-input-sm" @keyup.enter="sauvegarderNiveau" @keyup.escape="editNiveau = null" />
                <button @click="sauvegarderNiveau" class="ref-btn-save">💾</button>
                <button @click="editNiveau = null" class="ref-btn-cancel">✕</button>
              </div>
              <div v-else class="ref-item-view">
                <span class="ref-pill ref-pill-niveau">🎓 {{ n.nom }}</span>
                <div class="ref-item-actions">
                  <button @click="startEditNiveau(n)" class="ref-btn-edit">✏️</button>
                  <button @click="supprimerNiveau(n.id, n.nom)" class="ref-btn-del">🗑️</button>
                </div>
              </div>
            </div>
            <div v-if="niveaux.length === 0" class="ref-empty">Aucun niveau</div>
          </div>
        </div>

        <!-- THÉMATIQUES -->
        <div class="ref-card">
          <div class="ref-card-header"><h3>📂 Thématiques</h3><span class="ref-count">{{ thematiques.length }}</span></div>
          <p class="ref-card-desc">Domaines pédagogiques du catalogue</p>
          <div class="ref-add-row">
            <input v-model="newThematique" type="text" placeholder="Nouvelle thématique..." class="ref-input" @keyup.enter="ajouterThematique" />
            <button @click="ajouterThematique" class="ref-btn-add" :disabled="!newThematique.trim()">+ Ajouter</button>
          </div>
          <div v-if="refMsg.thematiques" class="ref-msg" :class="refMsg.thematiques.type">{{ refMsg.thematiques.text }}</div>
          <div class="ref-list">
            <div v-for="t in thematiques" :key="t.id" class="ref-item">
              <div v-if="editThematique && editThematique.id === t.id" class="ref-item-edit">
                <input v-model="editThematique.nom" class="ref-input-sm" @keyup.enter="sauvegarderThematique" @keyup.escape="editThematique = null" />
                <button @click="sauvegarderThematique" class="ref-btn-save">💾</button>
                <button @click="editThematique = null" class="ref-btn-cancel">✕</button>
              </div>
              <div v-else class="ref-item-view">
                <span class="ref-pill ref-pill-theme">📂 {{ t.nom }}</span>
                <div class="ref-item-actions">
                  <button @click="startEditThematique(t)" class="ref-btn-edit">✏️</button>
                  <button @click="supprimerThematique(t.id, t.nom)" class="ref-btn-del">🗑️</button>
                </div>
              </div>
            </div>
            <div v-if="thematiques.length === 0" class="ref-empty">Aucune thématique</div>
          </div>
        </div>

        <!-- TYPES DE CONTENU -->
        <div class="ref-card">
          <div class="ref-card-header"><h3>📦 Types de contenu</h3><span class="ref-count">{{ typesConfig.length }}</span></div>
          <p class="ref-card-desc">Activer/désactiver les types dans les filtres du catalogue</p>
          <div v-if="refMsg.types" class="ref-msg" :class="refMsg.types.type">{{ refMsg.types.text }}</div>
          <div class="ref-list">
            <div v-for="f in typesConfig" :key="f.id" class="ref-item">
              <div v-if="editFiltre && editFiltre.id === f.id" class="ref-item-edit">
                <input v-model="editFiltre.libelle" class="ref-input-sm" @keyup.enter="sauvegarderFiltre" @keyup.escape="editFiltre = null" />
                <button @click="sauvegarderFiltre" class="ref-btn-save">💾</button>
                <button @click="editFiltre = null" class="ref-btn-cancel">✕</button>
              </div>
              <div v-else class="ref-item-view">
                <span class="ref-pill" :class="f.actif ? 'ref-pill-type-on' : 'ref-pill-type-off'">{{ f.libelle }}</span>
                <div class="ref-item-actions">
                  <button @click="editFiltre = { id: f.id, libelle: f.libelle }" class="ref-btn-edit" title="Renommer">✏️</button>
                  <button @click="toggleFiltre(f)" class="ref-btn-toggle" :title="f.actif ? 'Désactiver' : 'Activer'">
                    {{ f.actif ? '✅' : '⬜' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DIFFICULTÉS -->
        <div class="ref-card">
          <div class="ref-card-header"><h3>📊 Difficultés</h3><span class="ref-count">{{ difficultesConfig.length }}</span></div>
          <p class="ref-card-desc">Activer/désactiver les niveaux de difficulté dans les filtres</p>
          <div v-if="refMsg.difficultes" class="ref-msg" :class="refMsg.difficultes.type">{{ refMsg.difficultes.text }}</div>
          <div class="ref-list">
            <div v-for="f in difficultesConfig" :key="f.id" class="ref-item">
              <div v-if="editFiltre && editFiltre.id === f.id" class="ref-item-edit">
                <input v-model="editFiltre.libelle" class="ref-input-sm" @keyup.enter="sauvegarderFiltre" @keyup.escape="editFiltre = null" />
                <button @click="sauvegarderFiltre" class="ref-btn-save">💾</button>
                <button @click="editFiltre = null" class="ref-btn-cancel">✕</button>
              </div>
              <div v-else class="ref-item-view">
                <span class="ref-pill" :class="f.actif ? 'ref-pill-diff-on' : 'ref-pill-diff-off'">{{ f.libelle }}</span>
                <div class="ref-item-actions">
                  <button @click="editFiltre = { id: f.id, libelle: f.libelle }" class="ref-btn-edit" title="Renommer">✏️</button>
                  <button @click="toggleFiltre(f)" class="ref-btn-toggle" :title="f.actif ? 'Désactiver' : 'Activer'">
                    {{ f.actif ? '✅' : '⬜' }}
                  </button>
                </div>
              </div>
            </div>
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
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">{{ iconeType(r.typeSupport) }} {{ r.typeSupport }}</span>
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
            <button v-if="r.statut === 'EN_ATTENTE' || r.statut === 'REFUSEE'" @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours === r.id">✅ Valider</button>
            <button v-if="r.statut === 'EN_ATTENTE' || r.statut === 'VALIDEE'" @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours === r.id">❌ Refuser</button>
            <button @click="supprimer(r.id)" class="btn-supprimer" :disabled="actionEnCours === r.id">🗑️</button>
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

// ===== RÉFÉRENTIELS =====
const tags = ref([])
const niveaux = ref([])
const thematiques = ref([])
const newTag = ref('')
const newNiveau = ref('')
const newThematique = ref('')
const editTag = ref(null)
const editNiveau = ref(null)
const editThematique = ref(null)
const refMsg = ref({ tags: null, niveaux: null, thematiques: null, types: null, difficultes: null })

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user || user.role !== 'ADMINISTRATEUR_PEDAGOGIQUE') { router.push('/login'); return }
  chargerToutesRessources()
})

const chargerToutesRessources = async () => {
  loading.value = true; erreur.value = ''
  try { toutesRessources.value = (await api.get('/api/ressources/toutes')).data }
  catch { erreur.value = 'Erreur lors du chargement.' }
  finally { loading.value = false }
}

const ressourcesFiltrees = computed(() =>
  toutesRessources.value.filter(r => {
    const matchR = !recherche.value || r.titre?.toLowerCase().includes(recherche.value.toLowerCase())
    const matchS = !filtreStatut.value || r.statut === filtreStatut.value
    return matchR && matchS
  })
)
const enAttente = computed(() => toutesRessources.value.filter(r => r.statut === 'EN_ATTENTE'))
const compterStatut = (s) => toutesRessources.value.filter(r => r.statut === s).length

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
  catch { alert('Erreur') }
  finally { actionEnCours.value = null }
}
const supprimer = async (id) => {
  if (!confirm('Supprimer définitivement ?')) return
  actionEnCours.value = id
  try { await api.delete(`/api/ressources/${id}/supprimer`); await chargerToutesRessources() }
  catch { alert('Erreur') }
  finally { actionEnCours.value = null }
}

const iconeType = (type) => ({ VIDEO:'🎥',H5P:'🎮',PDF:'📄',QUIZ:'❓',HTML:'🌐',LIEN:'🔗',AUTRE:'📦' }[type] || '📦')

// ===== RÉFÉRENTIELS CRUD =====
const chargerReferentiels = async () => {
  const [t, n, th] = await Promise.all([api.get('/api/tags'), api.get('/api/niveaux'), api.get('/api/thematiques')])
  tags.value = t.data || []; niveaux.value = n.data || []; thematiques.value = th.data || []
  await chargerFiltresConfig()
}

const setMsg = (key, type, text) => {
  refMsg.value[key] = { type, text }
  setTimeout(() => refMsg.value[key] = null, 3000)
}

// Edit starters (avoid spread in template)
const startEditTag = (tag) => { editTag.value = { id: tag.id, libelle: tag.libelle } }
const startEditNiveau = (n) => { editNiveau.value = { id: n.id, nom: n.nom } }
const startEditThematique = (t) => { editThematique.value = { id: t.id, nom: t.nom } }

// TAGS
const ajouterTag = async () => {
  if (!newTag.value.trim()) return
  try { await api.post('/api/tags', { libelle: newTag.value.trim().toLowerCase() }); newTag.value = ''; await chargerReferentiels(); setMsg('tags','success','Tag ajouté !') }
  catch (e) { setMsg('tags','error', e.response?.status === 409 ? 'Ce tag existe déjà.' : 'Erreur.') }
}
const sauvegarderTag = async () => {
  try { await api.put(`/api/tags/${editTag.value.id}`, { libelle: editTag.value.libelle }); editTag.value = null; await chargerReferentiels(); setMsg('tags','success','Tag modifié !') }
  catch { setMsg('tags','error','Erreur.') }
}
const supprimerTag = async (id, libelle) => {
  if (!confirm(`Supprimer le tag "#${libelle}" ?`)) return
  try { await api.delete(`/api/tags/${id}`); await chargerReferentiels(); setMsg('tags','success','Tag supprimé.') }
  catch { setMsg('tags','error','Erreur.') }
}

// NIVEAUX
const ajouterNiveau = async () => {
  if (!newNiveau.value.trim()) return
  try { await api.post('/api/niveaux', { nom: newNiveau.value.trim() }); newNiveau.value = ''; await chargerReferentiels(); setMsg('niveaux','success','Niveau ajouté !') }
  catch { setMsg('niveaux','error','Erreur.') }
}
const sauvegarderNiveau = async () => {
  try { await api.put(`/api/niveaux/${editNiveau.value.id}`, { nom: editNiveau.value.nom }); editNiveau.value = null; await chargerReferentiels(); setMsg('niveaux','success','Niveau modifié !') }
  catch { setMsg('niveaux','error','Erreur.') }
}
const supprimerNiveau = async (id, nom) => {
  if (!confirm(`Supprimer le niveau "${nom}" ?`)) return
  try { await api.delete(`/api/niveaux/${id}`); await chargerReferentiels(); setMsg('niveaux','success','Niveau supprimé.') }
  catch { setMsg('niveaux','error','Erreur.') }
}

// FILTRES CONFIG (types et difficultés)
const typesConfig = ref([])
const difficultesConfig = ref([])
const editFiltre = ref(null)

const chargerFiltresConfig = async () => {
  const [t, d] = await Promise.all([
    api.get('/api/filtres-config/TYPE_SUPPORT'),
    api.get('/api/filtres-config/DIFFICULTE')
  ])
  typesConfig.value = t.data || []
  difficultesConfig.value = d.data || []
}

const toggleFiltre = async (f) => {
  try {
    const { data } = await api.patch(`/api/filtres-config/${f.id}/toggle`)
    f.actif = data.actif
    const cat = f.categorie === 'TYPE_SUPPORT' ? 'types' : 'difficultes'
    setMsg(cat, 'success', f.actif ? `✅ "${f.libelle}" activé` : `⬜ "${f.libelle}" désactivé`)
  } catch { setMsg('types', 'error', 'Erreur.') }
}

const sauvegarderFiltre = async () => {
  try {
    await api.put(`/api/filtres-config/${editFiltre.value.id}`, { libelle: editFiltre.value.libelle })
    editFiltre.value = null; await chargerFiltresConfig()
    setMsg('types', 'success', 'Libellé modifié !')
  } catch { setMsg('types', 'error', 'Erreur.') }
}

// THÉMATIQUES
const ajouterThematique = async () => {
  if (!newThematique.value.trim()) return
  try { await api.post('/api/thematiques', { nom: newThematique.value.trim() }); newThematique.value = ''; await chargerReferentiels(); setMsg('thematiques','success','Thématique ajoutée !') }
  catch (e) { setMsg('thematiques','error', e.response?.status === 409 ? 'Existe déjà.' : 'Erreur.') }
}
const sauvegarderThematique = async () => {
  try { await api.put(`/api/thematiques/${editThematique.value.id}`, { nom: editThematique.value.nom }); editThematique.value = null; await chargerReferentiels(); setMsg('thematiques','success','Thématique modifiée !') }
  catch { setMsg('thematiques','error','Erreur.') }
}
const supprimerThematique = async (id, nom) => {
  if (!confirm(`Supprimer la thématique "${nom}" ?`)) return
  try { await api.delete(`/api/thematiques/${id}`); await chargerReferentiels(); setMsg('thematiques','success','Thématique supprimée.') }
  catch { setMsg('thematiques','error','Erreur.') }
}
</script>

<style scoped>
.admin { max-width: 1000px; margin: 0 auto; padding: 20px; }
.admin-header { margin-bottom: 25px; }
.admin-header h1 { font-size: 1.8rem; color: #2c3e50; }
.admin-header p { color: #666; }
.tabs { display:flex;gap:5px;margin-bottom:25px;border-bottom:2px solid #dee2e6; }
.tab { padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#666;border-bottom:3px solid transparent;margin-bottom:-2px;display:flex;align-items:center;gap:6px;font-family:inherit; }
.tab-active { color:#2c3e50;border-bottom-color:#2c3e50; }
.tab .badge { background:#e74c3c;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center; }
.loading { text-align:center;padding:50px; }
.spinner { width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #2c3e50;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px; }
@keyframes spin { to { transform:rotate(360deg); } }
.error,.empty { text-align:center;padding:30px;color:#666; }
.filtres-admin { display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap; }
.input-search { flex:1;min-width:200px;padding:10px;border:2px solid #dee2e6;border-radius:8px;font-size:14px; }
.select-filtre { padding:10px;border:2px solid #dee2e6;border-radius:8px;font-size:14px;background:white; }
.stats-bar { display:flex;gap:15px;margin-bottom:20px; }
.stat { padding:6px 14px;border-radius:20px;font-size:13px;font-weight:500; }
.stat-attente{background:#fff3cd;color:#856404}.stat-validee{background:#d4edda;color:#155724}.stat-refusee{background:#f8d7da;color:#721c24}
.liste { display:flex;flex-direction:column;gap:15px; }
.ressource-card { background:white;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:20px;display:flex;justify-content:space-between;align-items:flex-start;gap:15px; }
.ressource-info { flex:1; }
.ressource-top { display:flex;align-items:center;gap:10px;margin-bottom:8px; }
.badge-type { padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;color:white; }
.badge-video{background:#e74c3c}.badge-h5p{background:#9b59b6}.badge-pdf{background:#e67e22}.badge-quiz{background:#3498db}.badge-html{background:#27ae60}.badge-lien{background:#1abc9c}.badge-autre{background:#95a5a6}
.statut { padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold; }
.statut-en_attente{background:#fff3cd;color:#856404}.statut-validee{background:#d4edda;color:#155724}.statut-refusee{background:#f8d7da;color:#721c24}
.nomenclature { font-size:11px;color:#aaa;font-family:monospace; }
.ressource-info h3 { font-size:1rem;color:#2c3e50;margin-bottom:6px; }
.description { font-size:0.85rem;color:#666;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px; }
.meta { display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#888; }
.tags { display:flex;flex-wrap:wrap;gap:5px;margin-top:8px; }
.tag { background:#e8f4f8;color:#2980b9;padding:2px 8px;border-radius:10px;font-size:11px; }
.actions { display:flex;flex-direction:column;gap:8px;min-width:100px; }
.btn-voir,.btn-valider,.btn-refuser,.btn-supprimer { padding:7px 12px;border-radius:6px;cursor:pointer;font-size:12px;border:none;text-align:center;font-family:inherit; }
.btn-voir { background:#f8f9fa;border:1px solid #dee2e6;text-decoration:none;color:#333; }
.btn-valider { background:#27ae60;color:white; }
.btn-refuser { background:#e74c3c;color:white; }
.btn-supprimer { background:#95a5a6;color:white; }
button:disabled { opacity:0.5;cursor:not-allowed; }

/* RÉFÉRENTIELS */
.referentiels { padding:10px 0; }
.ref-intro { margin-bottom:20px;padding:14px 18px;background:#f0f4ff;border-radius:10px;border-left:4px solid #6366f1; }
.ref-intro p { margin:0;font-size:13px;color:#4338ca; }
.ref-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px; }
.ref-card { background:white;border-radius:16px;border:1px solid #e5e7eb;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05); }
.ref-card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:4px; }
.ref-card-header h3 { margin:0;font-size:1rem;font-weight:700; }
.ref-count { background:#f3f4f6;color:#6b7280;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:600; }
.ref-card-desc { font-size:12px;color:#9ca3af;margin:0 0 14px; }
.ref-add-row { display:flex;gap:8px;margin-bottom:10px; }
.ref-input { flex:1;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font:inherit;font-size:13px; }
.ref-input:focus { outline:none;border-color:#6366f1; }
.ref-btn-add { padding:9px 16px;background:#6366f1;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;font-family:inherit; }
.ref-btn-add:disabled { opacity:0.4;cursor:not-allowed; }
.ref-msg { padding:7px 12px;border-radius:8px;font-size:12px;font-weight:600;margin-bottom:8px; }
.ref-msg.success { background:#dcfce7;color:#166534; }
.ref-msg.error { background:#fee2e2;color:#991b1b; }
.ref-list { display:flex;flex-direction:column;gap:6px;max-height:320px;overflow-y:auto; }
.ref-item { border-radius:10px;background:#f9fafb;border:1px solid #f3f4f6; }
.ref-item-view { display:flex;justify-content:space-between;align-items:center;padding:9px 12px;gap:8px;min-width:0; }
.ref-item-edit { display:flex;align-items:center;gap:6px;padding:6px 10px; }
.ref-pill { padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.ref-pill-tag { background:#ede9fe;color:#6d28d9; }
.ref-pill-niveau { background:#dbeafe;color:#1d4ed8; }
.ref-pill-theme { background:#fce7f3;color:#9d174d; }
.ref-item-actions { display:flex;gap:4px;flex-shrink:0; }
.ref-btn-edit,.ref-btn-del,.ref-btn-save,.ref-btn-cancel { padding:5px 8px;border:none;border-radius:7px;cursor:pointer;font-size:12px;font-family:inherit; }
.ref-btn-edit { background:#f3f4f6;color:#374151; }
.ref-btn-del { background:#fee2e2;color:#dc2626; }
.ref-btn-save { background:#dcfce7;color:#166534; }
.ref-btn-cancel { background:#f3f4f6;color:#6b7280; }
.ref-input-sm { flex:1;padding:6px 10px;border:1.5px solid #6366f1;border-radius:8px;font:inherit;font-size:13px; }
.ref-empty { text-align:center;color:#9ca3af;font-size:13px;padding:16px; }
.ref-pill-type-on { background:#dbeafe;color:#1e40af; }
.ref-pill-type-off { background:#f3f4f6;color:#9ca3af;text-decoration:line-through; }
.ref-pill-diff-on { background:#fef9c3;color:#713f12; }
.ref-pill-diff-off { background:#f3f4f6;color:#9ca3af;text-decoration:line-through; }
.ref-btn-toggle { padding:5px 8px;border:none;border-radius:7px;cursor:pointer;font-size:14px;background:#f3f4f6; }
.ref-btn-toggle:hover { background:#e5e7eb; }
</style>