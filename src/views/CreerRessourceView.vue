<template>
  <div class="creer-ressource">

    <!-- HEADER -->
    <div class="page-header">
      <button @click="router.push('/')" class="btn-retour">← Retour</button>
      <div>
        <h1> Créer une ressource pédagogique</h1>
        <p>La ressource sera soumise à validation avant publication</p>
      </div>
    </div>

    <!-- ALERTE SUCCÈS -->
    <div v-if="succes" class="alert-success">
      ✅ Ressource créée avec succès !
      Nomenclature : <strong>{{ nomenclatureCreee }}</strong>
      <br/>Elle est en attente de validation par un administrateur.
      <div style="margin-top:10px">
        <button @click="router.push('/')" class="btn-sm">Voir le catalogue</button>
        <button @click="resetForm" class="btn-sm btn-outline" style="margin-left:8px">
          Créer une autre ressource
        </button>
      </div>
    </div>

    <!-- ALERTE ERREUR -->
    <div v-if="erreur" class="alert-error">⚠️ {{ erreur }}</div>

    <!-- FORMULAIRE -->
    <form v-if="!succes" @submit.prevent="soumettre" class="form-card">

      <!-- SECTION 1 : INFORMATIONS DE BASE -->
      <div class="section">
        <h2 class="section-titre">📋 Informations de base</h2>

        <div class="form-group">
          <label class="required">Titre</label>
          <input
            v-model="form.titre"
            type="text"
            placeholder="ex: Introduction au RGPD en santé numérique"
            required
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="form.description"
            placeholder="Décrivez le contenu et les objectifs de cette ressource..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="required">Type de support</label>
            <select v-model="form.typeSupport" required>
              <option value="">-- Choisir --</option>
              <option value="VIDEO">🎥 Vidéo</option>
              <option value="H5P">🎮 H5P interactif</option>
              <option value="PDF">📄 PDF</option>
              <option value="QUIZ">❓ Quiz</option>
              <option value="HTML">🌐 HTML</option>
              <option value="LIEN">🔗 Lien externe</option>
              <option value="AUTRE">📦 Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Durée (minutes)</label>
            <input
              v-model.number="form.dureeMinutes"
              type="number"
              min="1"
              placeholder="ex: 15"
            />
          </div>
        </div>

        <div class="form-group">
          <label>URL d'accès (Moodle ou externe)</label>
          <input
            v-model="form.urlAcces"
            type="url"
            placeholder="https://moodle.univ-jfc.fr/mod/resource/view.php?id=..."
          />
        </div>
      </div>

      <!-- SECTION 2 : CLASSIFICATION PÉDAGOGIQUE -->
      <div class="section">
        <h2 class="section-titre">🎓 Classification pédagogique</h2>

        <div class="form-row">
          <div class="form-group">
            <label>Niveau cible</label>
            <select v-model="form.niveauId">
              <option value="">-- Tous niveaux --</option>
              <option v-for="n in niveaux" :key="n.id" :value="n.id">
                {{ n.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Thématique</label>
            <select v-model="form.thematiqueId">
              <option value="">-- Toutes thématiques --</option>
              <option v-for="t in thematiques" :key="t.id" :value="t.id">
                {{ t.nom }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Difficulté</label>
            <select v-model="form.difficulte">
              <option value="">-- Non définie --</option>
              <option value="DEBUTANT">🟢 Débutant</option>
              <option value="INTERMEDIAIRE">🟡 Intermédiaire</option>
              <option value="AVANCE">🔴 Avancé</option>
            </select>
          </div>

          <div class="form-group">
            <label>Template pédagogique</label>
            <select v-model="form.templateId">
              <option value="">-- Aucun --</option>
              <option v-for="t in templates" :key="t.id" :value="t.id">
                {{ t.nom }} {{ t.modifiable ? '(modifiable)' : '(clé en main)' }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Objectifs pédagogiques</label>
          <textarea
            v-model="form.objectifsPedagogiques"
            placeholder="ex: Comprendre les obligations RGPD dans le domaine de la santé..."
            rows="2"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Compétences visées</label>
          <textarea
            v-model="form.competencesVisees"
            placeholder="ex: Appliquer les principes RGPD à des cas concrets..."
            rows="2"
          ></textarea>
        </div>
      </div>

      <!-- SECTION 3 : USAGE PÉDAGOGIQUE -->
      <div class="section">
        <h2 class="section-titre">⚠️ Usage pédagogique</h2>

        <div class="form-group">
          <label class="required">Type d'usage</label>
          <select v-model="form.usagePedagogique" required>
            <option value="">-- Choisir l'usage --</option>
            <option value="COURS">📖 Cours</option>
            <option value="ACTIVITE">✏️ Activité</option>
            <option value="EVALUATION_FORMATIVE">
              ✅ Évaluation formative (avec réponses et feedbacks)
            </option>
            <option value="EVALUATION_SOMMATIVE">
              🔒 Évaluation sommative (SANS réponses)
            </option>
            <option value="RESSOURCE_COMPLEMENTAIRE">
              📎 Ressource complémentaire
            </option>
            <option value="QUIZ_POSITIONNEMENT">🎯 Quiz de positionnement</option>
          </select>

          <!-- AVERTISSEMENT ÉVALUATION SOMMATIVE -->
          <div
            v-if="form.usagePedagogique === 'EVALUATION_SOMMATIVE'"
            class="alerte-sommative"
          >
            🚨 ATTENTION — Évaluation sommative<br/>
            Cette ressource <strong>NE DOIT PAS</strong> contenir les réponses,
            les corrections ni les feedbacks.<br/>
            Elle est utilisée comme certification ou évaluation finale.
            Vérifiez soigneusement avant de soumettre.
          </div>
        </div>

        <div class="form-group">
          <label>Utilisé dans Moodle (cours concernés)</label>
          <input
            v-model="form.usageMoodle"
            type="text"
            placeholder="ex: SIS-L3-CM1, Master-IA-TD2, Parcours-Decouvrir"
          />
          <small class="hint">
            Listez les cours Moodle qui utilisent cette ressource pour éviter les doublons.
          </small>
        </div>
      </div>

      <!-- SECTION 4 : TAGS -->
      <div class="section">
        <h2 class="section-titre">🏷️ Tags</h2>
        <p class="section-desc">
          Les tags sont essentiels pour retrouver et réutiliser les ressources.
        </p>

        <div class="tags-container">
          <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            :class="['tag-btn', form.tagIds.includes(tag.id) ? 'tag-actif' : '']"
            @click="toggleTag(tag.id)"
          >
            #{{ tag.libelle }}
          </button>
        </div>

        <div class="tags-selectionnes" v-if="form.tagIds.length > 0">
          <span>{{ form.tagIds.length }} tag(s) sélectionné(s)</span>
        </div>
      </div>

      <!-- SECTION 5 : DROITS ET AUTEUR -->
      <div class="section">
        <h2 class="section-titre">📜 Droits et auteur</h2>

        <div class="form-row">
          <div class="form-group">
            <label>Droits d'utilisation</label>
            <select v-model="form.droits">
              <option value="FEEINS_INTERNE">🔒 FEEINS interne</option>
              <option value="LIBRE">✅ Libre</option>
              <option value="PARTENAIRE">🤝 Partenaire</option>
              <option value="SOUS_LICENCE">📋 Sous licence</option>
            </select>
          </div>

          <div class="form-group">
            <label>Auteur / Partenaire</label>
            <input
              v-model="form.auteurPartenaire"
              type="text"
              placeholder="ex: ANAP, ISIS, Univ. JFC..."
            />
          </div>
        </div>
      </div>

      <!-- BOUTON SOUMETTRE -->
      <div class="form-actions">
        <button type="button" @click="router.push('/')" class="btn-annuler">
          Annuler
        </button>
        <button type="submit" class="btn-soumettre" :disabled="loading">
          {{ loading ? 'Création en cours...' : '✅ Soumettre pour validation' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const loading = ref(false)
const succes = ref(false)
const erreur = ref('')
const nomenclatureCreee = ref('')

const niveaux = ref([])
const thematiques = ref([])
const tags = ref([])
const templates = ref([])

const form = ref({
  titre: '',
  description: '',
  typeSupport: '',
  dureeMinutes: null,
  urlAcces: '',
  niveauId: '',
  thematiqueId: '',
  difficulte: '',
  templateId: '',
  objectifsPedagogiques: '',
  competencesVisees: '',
  tagIds: [],
  usagePedagogique: '',
  usageMoodle: '',
  droits: 'FEEINS_INTERNE',
  auteurPartenaire: ''
})

onMounted(async () => {
  // Vérifier que l'utilisateur est connecté et a le bon rôle
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.role || (user.role !== 'ENSEIGNANT' && user.role !== 'ADMINISTRATEUR_PEDAGOGIQUE')) {
    router.push('/login')
    return
  }

  // Charger les référentiels
  try {
    const [n, t, tg, tp] = await Promise.all([
      api.get('/api/niveaux'),
      api.get('/api/thematiques'),
      api.get('/api/tags'),
      api.get('/api/templates')
    ])
    niveaux.value = n.data
    thematiques.value = t.data
    tags.value = tg.data
    templates.value = tp.data
  } catch (err) {
    console.error('Erreur chargement référentiels:', err)
  }
})

const toggleTag = (tagId) => {
  const index = form.value.tagIds.indexOf(tagId)
  if (index === -1) {
    form.value.tagIds.push(tagId)
  } else {
    form.value.tagIds.splice(index, 1)
  }
}

const soumettre = async () => {
  erreur.value = ''
  loading.value = true

  try {
    const payload = {
      ...form.value,
      niveauId: form.value.niveauId || null,
      thematiqueId: form.value.thematiqueId || null,
      templateId: form.value.templateId || null,
      difficulte: form.value.difficulte || null,
      dureeMinutes: form.value.dureeMinutes || null
    }

    const response = await api.post('/api/ressources/creer', payload)
    nomenclatureCreee.value = response.data.nomenclature
    succes.value = true
    window.scrollTo(0, 0)

  } catch (err) {
    if (err.response?.status === 403) {
      erreur.value = 'Accès refusé. Vous devez être enseignant ou administrateur.'
    } else {
      erreur.value = err.response?.data?.message || err.response?.data || 'Erreur lors de la création'
    }
    window.scrollTo(0, 0)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  succes.value = false
  erreur.value = ''
  nomenclatureCreee.value = ''
  form.value = {
    titre: '',
    description: '',
    typeSupport: '',
    dureeMinutes: null,
    urlAcces: '',
    niveauId: '',
    thematiqueId: '',
    difficulte: '',
    templateId: '',
    objectifsPedagogiques: '',
    competencesVisees: '',
    tagIds: [],
    usagePedagogique: '',
    usageMoodle: '',
    droits: 'FEEINS_INTERNE',
    auteurPartenaire: ''
  }
}
</script>

<style scoped>
.creer-ressource {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}
.page-header h1 {
  font-size: 1.5rem;
  color: #4ddb34;
  margin-bottom: 8px;
}
.page-header p { color:#ffffff; font-size: 0.9rem; }

.btn-retour {
  padding: 8px 16px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #9dc010;
  white-space: nowrap;
  flex-shrink: 0;
}

.alert-success {
  background: var(--color-background-success);
  color: var(--color-text-success);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  line-height: 1.6;
}
.alert-error {
  background: var(--color-background-danger);
  color: var(--color-text-danger);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-card {
  background: var(--color-background-primary);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 2px 12px #D4FF00;
  overflow: hidden;
}

.section {
  padding: 25px 30px;
  border-bottom: 1px solid var(--color-border-tertiary);
}
.section:last-child { border-bottom: none; }

.section-titre {
  font-size: 1rem;
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 18px;
}
.section-desc {
  font-size: 13px;
  color: #3498db;
  margin-bottom: 15px;
  margin-top: -12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
}
.form-group:last-child { margin-bottom: 0; }

label {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
}
label.required::after {
  content: ' *';
  color: var(--color-text-danger);
}

input, select, textarea {
  padding: 10px 12px;
  border: 1.5px solid var(--color-border-tertiary);
  border-radius: 8px;
  font-size: 14px;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  transition: border-color 0.2s;
  font-family: inherit;
}
input:focus, select:focus, textarea:focus {
  border-color: #4ddb34;
  outline: none;
}
textarea { resize: vertical; }

.hint {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Avertissement évaluation sommative */
.alerte-sommative {
  margin-top: 10px;
  padding: 14px;
  background: var(--color-background-danger);
  color: var(--color-text-danger);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  border-left: 4px solid var(--color-border-danger);
  border-radius: 0 8px 8px 0;
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.tag-btn {
  padding: 5px 12px;
  border: 1.5px solid var(--color-border-tertiary);
  border-radius: 20px;
  background: var(--color-background-primary);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.tag-btn:hover {
  border-color: #3498db;
  color: #3498db;
}
.tag-actif {
  background: #2c3e50 !important;
  color: white !important;
  border-color: #2c3e50 !important;
}
.tags-selectionnes {
  font-size: 12px;
  color: #3498db;
  font-weight: 500;
}

/* Actions */
.form-actions {
  padding: 20px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: var(--color-background-secondary);
}
.btn-annuler {
  padding: 12px 24px;
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-tertiary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-secondary);
}
.btn-soumettre {
  padding: 12px 28px;
  background: #9dc010;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-soumettre:hover:not(:disabled) { background: #3498db; }
.btn-soumettre:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-sm {
  padding: 8px 16px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-outline {
  background: transparent;
  border: 1px solid currentColor;
  color: var(--color-text-success);
}
/* ===== FIX VISIBILITÉ INPUTS (IMPORTANT) ===== */
input,
select,
textarea {
  background-color: rgba(255,255,255,0.08) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

/* placeholder */
input::placeholder,
textarea::placeholder {
  color: #cbd5e1 !important;
}

/* select texte */
select {
  color: #ffffff !important;
}

/* options dropdown */
select option {
  background-color: #1e1e3f !important;
  color: white !important;
}
</style>