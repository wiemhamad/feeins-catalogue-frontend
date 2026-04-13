<template>
  <div class="enseignant-page">

    <section class="enseignant-hero">
      <div>
        <span class="hero-kicker">👨‍🏫 Espace Enseignant</span>
        <h1>Créez et gérez vos templates pédagogiques</h1>
        <p>Composez des <strong>templates</strong> à partir de ressources validées existantes.</p>
      </div>
      <div class="hero-actions">
        <RouterLink to="/catalogue" class="hero-link hero-link-secondary">Voir le catalogue</RouterLink>
      </div>
    </section>

    <div v-if="feedback.message" class="feedback-bar" :class="feedback.type">{{ feedback.message }}</div>

    <section class="enseignant-layout">

      <!-- FORMULAIRE -->
      <article class="panel">
        <div class="panel-header">
          <div><h2>Nouveau template</h2><p>Un template regroupe des ressources validées en un scénario pédagogique.</p></div>
          <span class="role-chip">{{ authStore.userDisplayName }}</span>
        </div>
        <form @submit.prevent="creerTemplate" class="template-form">
          <div class="form-group">
            <label>Nom du template *</label>
            <input v-model="form.nom" type="text" placeholder="ex: Capsule vidéo + Quiz, Cours 30 min clé en main..." required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Décrivez le scénario pédagogique de ce template..."></textarea>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select v-model="form.modifiable">
              <option :value="true">🔓 Modifiable (peut être adapté par l'enseignant)</option>
              <option :value="false">🔒 Clé en main (non modifiable)</option>
            </select>
          </div>
          <div class="form-group">
            <label>📚 Ressources à associer</label>
            <div class="ressources-search-bar">
              <input v-model="rechercheRessource" type="text" placeholder="🔍 Filtrer les ressources..." class="ressources-search" />
              <select v-model="filtreType" class="ressources-filtre">
                <option value="">Tous types</option>
                <option value="VIDEO">🎥 Vidéo</option>
                <option value="H5P">🎮 H5P</option>
                <option value="PDF">📄 PDF</option>
                <option value="QUIZ">❓ Quiz</option>
                <option value="HTML">🌐 HTML</option>
                <option value="LIEN">🔗 Lien</option>
              </select>
            </div>
            <div class="ressources-list" v-if="ressourcesFiltrees.length">
              <div v-for="r in ressourcesFiltrees" :key="r.id" class="ressource-item" :class="{ selected: form.ressourceIds.includes(r.id) }" @click="toggleRessource(r.id)">
                <div class="ressource-item-left">
                  <span class="res-type" :class="'res-' + r.typeSupport?.toLowerCase()">{{ iconeType(r.typeSupport) }}</span>
                  <div>
                    <div class="res-titre">{{ r.titre }}</div>
                    <div class="res-meta">
                      <span v-if="r.thematiqueNom">{{ r.thematiqueNom }}</span>
                      <span v-if="r.niveauNom">{{ r.niveauNom }}</span>
                      <span v-if="r.dureeMinutes">{{ r.dureeMinutes }} min</span>
                    </div>
                  </div>
                </div>
                <div class="check-icon">{{ form.ressourceIds.includes(r.id) ? '✅' : '⬜' }}</div>
              </div>
            </div>
            <div v-else class="ressources-empty">Aucune ressource validée trouvée.</div>
            <div v-if="form.ressourceIds.length" class="selection-info">{{ form.ressourceIds.length }} ressource(s) sélectionnée(s)</div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetForm">Vider</button>
            <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Création...' : '📋 Créer le template' }}</button>
          </div>
        </form>
      </article>

      <!-- MES TEMPLATES -->
      <article class="panel">
        <div class="panel-header">
          <div><h2>Mes templates</h2><p>Cliquez sur un template pour voir ses ressources associées.</p></div>
          <button class="refresh-btn" @click="chargerTemplates" :disabled="loading">{{ loading ? '...' : '↻ Actualiser' }}</button>
        </div>
        <div v-if="loading" class="empty-state">Chargement...</div>
        <div v-else-if="templates.length === 0" class="empty-state">Vous n'avez pas encore créé de template.</div>
        <div v-else class="template-list">
          <div v-for="t in templates" :key="t.id" class="template-card" :class="{ 'template-card-active': templateSelectionne?.id === t.id }" @click="selectionnerTemplate(t)">
            <div class="template-card-top">
              <span class="modif-pill" :class="t.modifiable ? 'modif-yes' : 'modif-no'">{{ t.modifiable ? '🔓 Modifiable' : '🔒 Clé en main' }}</span>
              <span class="template-meta">{{ t.ressources?.length || 0 }} ressource(s)</span>
            </div>
            <h3>{{ t.nom }}</h3>
            <p>{{ t.description || 'Aucune description.' }}</p>
            <div class="template-actions" @click.stop>
              <button @click="modifierTemplate(t)" class="btn-edit">✏️ Modifier</button>
              <button @click="selectionnerTemplate(t)" class="btn-view">{{ templateSelectionne?.id === t.id ? '▲ Masquer' : '▼ Voir ressources' }}</button>
              <button @click="supprimerTemplate(t)" class="btn-delete">🗑️ Supprimer</button>
            </div>
            <div v-if="templateSelectionne?.id === t.id" class="template-ressources">
              <div v-if="loadingRessourcesTemplate" class="tr-loading">Chargement...</div>
              <div v-else-if="ressourcesTemplate.length === 0" class="tr-empty">Aucune ressource associée à ce template.</div>
              <div v-else class="tr-list">
                <div v-for="r in ressourcesTemplate" :key="r.id" class="tr-item">
                  <span class="tr-type" :class="'res-' + r.typeSupport?.toLowerCase()">{{ iconeType(r.typeSupport) }}</span>
                  <div class="tr-info">
                    <div class="tr-titre">{{ r.titre }}</div>
                    <div class="tr-meta"><span v-if="r.niveauNom">{{ r.niveauNom }}</span><span v-if="r.thematiqueNom">{{ r.thematiqueNom }}</span><span v-if="r.dureeMinutes">{{ r.dureeMinutes }} min</span></div>
                  </div>
                  <a v-if="r.urlAcces && !r.urlAcces.startsWith('[')" :href="r.urlAcces" target="_blank" class="tr-link">Ouvrir →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- MODAL MODIFICATION -->
    <div v-if="templateEnEdition" class="modal-overlay" @click.self="templateEnEdition = null">
      <div class="modal">
        <h3>Modifier le template</h3>
        <div class="form-group"><label>Nom</label><input v-model="templateEnEdition.nom" type="text" required /></div>
        <div class="form-group"><label>Description</label><textarea v-model="templateEnEdition.description" rows="3"></textarea></div>
        <div class="form-group">
          <label>Type</label>
          <select v-model="templateEnEdition.modifiable">
            <option :value="true">🔓 Modifiable</option><option :value="false">🔒 Clé en main</option>
          </select>
        </div>
        <div class="form-group">
          <label>📚 Ressources associées</label>
          <div class="ressources-list" style="max-height:220px">
            <div v-for="r in ressourcesValidees" :key="r.id" class="ressource-item" :class="{ selected: editionRessourceIds.includes(r.id) }" @click="toggleEditionRessource(r.id)">
              <div class="ressource-item-left">
                <span class="res-type" :class="'res-' + r.typeSupport?.toLowerCase()">{{ iconeType(r.typeSupport) }}</span>
                <div>
                  <div class="res-titre">{{ r.titre }}</div>
                  <div class="res-meta"><span v-if="r.thematiqueNom">{{ r.thematiqueNom }}</span><span v-if="r.dureeMinutes">{{ r.dureeMinutes }} min</span></div>
                </div>
              </div>
              <div class="check-icon">{{ editionRessourceIds.includes(r.id) ? '✅' : '⬜' }}</div>
            </div>
          </div>
          <div v-if="editionRessourceIds.length" class="selection-info">{{ editionRessourceIds.length }} ressource(s) sélectionnée(s)</div>
        </div>
        <div class="modal-actions">
          <button @click="templateEnEdition = null" class="btn-secondary">Annuler</button>
          <button @click="sauvegarderModification" class="btn-primary" :disabled="saving">{{ saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const templates = ref([])
const ressourcesValidees = ref([])
const loading = ref(false)
const saving = ref(false)
const feedback = ref({ type: '', message: '' })
const templateEnEdition = ref(null)
const editionRessourceIds = ref([])
const rechercheRessource = ref('')
const filtreType = ref('')
const templateSelectionne = ref(null)
const ressourcesTemplate = ref([])
const loadingRessourcesTemplate = ref(false)
const form = ref({ nom: '', description: '', modifiable: true, ressourceIds: [] })

const resetForm = () => { form.value = { nom: '', description: '', modifiable: true, ressourceIds: [] }; rechercheRessource.value = ''; filtreType.value = '' }

const ressourcesFiltrees = computed(() => ressourcesValidees.value.filter(r => {
  const q = rechercheRessource.value.toLowerCase()
  return (!q || r.titre?.toLowerCase().includes(q) || r.thematiqueNom?.toLowerCase().includes(q))
    && (!filtreType.value || r.typeSupport === filtreType.value)
}))

const toggleRessource = (id) => { form.value.ressourceIds = form.value.ressourceIds.includes(id) ? form.value.ressourceIds.filter(i => i !== id) : [...form.value.ressourceIds, id] }
const toggleEditionRessource = (id) => { editionRessourceIds.value = editionRessourceIds.value.includes(id) ? editionRessourceIds.value.filter(i => i !== id) : [...editionRessourceIds.value, id] }

const selectionnerTemplate = async (t) => {
  if (templateSelectionne.value?.id === t.id) { templateSelectionne.value = null; ressourcesTemplate.value = []; return }
  templateSelectionne.value = t; loadingRessourcesTemplate.value = true
  try { ressourcesTemplate.value = (await api.get(`/api/templates/public/${t.id}/ressources`)).data || [] }
  catch { ressourcesTemplate.value = [] }
  finally { loadingRessourcesTemplate.value = false }
}

const chargerTemplates = async () => {
  loading.value = true
  try { templates.value = (await api.get('/api/templates')).data || [] }
  catch { feedback.value = { type: 'error', message: 'Impossible de charger les templates.' } }
  finally { loading.value = false }
}

const chargerRessourcesValidees = async () => {
  try { ressourcesValidees.value = (await api.get('/api/ressources')).data || [] }
  catch { /* silencieux */ }
}

const creerTemplate = async () => {
  saving.value = true; feedback.value = { type: '', message: '' }
  try {
    const { data: t } = await api.post('/api/templates', { nom: form.value.nom, description: form.value.description, modifiable: form.value.modifiable })
    if (form.value.ressourceIds.length > 0) await api.put(`/api/templates/${t.id}/ressources`, { ressourceIds: form.value.ressourceIds })
    feedback.value = { type: 'success', message: `✅ Template "${t.nom}" créé avec ${form.value.ressourceIds.length} ressource(s) !` }
    resetForm(); await chargerTemplates()
  } catch (err) {
    feedback.value = { type: 'error', message: err.response?.status === 403 ? '🚫 Accès refusé.' : 'Erreur lors de la création.' }
  } finally { saving.value = false }
}

const modifierTemplate = (t) => {
  templateEnEdition.value = { ...t }
  editionRessourceIds.value = ressourcesValidees.value.filter(r => r.templateNom === t.nom).map(r => r.id)
}

const sauvegarderModification = async () => {
  saving.value = true
  try {
    await api.put(`/api/templates/${templateEnEdition.value.id}`, templateEnEdition.value)
    await api.put(`/api/templates/${templateEnEdition.value.id}/ressources`, { ressourceIds: editionRessourceIds.value })
    feedback.value = { type: 'success', message: '✅ Template mis à jour.' }
    templateEnEdition.value = null; await chargerTemplates()
  } catch { feedback.value = { type: 'error', message: 'Erreur lors de la modification.' } }
  finally { saving.value = false }
}

const supprimerTemplate = async (t) => {
  if (!confirm(`Supprimer le template "${t.nom}" ?\n\nLes ressources associées seront détachées mais pas supprimées.`)) return
  try {
    await api.delete(`/api/templates/${t.id}`)
    feedback.value = { type: 'success', message: `✅ Template "${t.nom}" supprimé.` }
    if (templateSelectionne.value?.id === t.id) templateSelectionne.value = null
    await chargerTemplates()
  } catch (err) {
    feedback.value = { type: 'error', message: err.response?.status === 403 ? '🚫 Vous ne pouvez supprimer que vos propres templates.' : 'Erreur lors de la suppression.' }
  }
}

const iconeType = (t) => ({ VIDEO:'🎥',H5P:'🎮',PDF:'📄',QUIZ:'❓',HTML:'🌐',LIEN:'🔗',AUTRE:'📦' }[t]||'📦')

onMounted(async () => {
  if (!authStore.canCreateTemplate) { router.push('/login'); return }
  await Promise.all([chargerTemplates(), chargerRessourcesValidees()])
})
</script>

<style scoped>
.enseignant-page{max-width:1200px;margin:0 auto;padding:32px 20px 56px}
.enseignant-hero{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-bottom:28px;padding:32px;border-radius:24px;color:white;background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 60%,#0ea5e9 100%)}
.hero-kicker{display:inline-flex;margin-bottom:12px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.15);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em}
.enseignant-hero h1{margin:0 0 12px;font-size:1.9rem;font-weight:800;line-height:1.1}
.enseignant-hero p{margin:0;color:rgba(255,255,255,0.9);font-size:0.95rem}
.hero-actions{display:flex;gap:12px;flex-shrink:0}
.hero-link{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;font-weight:700;cursor:pointer;text-decoration:none}
.hero-link-secondary{background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3)}
.feedback-bar{padding:14px 20px;border-radius:12px;margin-bottom:20px;font-weight:600}
.feedback-bar.success{background:#dcfce7;color:#166534}
.feedback-bar.error{background:#fee2e2;color:#991b1b}
.enseignant-layout{display:grid;grid-template-columns:1.1fr 0.9fr;gap:24px}
.panel{padding:24px;border-radius:20px;background:white;border:1px solid #dbe4f0;box-shadow:0 8px 24px rgba(15,23,42,0.06)}
.panel-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px}
.panel-header h2{margin:0 0 5px;font-size:1.2rem;font-weight:700}
.panel-header p{margin:0;color:#64748b;font-size:0.88rem}
.role-chip,.refresh-btn{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;background:#f3e8ff;color:#7c3aed;font-size:0.85rem;font-weight:700;border:none;cursor:pointer;font-family:inherit;white-space:nowrap}
.template-form{display:flex;flex-direction:column;gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group label{font-size:0.85rem;font-weight:700;color:#334155}
.form-group input,.form-group select,.form-group textarea{border:1px solid #cbd5e1;border-radius:12px;padding:12px 14px;font:inherit;color:#0f172a;background:#f8fafc;width:100%}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#7c3aed}
.ressources-search-bar{display:flex;gap:8px;margin-bottom:10px}
.ressources-search{flex:1;padding:9px 12px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;background:#f8fafc;color:#0f172a}
.ressources-filtre{padding:9px 12px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;background:#f8fafc;color:#0f172a}
.ressources-list{display:flex;flex-direction:column;gap:6px;max-height:260px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:12px;padding:8px}
.ressource-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;transition:all 0.15s;background:#fafafa}
.ressource-item:hover{background:#f0f4ff;border-color:#c4b5fd}
.ressource-item.selected{background:#eef2ff;border-color:#6d28d9}
.ressource-item-left{display:flex;align-items:flex-start;gap:10px;flex:1}
.res-type{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.res-video{background:#fee2e2}.res-h5p{background:#f3e8ff}.res-pdf{background:#fff7ed}.res-quiz{background:#eff6ff}.res-html{background:#dcfce7}.res-lien{background:#e0f2fe}.res-autre{background:#f1f5f9}
.res-titre{font-size:0.88rem;font-weight:600;color:#1e1b4b;margin-bottom:3px}
.res-meta{display:flex;gap:6px;font-size:0.75rem;color:#64748b;flex-wrap:wrap}
.check-icon{font-size:18px;flex-shrink:0}
.ressources-empty{padding:16px;text-align:center;color:#94a3b8;font-size:13px}
.selection-info{margin-top:8px;font-size:12px;color:#7c3aed;font-weight:600}
.form-actions{display:flex;justify-content:flex-end;gap:10px}
.btn-primary,.btn-secondary{min-height:42px;padding:0 18px;border-radius:12px;border:none;font-weight:700;cursor:pointer;font-family:inherit}
.btn-primary{background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white}
.btn-secondary{background:#e2e8f0;color:#0f172a}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed}
.empty-state{display:grid;place-items:center;min-height:160px;border:1px dashed #cbd5e1;border-radius:16px;color:#94a3b8;padding:20px}
.template-list{display:flex;flex-direction:column;gap:12px}
.template-card{padding:16px;border-radius:14px;background:linear-gradient(180deg,#ffffff,#faf5ff);border:1px solid #e9d5ff;cursor:pointer;transition:all 0.2s}
.template-card:hover{border-color:#c4b5fd;box-shadow:0 4px 16px rgba(124,58,237,0.1)}
.template-card-active{border-color:#7c3aed;box-shadow:0 4px 20px rgba(124,58,237,0.15)}
.template-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.modif-pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:700}
.modif-yes{background:#dcfce7;color:#166534}.modif-no{background:#fef3c7;color:#92400e}
.template-meta{font-size:12px;color:#94a3b8}
.template-card h3{margin:0 0 6px;font-size:1rem;color:#1e1b4b;font-weight:700}
.template-card p{margin:0 0 12px;color:#64748b;font-size:0.88rem}
.template-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.btn-edit{padding:6px 12px;border-radius:8px;border:1px solid #c4b5fd;background:#f3e8ff;color:#7c3aed;font-weight:600;cursor:pointer;font-size:12px;font-family:inherit}
.btn-view{padding:6px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#334155;font-weight:600;cursor:pointer;font-size:12px;font-family:inherit}
.btn-delete{padding:6px 12px;border-radius:8px;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;font-weight:600;cursor:pointer;font-size:12px;font-family:inherit;transition:all 0.15s}
.btn-delete:hover{background:#fee2e2}
.template-ressources{margin-top:14px;border-top:1px solid #e9d5ff;padding-top:14px}
.tr-loading,.tr-empty{color:#94a3b8;font-size:13px;text-align:center;padding:12px;font-style:italic}
.tr-list{display:flex;flex-direction:column;gap:8px}
.tr-item{display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(124,58,237,0.04);border-radius:10px;border:1px solid rgba(124,58,237,0.1)}
.tr-type{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.tr-info{flex:1}
.tr-titre{font-size:0.85rem;font-weight:700;color:#1e1b4b;margin-bottom:2px}
.tr-meta{display:flex;gap:6px;font-size:0.72rem;color:#64748b}
.tr-link{font-size:12px;font-weight:700;color:#7c3aed;text-decoration:none;padding:4px 10px;border-radius:6px;background:#ede9fe;flex-shrink:0}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
.modal{background:white;border-radius:20px;padding:32px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;gap:16px}
.modal h3{margin:0;font-size:1.2rem;font-weight:700}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}
@media(max-width:900px){.enseignant-layout{grid-template-columns:1fr}}
</style>