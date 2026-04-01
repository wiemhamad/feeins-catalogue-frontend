<template>
  <div class="creator-page">
    <section class="creator-hero">
      <div class="creator-hero-copy">
        <span class="hero-kicker">Espace createur</span>
        <h1>Ajoutez vos ressources et gerez leur visibilite</h1>
        <p>
          Vous gardez toutes les fonctionnalites apprenant, avec en plus un espace pour publier,
          suivre et masquer vos propres contenus.
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink to="/catalogue" class="hero-link hero-link-secondary">Consulter le catalogue</RouterLink>
        <button type="button" class="hero-link" @click="scrollToForm">Ajouter une ressource</button>
      </div>
    </section>

    <section class="creator-layout">
      <article class="creator-panel" ref="formPanel">
        <div class="panel-header">
          <div>
            <h2>Nouvelle ressource</h2>
            <p>La ressource sera creee puis pourra etre rendue visible ou masquee depuis votre tableau.</p>
          </div>
          <span class="role-chip">{{ authStore.userDisplayName }}</span>
        </div>

        <form class="creator-form" @submit.prevent="submitForm">
          <label>
            <span>Titre</span>
            <input v-model="form.titre" type="text" placeholder="Introduction a la sante numerique" required />
          </label>

          <label class="full">
            <span>Description</span>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Resume court de la ressource et de son objectif pedagogique"
            ></textarea>
          </label>

          <label>
            <span>Type</span>
            <select v-model="form.typeSupport" required>
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="QUIZ">Quiz</option>
              <option value="H5P">H5P</option>
              <option value="HTML">HTML</option>
              <option value="LIEN">Lien</option>
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
              <option v-for="niveau in niveaux" :key="niveau.id" :value="String(niveau.id)">
                {{ niveau.nom }}
              </option>
            </select>
          </label>

          <label>
            <span>Thematique</span>
            <select v-model="form.thematiqueId">
              <option value="">Non precisee</option>
              <option v-for="thematique in thematiques" :key="thematique.id" :value="String(thematique.id)">
                {{ thematique.nom }}
              </option>
            </select>
          </label>

          <label>
            <span>Duree (minutes)</span>
            <input v-model="form.dureeMinutes" type="number" min="1" placeholder="20" />
          </label>

          <label>
            <span>URL d'acces</span>
            <input v-model="form.urlAcces" type="url" placeholder="https://..." />
          </label>

          <label>
            <span>Usage pedagogique</span>
            <select v-model="form.usagePedagogique">
              <option value="">Non precise</option>
              <option value="COURS">Cours</option>
              <option value="ACTIVITE">Activite</option>
              <option value="EVALUATION_FORMATIVE">Evaluation formative</option>
              <option value="EVALUATION_SOMMATIVE">Evaluation sommative</option>
              <option value="RESSOURCE_COMPLEMENTAIRE">Ressource complementaire</option>
              <option value="QUIZ_POSITIONNEMENT">Quiz de positionnement</option>
            </select>
          </label>

          <label>
            <span>Droits</span>
            <select v-model="form.droits">
              <option value="">Par defaut</option>
              <option value="LIBRE">Libre</option>
              <option value="FEEINS_INTERNE">FEEINS interne</option>
              <option value="PARTENAIRE">Partenaire</option>
              <option value="SOUS_LICENCE">Sous licence</option>
            </select>
          </label>

          <label class="full">
            <span>Objectifs pedagogiques</span>
            <textarea v-model="form.objectifsPedagogiques" rows="3" placeholder="Ce que l'apprenant doit savoir faire"></textarea>
          </label>

          <label class="full">
            <span>Competences visees</span>
            <textarea v-model="form.competencesVisees" rows="3" placeholder="Competences ou acquis attendus"></textarea>
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
                {{ tag.libelle }}
              </button>
            </div>
          </label>

          <div class="form-feedback" v-if="feedback.message" :class="feedback.type">
            {{ feedback.message }}
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-btn" @click="resetForm">Vider</button>
            <button type="submit" class="primary-btn" :disabled="saving">
              {{ saving ? 'Creation...' : 'Creer la ressource' }}
            </button>
          </div>
        </form>
      </article>

      <article class="creator-panel">
        <div class="panel-header">
          <div>
            <h2>Mes ressources</h2>
            <p>Visible signifie consultable dans le catalogue public. Masquee signifie reservee a votre espace.</p>
          </div>
          <button type="button" class="refresh-btn" @click="loadMyResources" :disabled="loadingMine">
            {{ loadingMine ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>

        <div v-if="loadingMine" class="empty-state">Chargement de vos ressources...</div>
        <div v-else-if="myResources.length === 0" class="empty-state">
          Vous n'avez pas encore ajoute de ressource.
        </div>

        <div v-else class="creator-list">
          <article v-for="ressource in myResources" :key="ressource.id" class="creator-card">
            <div class="creator-card-main">
              <div class="creator-card-top">
                <span class="type-pill">{{ ressource.typeSupport || 'AUTRE' }}</span>
                <span class="status-pill" :class="statusClass(ressource.statut)">{{ formatStatus(ressource.statut) }}</span>
              </div>

              <h3>{{ ressource.titre }}</h3>
              <p>{{ ressource.description || 'Aucune description fournie.' }}</p>

              <div class="meta-line">
                <span v-if="ressource.niveauNom">{{ ressource.niveauNom }}</span>
                <span v-if="ressource.thematiqueNom">{{ ressource.thematiqueNom }}</span>
                <span>{{ visibilityLabel(ressource.visible) }}</span>
              </div>
            </div>

            <div class="creator-card-actions">
              <button
                type="button"
                class="visibility-btn"
                :class="{ hidden: !ressource.visible }"
                :title="ressource.visible ? 'Masquer la ressource' : 'Rendre la ressource visible'"
                @click="toggleVisibility(ressource)"
                :disabled="visibilityLoadingId === ressource.id"
              >
                <span class="visibility-icon" :class="{ hidden: !ressource.visible }"></span>
                <span>
                  {{ visibilityLoadingId === ressource.id ? 'Mise a jour...' : visibilityActionLabel(ressource.visible) }}
                </span>
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
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const formPanel = ref(null)
const niveaux = ref([])
const thematiques = ref([])
const tags = ref([])
const myResources = ref([])
const loadingMine = ref(true)
const saving = ref(false)
const visibilityLoadingId = ref(null)
const feedback = ref({ type: '', message: '' })

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
  droits: '',
  tagIds: []
})

const form = ref(emptyForm())

const resetForm = () => {
  form.value = emptyForm()
}

const toggleTag = (tagId) => {
  const selected = form.value.tagIds
  form.value.tagIds = selected.includes(tagId)
    ? selected.filter((id) => id !== tagId)
    : [...selected, tagId]
}

const loadOptions = async () => {
  const [niveauxResponse, thematiquesResponse, tagsResponse] = await Promise.all([
    api.get('/api/niveaux'),
    api.get('/api/thematiques'),
    api.get('/api/tags')
  ])

  niveaux.value = niveauxResponse.data || []
  thematiques.value = thematiquesResponse.data || []
  tags.value = tagsResponse.data || []
}

const loadMyResources = async () => {
  loadingMine.value = true
  try {
    const response = await api.get('/api/ressources/mes-ressources')
    myResources.value = response.data || []
  } catch (error) {
    myResources.value = []
    feedback.value = {
      type: 'error',
      message: "Impossible de charger vos ressources pour l'instant."
    }
  } finally {
    loadingMine.value = false
  }
}

const submitForm = async () => {
  saving.value = true
  feedback.value = { type: '', message: '' }

  try {
    const payload = {
      titre: form.value.titre,
      description: form.value.description || null,
      typeSupport: form.value.typeSupport,
      difficulte: form.value.difficulte || null,
      niveauId: form.value.niveauId ? Number(form.value.niveauId) : null,
      thematiqueId: form.value.thematiqueId ? Number(form.value.thematiqueId) : null,
      dureeMinutes: form.value.dureeMinutes ? Number(form.value.dureeMinutes) : null,
      urlAcces: form.value.urlAcces || null,
      objectifsPedagogiques: form.value.objectifsPedagogiques || null,
      competencesVisees: form.value.competencesVisees || null,
      usagePedagogique: form.value.usagePedagogique || null,
      droits: form.value.droits || null,
      tagIds: form.value.tagIds
    }

    await api.post('/api/ressources/creer', payload)
    feedback.value = {
      type: 'success',
      message: 'Ressource creee avec succes. Vous pouvez maintenant gerer sa visibilite.'
    }
    resetForm()
    await loadMyResources()
  } catch (error) {
    feedback.value = {
      type: 'error',
      message: error.response?.data?.message || error.response?.data || 'Erreur lors de la creation de la ressource.'
    }
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async (ressource) => {
  visibilityLoadingId.value = ressource.id
  feedback.value = { type: '', message: '' }

  try {
    const response = await api.put(`/api/ressources/${ressource.id}/visibilite`, {
      visible: !ressource.visible
    })

    myResources.value = myResources.value.map((item) =>
      item.id === ressource.id ? response.data : item
    )
  } catch (error) {
    feedback.value = {
      type: 'error',
      message: "La visibilite n'a pas pu etre modifiee."
    }
  } finally {
    visibilityLoadingId.value = null
  }
}

const scrollToForm = () => {
  formPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatStatus = (statut) => {
  const labels = {
    EN_ATTENTE: 'En attente',
    VALIDEE: 'Validee',
    REFUSEE: 'Refusee',
    ARCHIVEE: 'Archivee'
  }

  return labels[statut] || statut || 'Sans statut'
}

const statusClass = (statut) => `status-${String(statut || '').toLowerCase()}`
const visibilityLabel = (visible) => (visible ? 'Visible dans le catalogue' : 'Masquee')
const visibilityActionLabel = (visible) => (visible ? 'Masquer' : 'Rendre visible')

onMounted(async () => {
  try {
    await loadOptions()
  } finally {
    await loadMyResources()
  }
})
</script>

<style scoped>
.creator-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 20px 56px;
}

.creator-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: end;
  margin-bottom: 28px;
  padding: 32px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.22), transparent 28%),
    linear-gradient(135deg, #0f766e 0%, #155e75 45%, #1d4ed8 100%);
  color: white;
}

.hero-kicker {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.creator-hero h1 {
  margin: 0 0 12px;
  font-size: 2rem;
  line-height: 1.1;
}

.creator-hero p {
  margin: 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

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

.hero-link-secondary {
  background: rgba(255, 255, 255, 0.14);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.creator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 24px;
}

.creator-panel {
  padding: 24px;
  border-radius: 20px;
  background: white;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0 0 6px;
  font-size: 1.3rem;
}

.panel-header p {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
  line-height: 1.5;
}

.role-chip,
.refresh-btn {
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

.refresh-btn {
  cursor: pointer;
}

.creator-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.creator-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.creator-form label.full {
  grid-column: 1 / -1;
}

.creator-form span {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.creator-form input,
.creator-form select,
.creator-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  color: #0f172a;
  background: #f8fafc;
}

.creator-form input:focus,
.creator-form select:focus,
.creator-form textarea:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.12);
}

.tags-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
}

.tag-option.active {
  background: #0f766e;
  border-color: #0f766e;
  color: white;
}

.form-feedback {
  grid-column: 1 / -1;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
}

.form-feedback.success {
  background: #dcfce7;
  color: #166534;
}

.form-feedback.error {
  background: #fee2e2;
  color: #991b1b;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.primary-btn {
  background: linear-gradient(135deg, #0f766e, #1d4ed8);
  color: white;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
}

.empty-state {
  display: grid;
  place-items: center;
  min-height: 180px;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  color: #64748b;
  text-align: center;
  padding: 20px;
}

.creator-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.creator-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
}

.creator-card-top,
.meta-line,
.creator-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.creator-card-main h3 {
  margin: 12px 0 8px;
  font-size: 1rem;
}

.creator-card-main p {
  margin: 0 0 10px;
  color: #64748b;
  line-height: 1.55;
}

.meta-line {
  color: #475569;
  font-size: 0.82rem;
}

.meta-line span {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef2ff;
}

.type-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.type-pill {
  background: #e0f2fe;
  color: #0369a1;
}

.status-en_attente {
  background: #fef3c7;
  color: #92400e;
}

.status-validee {
  background: #dcfce7;
  color: #166534;
}

.status-refusee {
  background: #fee2e2;
  color: #991b1b;
}

.status-archivee {
  background: #e2e8f0;
  color: #334155;
}

.creator-card-actions {
  min-width: 160px;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.visibility-btn,
.card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

.visibility-btn.hidden {
  background: #fff7ed;
  color: #9a3412;
  border-color: #fdba74;
}

.visibility-icon {
  position: relative;
  width: 18px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 999px;
}

.visibility-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
}

.visibility-icon.hidden::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 7px;
  width: 2px;
  height: 18px;
  background: currentColor;
  transform: rotate(45deg);
}

@media (max-width: 1080px) {
  .creator-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .creator-page {
    padding: 20px 16px 40px;
  }

  .creator-hero,
  .panel-header,
  .creator-card {
    flex-direction: column;
    align-items: stretch;
  }

  .creator-form {
    grid-template-columns: 1fr;
  }

  .creator-form label.full {
    grid-column: auto;
  }

  .form-actions {
    justify-content: stretch;
    flex-direction: column;
  }
}
</style>
