<template>
  <div class="creator-page">
    <section class="creator-hero">
      <div class="creator-hero-copy">
        <span class="hero-kicker">Espace contributeur</span>
        <h1>Proposez et gerez vos ressources pedagogiques</h1>
        <p>
          En tant que contributeur, vous creez des ressources qui seront
          soumises a validation avant publication dans le catalogue.
        </p>
      </div>
      <div class="hero-actions">
        <RouterLink to="/catalogue" class="hero-link hero-link-secondary">Voir le catalogue</RouterLink>
        <button type="button" class="hero-link" @click="scrollToForm">Ajouter une ressource</button>
      </div>
    </section>

    <section class="creator-layout">
      <article class="creator-panel" ref="formPanel">
        <div class="panel-header">
          <div>
            <h2>Nouvelle ressource</h2>
            <p>
              La ressource sera soumise a validation avant d'apparaitre dans le catalogue public.
              <strong>Precisez bien le type d'usage</strong> pour eviter les doublons.
            </p>
          </div>
          <span class="role-chip">{{ authStore.userDisplayName }}</span>
        </div>

        <form class="creator-form" @submit.prevent="submitForm">
          <label>
            <span>Titre *</span>
            <input v-model="form.titre" type="text" placeholder="Introduction a la sante numerique" required />
          </label>

          <label class="full">
            <span>Description</span>
            <textarea v-model="form.description" rows="3" placeholder="Resume court de la ressource et de son objectif pedagogique"></textarea>
          </label>

          <label>
            <span>Type de support *</span>
            <select v-model="form.typeSupport" required>
              <option value="VIDEO">Video</option>
              <option value="H5P">H5P interactif</option>
              <option value="PDF">PDF</option>
              <option value="QUIZ">Quiz</option>
              <option value="HTML">HTML</option>
              <option value="LIEN">Lien externe</option>
              <option value="AUTRE">Autre</option>
            </select>
          </label>

          <label>
            <span>Difficulte</span>
            <select v-model="form.difficulte">
              <option value="">Non precisee</option>
              <option value="DEBUTANT">Debutant</option>
              <option value="INTERMEDIAIRE">Intermediaire</option>
              <option value="AVANCE">Avance</option>
            </select>
          </label>

          <label>
            <span>Niveau</span>
            <select v-model="form.niveauId">
              <option value="">Tous niveaux</option>
              <option v-for="n in niveaux" :key="n.id" :value="String(n.id)">{{ n.nom }}</option>
            </select>
          </label>

          <label>
            <span>Thematique</span>
            <select v-model="form.thematiqueId">
              <option value="">Non precisee</option>
              <option v-for="t in thematiques" :key="t.id" :value="String(t.id)">{{ t.nom }}</option>
            </select>
          </label>

          <label>
            <span>Duree (minutes)</span>
            <input v-model="form.dureeMinutes" type="number" min="1" placeholder="20" />
          </label>

          <label class="full">
            <span>URL d'acces</span>
            <div class="upload-tabs">
              <button type="button" :class="['upload-tab', uploadMode === 'url' ? 'active' : '']" @click="uploadMode = 'url'">URL</button>
              
            </div>
            <input v-if="uploadMode === 'url'" v-model="form.urlAcces" type="url" placeholder="https://moodle.univ-jfc.fr/..." />
         
          </label>

          <label>
            <span>Usage pedagogique *</span>
            <select v-model="form.usagePedagogique" required>
              <option value="">-- Choisir l'usage --</option>
              <option value="COURS">Cours</option>
              <option value="ACTIVITE">Activite</option>
              <option value="EVALUATION_FORMATIVE">Evaluation formative</option>
              <option value="EVALUATION_SOMMATIVE">Evaluation sommative</option>
              <option value="RESSOURCE_COMPLEMENTAIRE">Ressource complementaire</option>
              <option value="QUIZ_POSITIONNEMENT">Quiz de positionnement</option>
            </select>
          </label>

          <div v-if="form.usagePedagogique === 'EVALUATION_SOMMATIVE'" class="alerte-sommative full">
            <strong>Attention - evaluation sommative</strong><br />
            Cette ressource ne doit pas contenir les reponses, corrections ni feedbacks.
          </div>

          <label>
            <span>Droits d'utilisation</span>
            <select v-model="form.droits">
              <option value="FEEINS_INTERNE">FEEINS interne</option>
              <option value="LIBRE">Libre</option>
              <option value="PARTENAIRE">Partenaire</option>
              <option value="SOUS_LICENCE">Sous licence</option>
            </select>
          </label>

          <label>
            <span>Auteur / Partenaire</span>
            <input v-model="form.auteurPartenaire" type="text" placeholder="ex: ANAP, ISIS, Univ. JFC..." />
          </label>

          <label>
            <span>Utilise dans Moodle</span>
            <input v-model="form.usageMoodle" type="text" placeholder="SIS-L3-CM1, Master-IA-TD2" />
            <small class="hint">Listez les cours Moodle pour eviter les doublons.</small>
          </label>

          <label class="full">
            <span>Objectifs pedagogiques</span>
            <textarea v-model="form.objectifsPedagogiques" rows="2" placeholder="Ce que l'apprenant doit savoir faire"></textarea>
          </label>

          <label class="full">
            <span>Competences visees</span>
            <textarea v-model="form.competencesVisees" rows="2" placeholder="Competences ou acquis attendus"></textarea>
          </label>

          <label class="full">
            <span>Tags</span>
            <div class="tags-picker">
              <button
                v-for="tag in tags"
                :key="tag.id"
                type="button"
                class="tag-option"
                :class="{ active: form.tagIds.includes(tag.id) }"
                @click="toggleTag(tag.id)"
              >
                #{{ tag.libelle }}
              </button>
            </div>
            <small class="hint">Les tags sont essentiels pour retrouver les ressources.</small>
          </label>

          <div v-if="feedback.message" class="form-feedback full" :class="feedback.type">
            {{ feedback.message }}
          </div>

          <div class="form-actions full">
            <button type="button" class="secondary-btn" @click="resetForm">Vider</button>
            <button type="submit" class="primary-btn" :disabled="saving">
              {{ saving ? 'Envoi en cours...' : 'Soumettre pour validation' }}
            </button>
          </div>
        </form>
      </article>

      <article class="creator-panel">
        <div class="panel-header">
          <div>
            <h2>Mes ressources</h2>
            <p>Ressources proposees. Elles deviennent visibles apres validation.</p>
          </div>
          <button type="button" class="refresh-btn" @click="loadMyResources" :disabled="loadingMine">
            {{ loadingMine ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>

        <div v-if="loadingMine" class="empty-state">Chargement de vos ressources...</div>
        <div v-else-if="myResources.length === 0" class="empty-state">
          Vous n'avez pas encore soumis de ressource.
        </div>

        <div v-else class="creator-list">
          <article v-for="ressource in myResources" :key="ressource.id" class="creator-card">
            <div class="creator-card-main">
              <div class="creator-card-top">
                <span class="type-pill">{{ ressource.typeSupport || 'AUTRE' }}</span>
                <span class="status-pill" :class="statusClass(ressource.statut)">
                  {{ formatStatus(ressource.statut) }}
                </span>
              </div>
              <h3>{{ ressource.titre }}</h3>
              <p>{{ ressource.description || 'Aucune description.' }}</p>
              <div class="meta-line">
                <span v-if="ressource.niveauNom">{{ ressource.niveauNom }}</span>
                <span v-if="ressource.thematiqueNom">{{ ressource.thematiqueNom }}</span>
                <span v-if="ressource.usagePedagogique">{{ ressource.usagePedagogique }}</span>
                <span>{{ visibilityLabel(ressource.visible) }}</span>
              </div>
              <div v-if="ressource.tags?.length" class="tag-list">
                <span v-for="tag in ressource.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
              </div>
            </div>

            <div class="creator-card-actions">
              <button
                type="button"
                class="visibility-btn"
                :class="{ hidden: !ressource.visible }"
                @click="toggleVisibility(ressource)"
                :disabled="visibilityLoadingId === ressource.id"
              >
                {{ visibilityLoadingId === ressource.id ? '...' : visibilityActionLabel(ressource.visible) }}
              </button>
              <a v-if="ressource.urlAcces" :href="ressource.urlAcces" target="_blank" rel="noopener" class="card-link">
                Ouvrir
              </a>
            </div>
          </article>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const formPanel = ref(null)
const niveaux = ref([])
const thematiques = ref([])
const tags = ref([])
const myResources = ref([])
const loadingMine = ref(true)
const saving = ref(false)
const visibilityLoadingId = ref(null)
const feedback = ref({ type: '', message: '' })

const uploadMode = ref('url')
const selectedFile = ref(null)

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  form.value.urlAcces = `[Fichier local: ${file.name}]`
}

const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (!file) return
  selectedFile.value = file
  form.value.urlAcces = `[Fichier local: ${file.name}]`
}

const clearFile = () => {
  selectedFile.value = null
  form.value.urlAcces = ''
  const input = document.getElementById('file-input')
  if (input) input.value = ''
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

const emptyForm = () => ({
  titre: '',
  description: '',
  typeSupport: 'VIDEO',
  difficulte: '',
  niveauId: '',
  thematiqueId: '',
  dureeMinutes: '',
  urlAcces: '',
  objectifsPedagogiques: '',
  competencesVisees: '',
  usagePedagogique: '',
  usageMoodle: '',
  droits: 'FEEINS_INTERNE',
  auteurPartenaire: '',
  tagIds: [],
})

const form = ref(emptyForm())

const resetForm = () => {
  form.value = emptyForm()
  uploadMode.value = 'url'
  selectedFile.value = null
}

const toggleTag = (tagId) => {
  form.value.tagIds = form.value.tagIds.includes(tagId)
    ? form.value.tagIds.filter((id) => id !== tagId)
    : [...form.value.tagIds, tagId]
}

const loadOptions = async () => {
  const [niveauxResponse, thematiquesResponse, tagsResponse] = await Promise.all([
    api.get('/api/niveaux'),
    api.get('/api/thematiques'),
    api.get('/api/tags'),
  ])

  niveaux.value = niveauxResponse.data || []
  thematiques.value = thematiquesResponse.data || []
  tags.value = tagsResponse.data || []
}

const loadMyResources = async () => {
  loadingMine.value = true
  try {
    const { data } = await api.get('/api/ressources/mes-ressources')
    myResources.value = data || []
  } catch {
    feedback.value = { type: 'error', message: 'Impossible de charger vos ressources.' }
  } finally {
    loadingMine.value = false
  }
}

const submitForm = async () => {
  saving.value = true
  feedback.value = { type: '', message: '' }

  try {
    const payload = {
      ...form.value,
      niveauId: form.value.niveauId ? Number(form.value.niveauId) : null,
      thematiqueId: form.value.thematiqueId ? Number(form.value.thematiqueId) : null,
      dureeMinutes: form.value.dureeMinutes ? Number(form.value.dureeMinutes) : null,
      difficulte: form.value.difficulte || null,
      usagePedagogique: form.value.usagePedagogique || null,
      droits: form.value.droits || null,
    }

    await api.post('/api/ressources/creer', payload)
    feedback.value = {
      type: 'success',
      message: "Ressource soumise avec succes. Elle sera visible apres validation par l'administrateur.",
    }
    resetForm()
    await loadMyResources()
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data
    if (error.response?.status === 403) {
      feedback.value = { type: 'error', message: 'Acces refuse. Vous devez etre contributeur.' }
    } else {
      feedback.value = { type: 'error', message: message || 'Erreur lors de la creation.' }
    }
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async (ressource) => {
  visibilityLoadingId.value = ressource.id
  try {
    const { data } = await api.put(`/api/ressources/${ressource.id}/visibilite`, {
      visible: !ressource.visible,
    })
    myResources.value = myResources.value.map((item) => (item.id === ressource.id ? data : item))
  } catch {
    feedback.value = { type: 'error', message: "La visibilite n'a pas pu etre modifiee." }
  } finally {
    visibilityLoadingId.value = null
  }
}

const scrollToForm = () => formPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const formatStatus = (status) => ({ EN_ATTENTE: 'En attente', VALIDEE: 'Validee', REFUSEE: 'Refusee', ARCHIVEE: 'Archivee' }[status] || status || 'Sans statut')
const statusClass = (status) => `status-${String(status || '').toLowerCase()}`
const visibilityLabel = (visible) => (visible ? 'Visible' : 'Masquee')
const visibilityActionLabel = (visible) => (visible ? 'Masquer' : 'Rendre visible')

onMounted(async () => {
  if (!authStore.canCreateRessource) {
    router.push('/login')
    return
  }

  await loadOptions()
  await loadMyResources()
})
</script>

<style scoped>
.creator-page { max-width: 1280px; margin: 0 auto; padding: 32px 20px 56px; }
.creator-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: end;
  margin-bottom: 28px;
  padding: 32px;
  border-radius: 24px;
  color: white;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 28%),
              linear-gradient(135deg, #0f766e 0%, #155e75 45%, #1d4ed8 100%);
}
.hero-kicker {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.creator-hero h1 { margin: 0 0 12px; font-size: 2rem; line-height: 1.1; }
.creator-hero p { margin: 0; max-width: 720px; color: rgba(255,255,255,0.9); }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: none;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.hero-link-secondary { background: rgba(255,255,255,0.14); color: white; border: 1px solid rgba(255,255,255,0.25); }
.creator-layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); gap: 24px; }
.creator-panel { padding: 24px; border-radius: 20px; background: white; border: 1px solid #dbe4f0; box-shadow: 0 12px 32px rgba(15,23,42,0.06); }
.panel-header { display: flex; justify-content: space-between; align-items: start; gap: 16px; margin-bottom: 20px; }
.panel-header h2 { margin: 0 0 6px; font-size: 1.3rem; }
.panel-header p { margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5; }
.role-chip, .refresh-btn {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  font-family: inherit;
}
.refresh-btn { cursor: pointer; }
.creator-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.creator-form label { display: flex; flex-direction: column; gap: 8px; }
.creator-form label.full { grid-column: 1 / -1; }
.creator-form span { font-size: 0.85rem; font-weight: 700; color: #334155; }
.creator-form input, .creator-form select, .creator-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  color: #0f172a;
  background: #f8fafc;
}
.creator-form input:focus, .creator-form select:focus, .creator-form textarea:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
}
.hint { font-size: 12px; color: #94a3b8; }
.alerte-sommative {
  padding: 14px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  border-left: 4px solid #ef4444;
}
.tags-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-option {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}
.tag-option.active { background: #0f766e; border-color: #0f766e; color: white; }
.form-feedback { padding: 12px 14px; border-radius: 12px; font-weight: 600; }
.form-feedback.success { background: #dcfce7; color: #166534; }
.form-feedback.error { background: #fee2e2; color: #991b1b; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; }
.primary-btn, .secondary-btn { min-height: 44px; padding: 0 18px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; font-family: inherit; }
.primary-btn { background: linear-gradient(135deg, #0f766e, #1d4ed8); color: white; }
.secondary-btn { background: #e2e8f0; color: #0f172a; }
.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.empty-state { display: grid; place-items: center; min-height: 180px; border: 1px dashed #cbd5e1; border-radius: 16px; color: #64748b; text-align: center; padding: 20px; }
.creator-list { display: flex; flex-direction: column; gap: 14px; }
.creator-card { display: flex; justify-content: space-between; gap: 16px; padding: 18px; border-radius: 18px; background: linear-gradient(180deg, #ffffff, #f8fafc); border: 1px solid #e2e8f0; }
.creator-card-top, .meta-line, .creator-card-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.creator-card-main h3 { margin: 10px 0 6px; font-size: 1rem; }
.creator-card-main p { margin: 0 0 8px; color: #64748b; line-height: 1.5; font-size: 0.88rem; }
.meta-line { color: #475569; font-size: 0.82rem; }
.meta-line span { padding: 4px 10px; border-radius: 999px; background: #eef2ff; }
.tag-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.tag-chip { background: #e8f4f8; color: #2980b9; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.type-pill, .status-pill { display: inline-flex; align-items: center; min-height: 28px; padding: 0 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }
.type-pill { background: #e0f2fe; color: #0369a1; }
.status-en_attente { background: #fef3c7; color: #92400e; }
.status-validee { background: #dcfce7; color: #166534; }
.status-refusee { background: #fee2e2; color: #991b1b; }
.status-archivee { background: #e2e8f0; color: #334155; }
.creator-card-actions { min-width: 140px; flex-direction: column; justify-content: center; align-items: stretch; }
.visibility-btn, .card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
}
.visibility-btn.hidden { background: #fff7ed; color: #9a3412; border-color: #fdba74; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.upload-tabs { display: flex; gap: 6px; margin-bottom: 8px; }
.upload-tab { padding: 6px 14px; border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; color: #334155; cursor: pointer; font-size: 13px; font-family: inherit; }
.upload-tab.active { background: #0f766e; border-color: #0f766e; color: white; }
.file-upload-zone { border: 2px dashed #cbd5e1; border-radius: 12px; background: #f8fafc; transition: border-color 0.2s; }
.file-upload-zone:hover { border-color: #0f766e; }
.file-input-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
.file-upload-label { display: flex; align-items: center; justify-content: center; min-height: 80px; cursor: pointer; padding: 16px; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6; }
.file-selected { display: flex; align-items: center; gap: 10px; color: #0f766e; font-weight: 600; }
.file-clear { background: none; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; padding: 2px 8px; color: #64748b; }

@media (max-width: 1080px) { .creator-layout { grid-template-columns: 1fr; } }

@media (max-width: 720px) {
  .creator-hero, .panel-header, .creator-card { flex-direction: column; align-items: stretch; }
  .creator-form { grid-template-columns: 1fr; }
  .creator-form label.full { grid-column: auto; }
  .form-actions { flex-direction: column; }
}
</style>
