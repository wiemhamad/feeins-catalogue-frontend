<template>
  <div class="admin">

    <div class="admin-header">
      <h1>Dashboard Administrateur</h1>
      <p>Gestion et validation des ressources pédagogiques</p>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button :class="['tab', onglet === 'attente' ? 'tab-active' : '']" @click="onglet = 'attente'">
        En attente
        <span class="badge" v-if="enAttente.length">{{ enAttente.length }}</span>
      </button>
      <button :class="['tab', onglet === 'toutes' ? 'tab-active' : '']" @click="onglet = 'toutes'">
        Toutes les ressources
      </button>
      <button :class="['tab', onglet === 'referentiels' ? 'tab-active' : '']" @click="onglet = 'referentiels'">
        Référentiels
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div><p>Chargement...</p>
    </div>
    <div v-else-if="erreur" class="error">{{ erreur }}</div>

    <!-- ===== EN ATTENTE ===== -->
    <div v-else-if="onglet === 'attente'">
      <div v-if="enAttente.length === 0" class="empty">Aucune ressource en attente</div>
      <div v-else class="liste">
        <div v-for="r in enAttente" :key="r.id" class="ressource-card">
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">{{ r.typeSupport }}</span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom" class="meta-item meta-niveau">{{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom" class="meta-item meta-theme">{{ r.thematiqueNom }}</span>
              <span v-if="r.dureeMinutes" class="meta-item">{{ r.dureeMinutes }} min</span>
              <span v-if="r.contributeurNom" class="meta-item meta-contrib">{{ r.contributeurNom }}</span>
            </div>
            <div v-if="r.tags?.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier">Modifier</button>
            <button @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours===r.id">Valider</button>
            <button @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours===r.id">Refuser</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TOUTES LES RESSOURCES ===== -->
    <div v-else-if="onglet === 'toutes'">
      <div class="filtres-admin">
        <input v-model="recherche" type="text" placeholder="Rechercher..." class="input-search" />
        <select v-model="filtreStatut" class="select-filtre">
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="VALIDEE">Validée</option>
          <option value="REFUSEE">Refusée</option>
        </select>
      </div>
      <div class="stats-bar">
        <span class="stat stat-attente">{{ compterStatut('EN_ATTENTE') }} en attente</span>
        <span class="stat stat-validee">{{ compterStatut('VALIDEE') }} validées</span>
        <span class="stat stat-refusee">{{ compterStatut('REFUSEE') }} refusées</span>
      </div>
      <div class="liste">
        <div v-for="r in ressourcesFiltrees" :key="r.id" class="ressource-card">
          <div class="ressource-info">
            <div class="ressource-top">
              <span class="badge-type" :class="'badge-' + r.typeSupport?.toLowerCase()">{{ r.typeSupport }}</span>
              <span :class="['statut', 'statut-' + r.statut?.toLowerCase()]">{{ r.statut }}</span>
              <span class="nomenclature">{{ r.nomenclature }}</span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p class="description">{{ r.description }}</p>
            <div class="meta">
              <span v-if="r.niveauNom" class="meta-item meta-niveau">{{ r.niveauNom }}</span>
              <span v-if="r.thematiqueNom" class="meta-item meta-theme">{{ r.thematiqueNom }}</span>
              <span v-if="r.contributeurNom" class="meta-item meta-contrib">{{ r.contributeurNom }}</span>
            </div>
            <div v-if="r.tags?.length" class="tags">
              <span v-for="tag in r.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="actions">
            <a v-if="r.urlAcces" :href="r.urlAcces" target="_blank" class="btn-voir">Voir</a>
            <button @click="ouvrirModale(r)" class="btn-modifier">Modifier</button>
            <button v-if="r.statut==='EN_ATTENTE'||r.statut==='REFUSEE'" @click="valider(r.id)" class="btn-valider" :disabled="actionEnCours===r.id">Valider</button>
            <button v-if="r.statut==='EN_ATTENTE'||r.statut==='VALIDEE'" @click="refuser(r.id)" class="btn-refuser" :disabled="actionEnCours===r.id">Refuser</button>
            <button @click="supprimer(r.id)" class="btn-supprimer" :disabled="actionEnCours===r.id">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== RÉFÉRENTIELS ===== -->
    <div v-else-if="onglet === 'referentiels'" class="referentiels">

      <div class="ref-tabs">
        <button :class="['ref-tab', refOnglet==='tags' ? 'ref-tab-active' : '']" @click="refOnglet='tags'">Tags</button>
        <button :class="['ref-tab', refOnglet==='niveaux' ? 'ref-tab-active' : '']" @click="refOnglet='niveaux'">Niveaux</button>
        <button :class="['ref-tab', refOnglet==='thematiques' ? 'ref-tab-active' : '']" @click="refOnglet='thematiques'">Thématiques</button>
      </div>

      <!-- TAGS -->
      <div v-if="refOnglet==='tags'" class="ref-section">
        <div class="ref-header">
          <h3>Gestion des tags</h3>
          <p>Les tags permettent aux utilisateurs de retrouver les ressources par mot-clé.</p>
        </div>
        <div class="ref-add">
          <input v-model="newTag" type="text" placeholder="Nouveau tag (ex: rgpd, ia-sante...)" class="ref-input" @keyup.enter="ajouterTag" />
          <button @click="ajouterTag" class="ref-btn-add" :disabled="!newTag.trim()">Ajouter</button>
        </div>
        <div v-if="refMsg.tags" class="ref-msg" :class="refMsg.tags.type">{{ refMsg.tags.text }}</div>
        <div class="ref-list">
          <div v-for="tag in tags" :key="tag.id" class="ref-item">
            <div v-if="editTag?.id === tag.id" class="ref-edit">
              <input v-model="editTag.libelle" class="ref-input-inline" @keyup.enter="sauvegarderTag" />
              <button @click="sauvegarderTag" class="ref-btn-save">Sauvegarder</button>
              <button @click="editTag=null" class="ref-btn-cancel">Annuler</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-tag-pill">#{{ tag.libelle }}</span>
              <div class="ref-item-actions">
                <button @click="editTag={...tag}" class="ref-btn-edit">Modifier</button>
                <button @click="supprimerTag(tag.id)" class="ref-btn-del">Supprimer</button>
              </div>
            </div>
          </div>
          <div v-if="tags.length===0" class="ref-empty">Aucun tag. Ajoutez-en un.</div>
        </div>
      </div>

      <!-- NIVEAUX -->
      <div v-else-if="refOnglet==='niveaux'" class="ref-section">
        <div class="ref-header">
          <h3>Gestion des niveaux</h3>
          <p>Les niveaux ciblent les apprenants (L3, Master, Débutant...).</p>
        </div>
        <div class="ref-add">
          <input v-model="newNiveau" type="text" placeholder="Nouveau niveau (ex: L3, Master...)" class="ref-input" @keyup.enter="ajouterNiveau" />
          <button @click="ajouterNiveau" class="ref-btn-add" :disabled="!newNiveau.trim()">Ajouter</button>
        </div>
        <div v-if="refMsg.niveaux" class="ref-msg" :class="refMsg.niveaux.type">{{ refMsg.niveaux.text }}</div>
        <div class="ref-list">
          <div v-for="niv in niveaux" :key="niv.id" class="ref-item">
            <div v-if="editNiveau?.id === niv.id" class="ref-edit">
              <input v-model="editNiveau.nom" class="ref-input-inline" @keyup.enter="sauvegarderNiveau" />
              <button @click="sauvegarderNiveau" class="ref-btn-save">Sauvegarder</button>
              <button @click="editNiveau=null" class="ref-btn-cancel">Annuler</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-niveau-pill">{{ niv.nom }}</span>
              <div class="ref-item-actions">
                <button @click="editNiveau={...niv}" class="ref-btn-edit">Modifier</button>
                <button @click="supprimerNiveau(niv.id)" class="ref-btn-del">Supprimer</button>
              </div>
            </div>
          </div>
          <div v-if="niveaux.length===0" class="ref-empty">Aucun niveau.</div>
        </div>
      </div>

      <!-- THÉMATIQUES -->
      <div v-else-if="refOnglet==='thematiques'" class="ref-section">
        <div class="ref-header">
          <h3>Gestion des thématiques</h3>
          <p>Les thématiques organisent les ressources par domaine (SIS, IA, RGPD...).</p>
        </div>
        <div class="ref-add">
          <input v-model="newThematique" type="text" placeholder="Nouvelle thématique..." class="ref-input" @keyup.enter="ajouterThematique" />
          <button @click="ajouterThematique" class="ref-btn-add" :disabled="!newThematique.trim()">Ajouter</button>
        </div>
        <div v-if="refMsg.thematiques" class="ref-msg" :class="refMsg.thematiques.type">{{ refMsg.thematiques.text }}</div>
        <div class="ref-list">
          <div v-for="th in thematiques" :key="th.id" class="ref-item">
            <div v-if="editThematique?.id === th.id" class="ref-edit">
              <input v-model="editThematique.nom" class="ref-input-inline" @keyup.enter="sauvegarderThematique" />
              <button @click="sauvegarderThematique" class="ref-btn-save">Sauvegarder</button>
              <button @click="editThematique=null" class="ref-btn-cancel">Annuler</button>
            </div>
            <div v-else class="ref-item-content">
              <span class="ref-theme-pill">{{ th.nom }}</span>
              <div class="ref-item-actions">
                <button @click="editThematique={...th}" class="ref-btn-edit">Modifier</button>
                <button @click="supprimerThematique(th.id)" class="ref-btn-del">Supprimer</button>
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
          <h3>Modifier la ressource</h3>
          <button class="modal-close" @click="fermerModale">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label>Titre *</label><input v-model="modale.form.titre" type="text" required /></div>
          <div class="form-group"><label>Description</label><textarea v-model="modale.form.description" rows="3"></textarea></div>
          <div class="form-row">
            <div class="form-group">
              <label>Type de support</label>
              <select v-model="modale.form.typeSupport">
                <option value="VIDEO">Vidéo</option>
                <option value="H5P">H5P</option>
                <option value="PDF">PDF</option>
                <option value="QUIZ">Quiz</option>
                <option value="HTML">HTML</option>
                <option value="LIEN">Lien</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Difficulté</label>
              <select v-model="modale.form.difficulte">
                <option value="">Non précisée</option>
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
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
                <option value="COURS">Cours</option>
                <option value="ACTIVITE">Activité</option>
                <option value="EVALUATION_FORMATIVE">Éval. formative</option>
                <option value="EVALUATION_SOMMATIVE">Éval. sommative</option>
                <option value="RESSOURCE_COMPLEMENTAIRE">Complémentaire</option>
                <option value="QUIZ_POSITIONNEMENT">Quiz positionnement</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>URL d'accès</label><input v-model="modale.form.urlAcces" type="url" /></div>
          <div class="form-group">
            <label>Tags</label>
            <div class="tags-picker">
              <button v-for="tag in tags" :key="tag.id" type="button" class="tag-option"
                :class="{ active: modale.form.tagIds.includes(tag.id) }"
                @click="toggleTagModale(tag.id)">#{{ tag.libelle }}</button>
            </div>
          </div>
        </div>
        <div v-if="modale.erreur" class="modal-error">{{ modale.erreur }}</div>
        <div class="modal-footer">
          <button class="btn-annuler" @click="fermerModale">Annuler</button>
          <button class="btn-sauvegarder" @click="sauvegarderModification" :disabled="modale.saving">
            {{ modale.saving ? 'Sauvegarde...' : 'Sauvegarder' }}
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
  try { await api.post('/api/tags', { libelle: newTag.value.trim().toLowerCase() }); newTag.value=''; await chargerReferentiels(); setRefMsg('tags','success','Tag ajouté.') }
  catch(e) { setRefMsg('tags','error', e.response?.status===409 ? 'Ce tag existe déjà.' : 'Erreur.') }
}
const sauvegarderTag = async () => {
  try { await api.put(`/api/tags/${editTag.value.id}`, { libelle: editTag.value.libelle }); editTag.value=null; await chargerReferentiels(); setRefMsg('tags','success','Tag modifié.') }
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
  try { await api.post('/api/niveaux', { nom: newNiveau.value.trim() }); newNiveau.value=''; await chargerReferentiels(); setRefMsg('niveaux','success','Niveau ajouté.') }
  catch { setRefMsg('niveaux','error','Erreur.') }
}
const sauvegarderNiveau = async () => {
  try { await api.put(`/api/niveaux/${editNiveau.value.id}`, { nom: editNiveau.value.nom }); editNiveau.value=null; await chargerReferentiels(); setRefMsg('niveaux','success','Niveau modifié.') }
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
  try { await api.post('/api/thematiques', { nom: newThematique.value.trim() }); newThematique.value=''; await chargerReferentiels(); setRefMsg('thematiques','success','Thématique ajoutée.') }
  catch(e) { setRefMsg('thematiques','error', e.response?.status===409 ? 'Existe déjà.' : 'Erreur.') }
}
const sauvegarderThematique = async () => {
  try { await api.put(`/api/thematiques/${editThematique.value.id}`, { nom: editThematique.value.nom }); editThematique.value=null; await chargerReferentiels(); setRefMsg('thematiques','success','Thématique modifiée.') }
  catch { setRefMsg('thematiques','error','Erreur.') }
}
const supprimerThematique = async (id) => {
  if (!confirm('Supprimer cette thématique ?')) return
  try { await api.delete(`/api/thematiques/${id}`); await chargerReferentiels(); setRefMsg('thematiques','success','Thématique supprimée.') }
  catch { setRefMsg('thematiques','error','Erreur.') }
}
</script>

<style scoped>
.admin { max-width: 1000px; margin: 0 auto; padding: 20px; font-family: 'Inter', sans-serif; }

.admin-header { margin-bottom: 25px; }
.admin-header h1 { font-size: 1.6rem; color: #1e293b; font-weight: 700; margin: 0 0 4px; }
.admin-header p { color: #64748b; margin: 0; font-size: 0.9rem; }

/* ===== TABS ===== */
.tabs { display: flex; gap: 4px; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; }
.tab {
  padding: 10px 20px; border: none; background: none; cursor: pointer;
  font-size: 14px; font-weight: 500; color: #64748b;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
  display: flex; align-items: center; gap: 8px; transition: color 0.2s;
}
.tab:hover { color: #1e293b; }
.tab-active { color: #1e293b; border-bottom-color: #1e293b; }
.tab .badge {
  background: #ef4444; color: white; border-radius: 10px;
  padding: 1px 7px; font-size: 11px; font-weight: 700;
}

/* ===== ÉTATS ===== */
.loading { text-align: center; padding: 50px; color: #64748b; }
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0; border-top-color: #1e293b;
  border-radius: 50%; animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error { text-align: center; padding: 30px; color: #dc2626; background: #fef2f2; border-radius: 10px; }
.empty { text-align: center; padding: 50px; color: #64748b; background: #f8fafc; border-radius: 10px; }

/* ===== FILTRES ===== */
.filtres-admin { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.input-search {
  flex: 1; min-width: 200px; padding: 9px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 14px;
  font-family: inherit; transition: border-color 0.2s;
}
.input-search:focus { outline: none; border-color: #3b82f6; }
.select-filtre {
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 14px; background: white; font-family: inherit; cursor: pointer;
}

/* ===== STATS ===== */
.stats-bar { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.stat { padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.stat-attente { background: #fef9c3; color: #713f12; }
.stat-validee { background: #dcfce7; color: #14532d; }
.stat-refusee { background: #fee2e2; color: #7f1d1d; }

/* ===== LISTE RESSOURCES ===== */
.liste { display: flex; flex-direction: column; gap: 12px; }
.ressource-card {
  background: white; border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 18px 20px;
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
}
.ressource-info { flex: 1; }
.ressource-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }

/* Badges type */
.badge-type {
  padding: 2px 10px; border-radius: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: white;
}
.badge-video  { background: #ef4444; }
.badge-h5p    { background: #8b5cf6; }
.badge-pdf    { background: #f97316; }
.badge-quiz   { background: #3b82f6; }
.badge-html   { background: #10b981; }
.badge-lien   { background: #06b6d4; }
.badge-autre  { background: #94a3b8; }

/* Statuts */
.statut {
  padding: 2px 10px; border-radius: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
  text-transform: uppercase;
}
.statut-en_attente { background: #fef9c3; color: #713f12; }
.statut-validee    { background: #dcfce7; color: #14532d; }
.statut-refusee    { background: #fee2e2; color: #7f1d1d; }

.nomenclature { font-size: 11px; color: #94a3b8; font-family: monospace; }
.ressource-info h3 { font-size: 0.95rem; color: #1e293b; margin: 0 0 6px; font-weight: 600; }
.description {
  font-size: 0.83rem; color: #64748b; margin: 0 0 10px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;
}

/* Meta */
.meta { display: flex; flex-wrap: wrap; gap: 6px; }
.meta-item {
  font-size: 12px; padding: 2px 8px; border-radius: 4px;
  background: #f1f5f9; color: #475569;
}
.meta-niveau { background: #ede9fe; color: #5b21b6; }
.meta-theme  { background: #fce7f3; color: #9d174d; }
.meta-contrib { background: #e0f2fe; color: #0369a1; }

.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tag {
  background: #f0f9ff; color: #0284c7;
  padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;
}

/* Actions */
.actions { display: flex; flex-direction: column; gap: 7px; min-width: 100px; }
.btn-voir, .btn-modifier, .btn-valider, .btn-refuser, .btn-supprimer {
  padding: 7px 12px; border-radius: 6px; cursor: pointer;
  font-size: 12px; font-weight: 600; border: none; text-align: center;
  font-family: inherit; transition: opacity 0.15s;
}
.btn-voir     { background: #f1f5f9; border: 1px solid #e2e8f0; text-decoration: none; color: #334155; }
.btn-modifier { background: #3b82f6; color: white; }
.btn-valider  { background: #22c55e; color: white; }
.btn-refuser  { background: #ef4444; color: white; }
.btn-supprimer { background: #94a3b8; color: white; }
button:disabled { opacity: 0.45; cursor: not-allowed; }

/* ===== RÉFÉRENTIELS ===== */
.referentiels { padding: 6px 0; }
.ref-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.ref-tab {
  padding: 8px 20px; border-radius: 6px; border: 1.5px solid #e2e8f0;
  background: white; cursor: pointer; font-size: 13px; font-weight: 600;
  color: #475569; transition: all 0.15s; font-family: inherit;
}
.ref-tab:hover { border-color: #94a3b8; color: #1e293b; }
.ref-tab-active { background: #1e293b; color: white; border-color: #1e293b; }

.ref-section {
  background: white; border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  padding: 22px;
}
.ref-header { margin-bottom: 18px; }
.ref-header h3 { font-size: 1rem; margin: 0 0 4px; color: #1e293b; font-weight: 700; }
.ref-header p { font-size: 13px; color: #64748b; margin: 0; }

.ref-add { display: flex; gap: 10px; margin-bottom: 12px; }
.ref-input {
  flex: 1; padding: 9px 14px; border: 1.5px solid #e2e8f0;
  border-radius: 8px; font-size: 14px; font-family: inherit;
  transition: border-color 0.2s;
}
.ref-input:focus { outline: none; border-color: #3b82f6; }
.ref-btn-add {
  padding: 9px 18px; background: #1e293b; color: white;
  border: none; border-radius: 8px; cursor: pointer;
  font-weight: 700; font-size: 13px; white-space: nowrap; font-family: inherit;
}
.ref-btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

.ref-msg {
  padding: 8px 14px; border-radius: 6px;
  font-size: 13px; font-weight: 600; margin-bottom: 10px;
}
.ref-msg.success { background: #dcfce7; color: #14532d; }
.ref-msg.error   { background: #fee2e2; color: #7f1d1d; }

.ref-list {
  display: flex; flex-direction: column; gap: 6px;
  max-height: 400px; overflow-y: auto;
}
.ref-item {
  border: 1px solid #f1f5f9; border-radius: 8px;
  padding: 10px 14px; background: #fafafa;
}
.ref-item-content { display: flex; justify-content: space-between; align-items: center; gap: 10px; }

.ref-tag-pill   { background: #e0f2fe; color: #0369a1; padding: 3px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; }
.ref-niveau-pill { background: #ede9fe; color: #5b21b6; padding: 3px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; }
.ref-theme-pill  { background: #fce7f3; color: #9d174d; padding: 3px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; }

.ref-item-actions { display: flex; gap: 6px; }
.ref-btn-edit, .ref-btn-del, .ref-btn-save, .ref-btn-cancel {
  padding: 5px 12px; border: none; border-radius: 6px;
  cursor: pointer; font-size: 12px; font-weight: 600; font-family: inherit;
}
.ref-btn-edit   { background: #e0f2fe; color: #0369a1; }
.ref-btn-del    { background: #fee2e2; color: #dc2626; }
.ref-btn-save   { background: #22c55e; color: white; }
.ref-btn-cancel { background: #e2e8f0; color: #475569; }

.ref-edit { display: flex; align-items: center; gap: 8px; }
.ref-input-inline {
  flex: 1; padding: 7px 12px; border: 1.5px solid #3b82f6;
  border-radius: 7px; font-size: 13px; font-family: inherit;
}
.ref-empty { text-align: center; color: #94a3b8; font-size: 13px; padding: 20px; }

/* ===== MODALE ===== */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px;
}
.modal {
  background: white; border-radius: 16px; width: 100%; max-width: 640px;
  max-height: 90vh; display: flex; flex-direction: column;
  box-shadow: 0 25px 60px rgba(0,0,0,0.25);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px 16px; border-bottom: 1px solid #e2e8f0;
}
.modal-header h3 { margin: 0; font-size: 1.05rem; color: #1e293b; font-weight: 700; }
.modal-close {
  background: none; border: none; font-size: 22px;
  cursor: pointer; color: #94a3b8; line-height: 1;
}
.modal-close:hover { color: #1e293b; }
.modal-body {
  overflow-y: auto; padding: 20px 24px;
  display: flex; flex-direction: column; gap: 14px; flex: 1;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 24px; border-top: 1px solid #e2e8f0;
}
.modal-error {
  margin: 0 24px; padding: 10px 14px;
  background: #fee2e2; color: #7f1d1d;
  border-radius: 8px; font-size: 13px;
}
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 13px; font-weight: 600; color: #334155; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font: inherit; color: #0f172a; background: #f8fafc; transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { outline: none; border-color: #3b82f6; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.tags-picker { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-option {
  padding: 4px 12px; border-radius: 6px; border: 1.5px solid #e2e8f0;
  background: white; color: #334155; cursor: pointer;
  font-size: 12px; font-weight: 600; font-family: inherit; transition: all 0.15s;
}
.tag-option:hover { border-color: #3b82f6; color: #3b82f6; }
.tag-option.active { background: #3b82f6; border-color: #3b82f6; color: white; }

.btn-annuler {
  padding: 10px 18px; background: #f1f5f9; border: none;
  border-radius: 8px; cursor: pointer; font-weight: 600;
  font-family: inherit; color: #334155;
}
.btn-sauvegarder {
  padding: 10px 22px; background: #3b82f6; color: white;
  border: none; border-radius: 8px; cursor: pointer;
  font-weight: 700; font-family: inherit;
}
.btn-sauvegarder:disabled { opacity: 0.5; cursor: not-allowed; }
</style>