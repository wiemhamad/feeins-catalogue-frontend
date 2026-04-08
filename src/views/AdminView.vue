<template>
  <div class="admin">

    <div class="admin-header">
      <h1>👑 Dashboard Administrateur</h1>
      <p>Gestion et validation des ressources pédagogiques</p>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button :class="['tab', onglet === 'attente' ? 'tab-active' : '']" @click="onglet = 'attente'">
        ⏳ En attente
        <span class="badge" v-if="enAttente.length">{{ enAttente.length }}</span>
      </button>
      <button :class="['tab', onglet === 'toutes' ? 'tab-active' : '']" @click="onglet = 'toutes'">
        📋 Toutes les ressources
      </button>
      <button :class="['tab', onglet === 'referentiels' ? 'tab-active' : '']" @click="onglet = 'referentiels'">
        🗂️ Référentiels
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div><p>Chargement...</p>
    </div>
    <div v-else-if="erreur" class="error">⚠️ {{ erreur }}</div>

    <!-- ===== EN ATTENTE ===== -->
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
            <div v-if="r.tags?.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">👁️ Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier">✏️ Modifier</button>
            <button @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours===r.id">✅ Valider</button>
            <button @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours===r.id">❌ Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TOUTES LES RESSOURCES ===== -->
    <div v-else-if="onglet === 'toutes'">
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
            <div v-if="r.tags?.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">👁️ Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier">✏️ Modifier</button>
            <button v-if="r.statut==='EN_ATTENTE'||r.statut==='REFUSEE'" @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours===r.id">✅ Valider</button>
            <button v-if="r.statut==='EN_ATTENTE'||r.statut==='VALIDEE'" @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours===r.id">❌ Refuser</button>
            <button @click="supprimer(r.id)" class="btn-supprimer" :disabled="actionEnCours===r.id">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== RÉFÉRENTIELS ===== -->
    <div v-else-if="onglet === 'referentiels'" class="referentiels">

      <!-- SOUS-ONGLETS -->
      <div class="ref-tabs">
        <button :class="['ref-tab', refOnglet==='tags' ? 'ref-tab-active' : '']" @click="refOnglet='tags'">🏷️ Tags</button>
        <button :class="['ref-tab', refOnglet==='niveaux' ? 'ref-tab-active' : '']" @click="refOnglet='niveaux'">🎓 Niveaux</button>
        <button :class="['ref-tab', refOnglet==='thematiques' ? 'ref-tab-active' : '']" @click="refOnglet='thematiques'">📂 Thématiques</button>
      </div>

      <!-- TAGS -->
      <div v-if="refOnglet==='tags'" class="ref-section">
        <div class="ref-header">
          <h3>🏷️ Gestion des tags</h3>
          <p>Les tags permettent aux utilisateurs de retrouver les ressources par mot-clé.</p>
        </div>
        <div class="ref-add">
          <input v-model="newTag" type="text" placeholder="Nouveau tag (ex: rgpd, ia-sante...)" class="ref-input" @keyup.enter="ajouterTag" />
          <button @click="ajouterTag" class="ref-btn-add" :disabled="!newTag.trim()">+ Ajouter</button>
        </div>
        <div v-if="refMsg.tags" class="ref-msg" :class="refMsg.tags.type">{{ refMsg.tags.text }}</div>
        <div class="ref-list">
          <div v-for="tag in tags" :key="tag.id" class="ref-item">
            <div v-if="editTag?.id === tag.id" class="ref-edit">
              <input v-model="editTag.libelle" class="ref-input-inline" @keyup.enter="sauvegarderTag" />
              <button @click="sauvegarderTag" class="ref-btn-save">💾</button>
              <button @click="editTag=null" class="ref-btn-cancel">✕</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-tag-pill">#{{ tag.libelle }}</span>
              <div class="ref-item-actions">
                <button @click="editTag={...tag}" class="ref-btn-edit">✏️</button>
                <button @click="supprimerTag(tag.id)" class="ref-btn-del">🗑️</button>
              </div>
            </div>
          </div>
          <div v-if="tags.length===0" class="ref-empty">Aucun tag. Ajoutez-en un.</div>
        </div>
      </div>

      <!-- NIVEAUX -->
      <div v-else-if="refOnglet==='niveaux'" class="ref-section">
        <div class="ref-header">
          <h3>🎓 Gestion des niveaux</h3>
          <p>Les niveaux ciblent les apprenants (L3, Master, Débutant...).</p>
        </div>
        <div class="ref-add">
          <input v-model="newNiveau" type="text" placeholder="Nouveau niveau (ex: L3, Master...)" class="ref-input" @keyup.enter="ajouterNiveau" />
          <button @click="ajouterNiveau" class="ref-btn-add" :disabled="!newNiveau.trim()">+ Ajouter</button>
        </div>
        <div v-if="refMsg.niveaux" class="ref-msg" :class="refMsg.niveaux.type">{{ refMsg.niveaux.text }}</div>
        <div class="ref-list">
          <div v-for="niv in niveaux" :key="niv.id" class="ref-item">
            <div v-if="editNiveau?.id === niv.id" class="ref-edit">
              <input v-model="editNiveau.nom" class="ref-input-inline" @keyup.enter="sauvegarderNiveau" />
              <button @click="sauvegarderNiveau" class="ref-btn-save">💾</button>
              <button @click="editNiveau=null" class="ref-btn-cancel">✕</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-niveau-pill">🎓 {{ niv.nom }}</span>
              <div class="ref-item-actions">
                <button @click="editNiveau={...niv}" class="ref-btn-edit">✏️</button>
                <button @click="supprimerNiveau(niv.id)" class="ref-btn-del">🗑️</button>
              </div>
            </div>
          </div>
          <div v-if="niveaux.length===0" class="ref-empty">Aucun niveau.</div>
        </div>
      </div>

      <!-- THÉMATIQUES -->
      <div v-else-if="refOnglet==='thematiques'" class="ref-section">
        <div class="ref-header">
          <h3>📂 Gestion des thématiques</h3>
          <p>Les thématiques organisent les ressources par domaine (SIS, IA, RGPD...).</p>
        </div>
        <div class="ref-add">
          <input v-model="newThematique" type="text" placeholder="Nouvelle thématique..." class="ref-input" @keyup.enter="ajouterThematique" />
          <button @click="ajouterThematique" class="ref-btn-add" :disabled="!newThematique.trim()">+ Ajouter</button>
        </div>
        <div v-if="refMsg.thematiques" class="ref-msg" :class="refMsg.thematiques.type">{{ refMsg.thematiques.text }}</div>
        <div class="ref-list">
          <div v-for="th in thematiques" :key="th.id" class="ref-item">
            <div v-if="editThematique?.id === th.id" class="ref-edit">
              <input v-model="editThematique.nom" class="ref-input-inline" @keyup.enter="sauvegarderThematique" />
              <button @click="sauvegarderThematique" class="ref-btn-save">💾</button>
              <button @click="editThematique=null" class="ref-btn-cancel">✕</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-theme-pill">📂 {{ th.nom }}</span>
              <div class="ref-item-actions">
                <button @click="editThematique={...th}" class="ref-btn-edit">✏️</button>
                <button @click="supprimerThematique(th.id)" class="ref-btn-del">🗑️</button>
              </div>
            </div>
          </div>
          <div v-if="thematiques.length===0" class="ref-empty">Aucune thématique.</div>
        </div>
      </div>
    </div>

    <!-- MODALE MODIFIER RESSOURCE -->
    <div v-if="modale.ouverte" class="modal-overlay" @click.self="fermerModale">
      <div class="modal">
        <div class="modal-header">
          <h3>✏️ Modifier la ressource</h3>
          <button class="modal-close" @click="fermerModale">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label>Titre *</label><input v-model="modale.form.titre" type="text" required /></div>
          <div class="form-group"><label>Description</label><textarea v-model="modale.form.description" rows="3"></textarea></div>
          <div class="form-row">
            <div class="form-group">
              <label>Type de support</label>
              <select v-model="modale.form.typeSupport">
                <option value="VIDEO">🎥 Vidéo</option><option value="H5P">🎮 H5P</option>
                <option value="PDF">📄 PDF</option><option value="QUIZ">❓ Quiz</option>
                <option value="HTML">🌐 HTML</option><option value="LIEN">🔗 Lien</option><option value="AUTRE">📦 Autre</option>
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
            <div class="form-group"><label>Durée (min)</label><input v-model.number="modale.form.dureeMinutes" type="number" min="1" /></div>
            <div class="form-group">
              <label>Usage pédagogique</label>
              <select v-model="modale.form.usagePedagogique">
                <option value="">Non précisé</option>
                <option value="COURS">📖 Cours</option><option value="ACTIVITE">✏️ Activité</option>
                <option value="EVALUATION_FORMATIVE">✅ Éval. formative</option>
                <option value="EVALUATION_SOMMATIVE">🔒 Éval. sommative</option>
                <option value="RESSOURCE_COMPLEMENTAIRE">📎 Complémentaire</option>
                <option value="QUIZ_POSITIONNEMENT">🎯 Quiz positionnement</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>URL d'accès</label><input v-model="modale.form.urlAcces" type="url" /></div>
          <div class="form-group">
            <label>🏷️ Tags</label>
            <div class="tags-picker">
              <button v-for="tag in tags" :key="tag.id" type="button" class="tag-option"
                :class="{ active: modale.form.tagIds.includes(tag.id) }"
                @click="toggleTagModale(tag.id)">#{{ tag.libelle }}</button>
            </div>
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
const refOnglet = ref('tags')
const recherche = ref('')
const filtreStatut = ref('')
const actionEnCours = ref(null)
const toutesRessources = ref([])

// Référentiels
const tags = ref([])
const niveaux = ref([])
const thematiques = ref([])
const newTag = ref('')
const newNiveau = ref('')
const newThematique = ref('')
const editTag = ref(null)
const editNiveau = ref(null)
const editThematique = ref(null)
const refMsg = ref({ tags: null, niveaux: null, thematiques: null })

const modale = ref({ ouverte: false, ressourceId: null, saving: false, erreur: '', form: {} })

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user || user.role !== 'ADMINISTRATEUR_PEDAGOGIQUE') { router.push('/login'); return }
  await Promise.all([chargerToutesRessources(), chargerReferentiels()])
})

const chargerReferentiels = async () => {
  const [t, n, th] = await Promise.all([
    api.get('/api/tags'), api.get('/api/niveaux'), api.get('/api/thematiques')
  ])
  tags.value = t.data || []
  niveaux.value = n.data || []
  thematiques.value = th.data || []
}

const chargerToutesRessources = async () => {
  loading.value = true; erreur.value = ''
  try { toutesRessources.value = (await api.get('/api/ressources/toutes')).data }
  catch { erreur.value = 'Erreur lors du chargement.' }
  finally { loading.value = false }
}

const ressourcesFiltrees = computed(() =>
  toutesRessources.value.filter(r => {
    const q = recherche.value.toLowerCase()
    return (!q || r.titre?.toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q)))
        && (!filtreStatut.value || r.statut === filtreStatut.value)
  })
)
const enAttente = computed(() => toutesRessources.value.filter(r => r.statut === 'EN_ATTENTE'))
const compterStatut = (s) => toutesRessources.value.filter(r => r.statut === s).length

// ===== ACTIONS RESSOURCES =====
const valider = async (id) => { actionEnCours.value=id; try { await api.post(`/api/ressources/${id}/valider`); await chargerToutesRessources() } catch { alert('Erreur') } finally { actionEnCours.value=null } }
const refuser = async (id) => { if(!confirm('Refuser ?')) return; actionEnCours.value=id; try { await api.post(`/api/ressources/${id}/refuser`); await chargerToutesRessources() } catch { alert('Erreur') } finally { actionEnCours.value=null } }
const supprimer = async (id) => { if(!confirm('Supprimer définitivement ?')) return; actionEnCours.value=id; try { await api.delete(`/api/ressources/${id}/supprimer`); await chargerToutesRessources() } catch { alert('Erreur') } finally { actionEnCours.value=null } }

// ===== MODALE =====
const ouvrirModale = (r) => {
  modale.value = { ouverte:true, ressourceId:r.id, saving:false, erreur:'', form: {
    titre:r.titre||'', description:r.description||'', typeSupport:r.typeSupport||'VIDEO',
    difficulte:r.difficulte||'', niveauId:r.niveauId?String(r.niveauId):'',
    thematiqueId:r.thematiqueId?String(r.thematiqueId):'', dureeMinutes:r.dureeMinutes||'',
    urlAcces:r.urlAcces||'', usagePedagogique:r.usagePedagogique||'',
    tagIds: tags.value.filter(t => r.tags?.includes(t.libelle)).map(t => t.id)
  }}
}
const fermerModale = () => { modale.value.ouverte = false }
const toggleTagModale = (tagId) => {
  const ids = modale.value.form.tagIds
  modale.value.form.tagIds = ids.includes(tagId) ? ids.filter(i=>i!==tagId) : [...ids, tagId]
}
const sauvegarderModification = async () => {
  modale.value.saving=true; modale.value.erreur=''
  try {
    const f = modale.value.form
    await api.put(`/api/ressources/${modale.value.ressourceId}/modifier`, {
      titre:f.titre, description:f.description, typeSupport:f.typeSupport,
      difficulte:f.difficulte||null, niveauId:f.niveauId?Number(f.niveauId):null,
      thematiqueId:f.thematiqueId?Number(f.thematiqueId):null,
      dureeMinutes:f.dureeMinutes?Number(f.dureeMinutes):null,
      urlAcces:f.urlAcces||null, usagePedagogique:f.usagePedagogique||null,
      tagIds:f.tagIds
    })
    fermerModale(); await chargerToutesRessources()
  } catch(e) { modale.value.erreur = e.response?.data || 'Erreur.' }
  finally { modale.value.saving=false }
}

// ===== TAGS =====
const setRefMsg = (key, type, text) => { refMsg.value[key]={type,text}; setTimeout(()=>refMsg.value[key]=null,3000) }
const ajouterTag = async () => {
  if (!newTag.value.trim()) return
  try { await api.post('/api/tags', { libelle: newTag.value.trim().toLowerCase() }); newTag.value=''; await chargerReferentiels(); setRefMsg('tags','success','Tag ajouté !') }
  catch(e) { setRefMsg('tags','error', e.response?.status===409 ? 'Ce tag existe déjà.' : 'Erreur.') }
}
const sauvegarderTag = async () => {
  try { await api.put(`/api/tags/${editTag.value.id}`, { libelle: editTag.value.libelle }); editTag.value=null; await chargerReferentiels(); setRefMsg('tags','success','Tag modifié !') }
  catch { setRefMsg('tags','error','Erreur.') }
}
const supprimerTag = async (id) => {
  if (!confirm('Supprimer ce tag ? Les ressources l\'utilisant perdront ce tag.')) return
  try { await api.delete(`/api/tags/${id}`); await chargerReferentiels(); setRefMsg('tags','success','Tag supprimé.') }
  catch { setRefMsg('tags','error','Erreur.') }
}

// ===== NIVEAUX =====
const ajouterNiveau = async () => {
  if (!newNiveau.value.trim()) return
  try { await api.post('/api/niveaux', { nom: newNiveau.value.trim() }); newNiveau.value=''; await chargerReferentiels(); setRefMsg('niveaux','success','Niveau ajouté !') }
  catch { setRefMsg('niveaux','error','Erreur.') }
}
const sauvegarderNiveau = async () => {
  try { await api.put(`/api/niveaux/${editNiveau.value.id}`, { nom: editNiveau.value.nom }); editNiveau.value=null; await chargerReferentiels(); setRefMsg('niveaux','success','Niveau modifié !') }
  catch { setRefMsg('niveaux','error','Erreur.') }
}
const supprimerNiveau = async (id) => {
  if (!confirm('Supprimer ce niveau ?')) return
  try { await api.delete(`/api/niveaux/${id}`); await chargerReferentiels(); setRefMsg('niveaux','success','Niveau supprimé.') }
  catch { setRefMsg('niveaux','error','Erreur.') }
}

// ===== THÉMATIQUES =====
const ajouterThematique = async () => {
  if (!newThematique.value.trim()) return
  try { await api.post('/api/thematiques', { nom: newThematique.value.trim() }); newThematique.value=''; await chargerReferentiels(); setRefMsg('thematiques','success','Thématique ajoutée !') }
  catch(e) { setRefMsg('thematiques','error', e.response?.status===409 ? 'Existe déjà.' : 'Erreur.') }
}
const sauvegarderThematique = async () => {
  try { await api.put(`/api/thematiques/${editThematique.value.id}`, { nom: editThematique.value.nom }); editThematique.value=null; await chargerReferentiels(); setRefMsg('thematiques','success','Thématique modifiée !') }
  catch { setRefMsg('thematiques','error','Erreur.') }
}
const supprimerThematique = async (id) => {
  if (!confirm('Supprimer cette thématique ?')) return
  try { await api.delete(`/api/thematiques/${id}`); await chargerReferentiels(); setRefMsg('thematiques','success','Thématique supprimée.') }
  catch { setRefMsg('thematiques','error','Erreur.') }
}

const iconeType = (t) => ({VIDEO:'🎥',H5P:'🎮',PDF:'📄',QUIZ:'❓',HTML:'🌐',LIEN:'🔗',AUTRE:'📦'}[t]||'📦')
</script>

<style scoped>
.admin { max-width: 1000px; margin: 0 auto; padding: 20px; }
.admin-header { margin-bottom: 25px; }
.admin-header h1 { font-size: 1.8rem; color: #2c3e50; }
.admin-header p { color: #666; }

.tabs { display:flex;gap:5px;margin-bottom:25px;border-bottom:2px solid #dee2e6; }
.tab { padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;color:#666;border-bottom:3px solid transparent;margin-bottom:-2px;display:flex;align-items:center;gap:6px; }
.tab-active { color:#2c3e50;border-bottom-color:#2c3e50; }
.tab .badge { background:#e74c3c;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center; }

.loading { text-align:center;padding:50px; }
.spinner { width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #2c3e50;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px; }
@keyframes spin { to { transform:rotate(360deg); } }
.error { text-align:center;padding:30px;color:#dc3545; }
.empty { text-align:center;padding:50px;color:#27ae60; }

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
.badge-video{background:#e74c3c}.badge-h5p{background:#9b59b6}.badge-pdf{background:#e67e22}
.badge-quiz{background:#3498db}.badge-html{background:#27ae60}.badge-lien{background:#1abc9c}.badge-autre{background:#95a5a6}
.statut { padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold; }
.statut-en_attente{background:#fff3cd;color:#856404}.statut-validee{background:#d4edda;color:#155724}.statut-refusee{background:#f8d7da;color:#721c24}
.nomenclature { font-size:11px;color:#aaa;font-family:monospace; }
.ressource-info h3 { font-size:1rem;color:#2c3e50;margin-bottom:6px; }
.description { font-size:0.85rem;color:#666;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px; }
.meta { display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#888; }
.tags { display:flex;flex-wrap:wrap;gap:5px;margin-top:8px; }
.tag { background:#e8f4f8;color:#2980b9;padding:2px 8px;border-radius:10px;font-size:11px; }

.actions { display:flex;flex-direction:column;gap:8px;min-width:110px; }
.btn-voir,.btn-modifier,.btn-valider,.btn-refuser,.btn-supprimer { padding:7px 12px;border-radius:6px;cursor:pointer;font-size:12px;border:none;text-align:center; }
.btn-voir { background:#f8f9fa;border:1px solid #dee2e6;text-decoration:none;color:#333; }
.btn-modifier { background:#3498db;color:white; }
.btn-valider { background:#27ae60;color:white; }
.btn-refuser { background:#e74c3c;color:white; }
.btn-supprimer { background:#95a5a6;color:white; }
button:disabled { opacity:0.5;cursor:not-allowed; }

/* ===== RÉFÉRENTIELS ===== */
.referentiels { padding: 10px 0; }
.ref-tabs { display:flex;gap:8px;margin-bottom:24px; }
.ref-tab { padding:9px 20px;border-radius:999px;border:1.5px solid #dee2e6;background:white;cursor:pointer;font-size:13px;font-weight:600;color:#555;transition:all 0.2s; }
.ref-tab-active { background:#2c3e50;color:white;border-color:#2c3e50; }
.ref-section { background:white;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.07);padding:24px; }
.ref-header { margin-bottom:20px; }
.ref-header h3 { font-size:1.1rem;margin:0 0 4px; }
.ref-header p { font-size:13px;color:#888;margin:0; }
.ref-add { display:flex;gap:10px;margin-bottom:12px; }
.ref-input { flex:1;padding:10px 14px;border:1.5px solid #dee2e6;border-radius:10px;font-size:14px;font-family:inherit; }
.ref-input:focus { outline:none;border-color:#3498db; }
.ref-btn-add { padding:10px 20px;background:#27ae60;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;white-space:nowrap; }
.ref-btn-add:disabled { opacity:0.4;cursor:not-allowed; }
.ref-msg { padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:10px; }
.ref-msg.success { background:#d4edda;color:#155724; }
.ref-msg.error { background:#f8d7da;color:#721c24; }
.ref-list { display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto; }
.ref-item { border:1px solid #f0f0f0;border-radius:10px;padding:10px 14px;background:#fafafa; }
.ref-item-content { display:flex;justify-content:space-between;align-items:center;gap:10px; }
.ref-tag-pill { background:#e8f4f8;color:#2980b9;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600; }
.ref-niveau-pill { background:#e8f8e8;color:#27ae60;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600; }
.ref-theme-pill { background:#f5eef8;color:#8e44ad;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600; }
.ref-item-actions { display:flex;gap:6px; }
.ref-btn-edit,.ref-btn-del,.ref-btn-save,.ref-btn-cancel { padding:5px 10px;border:none;border-radius:7px;cursor:pointer;font-size:12px; }
.ref-btn-edit { background:#e9f0f7;color:#3498db; }
.ref-btn-del { background:#fde8e8;color:#e74c3c; }
.ref-btn-save { background:#27ae60;color:white; }
.ref-btn-cancel { background:#dee2e6;color:#555; }
.ref-edit { display:flex;align-items:center;gap:8px; }
.ref-input-inline { flex:1;padding:7px 12px;border:1.5px solid #3498db;border-radius:8px;font-size:13px;font-family:inherit; }
.ref-empty { text-align:center;color:#aaa;font-size:13px;padding:20px; }

/* ===== MODALE ===== */
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px; }
.modal { background:white;border-radius:16px;width:100%;max-width:640px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3); }
.modal-header { display:flex;justify-content:space-between;align-items:center;padding:20px 24px 16px;border-bottom:1px solid #dee2e6; }
.modal-header h3 { margin:0;font-size:1.1rem; }
.modal-close { background:none;border:none;font-size:20px;cursor:pointer;color:#666; }
.modal-body { overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:14px;flex:1; }
.modal-footer { display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid #dee2e6; }
.modal-error { margin:0 24px;padding:10px 14px;background:#f8d7da;color:#721c24;border-radius:8px;font-size:13px; }
.form-group { display:flex;flex-direction:column;gap:6px; }
.form-group label { font-size:13px;font-weight:600;color:#334155; }
.form-group input,.form-group select,.form-group textarea { padding:9px 12px;border:1.5px solid #cbd5e1;border-radius:8px;font:inherit;color:#0f172a;background:#f8fafc; }
.form-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.tags-picker { display:flex;flex-wrap:wrap;gap:6px; }
.tag-option { padding:4px 10px;border-radius:999px;border:1px solid #cbd5e1;background:#fff;color:#334155;cursor:pointer;font-size:12px; }
.tag-option.active { background:#2980b9;border-color:#2980b9;color:white; }
.btn-annuler { padding:10px 18px;background:#e2e8f0;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
.btn-sauvegarder { padding:10px 20px;background:#3498db;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700; }
.btn-sauvegarder:disabled { opacity:0.5;cursor:not-allowed; }
</style>