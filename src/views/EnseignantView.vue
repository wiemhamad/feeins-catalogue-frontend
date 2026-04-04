<template>
  <div class="enseignant-page">

    <section class="enseignant-hero">
      <div>
        <span class="hero-kicker">👨‍🏫 Espace Enseignant</span>
        <h1>Créez et gérez vos templates pédagogiques</h1>
        <p>
          En tant qu'enseignant, vous composez des <strong>templates</strong> à partir de
          ressources validées existantes dans le catalogue. Vous ne créez pas de ressources directement —
          c'est le rôle du contributeur.
        </p>
      </div>
      <div class="hero-actions">
        <RouterLink to="/catalogue" class="hero-link hero-link-secondary">Voir le catalogue</RouterLink>
      </div>
    </section>

    <!-- FEEDBACK -->
    <div v-if="feedback.message" class="feedback-bar" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <section class="enseignant-layout">

      <!-- FORMULAIRE TEMPLATE -->
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Nouveau template</h2>
            <p>Un template est un modèle de scénario pédagogique réutilisable basé sur des ressources validées.</p>
          </div>
          <span class="role-chip">{{ authStore.userDisplayName }}</span>
        </div>

        <form @submit.prevent="creerTemplate" class="template-form">

          <div class="form-group">
            <label>Nom du template *</label>
            <input
              v-model="form.nom"
              type="text"
              placeholder="ex: Capsule vidéo + Quiz, Cours 30 min clé en main..."
              required
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Décrivez le scénario pédagogique de ce template..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Type</label>
            <select v-model="form.modifiable">
              <option :value="true">🔓 Modifiable (peut être adapté par l'enseignant)</option>
              <option :value="false">🔒 Clé en main (non modifiable)</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetForm">Vider</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Création...' : '📋 Créer le template' }}
            </button>
          </div>
        </form>
      </article>

      <!-- MES TEMPLATES -->
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Mes templates</h2>
            <p>Templates que vous avez créés pour structurer vos scénarios pédagogiques.</p>
          </div>
          <button class="refresh-btn" @click="chargerTemplates" :disabled="loading">
            {{ loading ? '...' : '↻ Actualiser' }}
          </button>
        </div>

        <div v-if="loading" class="empty-state">Chargement...</div>
        <div v-else-if="templates.length === 0" class="empty-state">
          Vous n'avez pas encore créé de template.
        </div>

        <div v-else class="template-list">
          <div v-for="t in templates" :key="t.id" class="template-card">
            <div class="template-card-top">
              <span class="modif-pill" :class="t.modifiable ? 'modif-yes' : 'modif-no'">
                {{ t.modifiable ? '🔓 Modifiable' : '🔒 Clé en main' }}
              </span>
            </div>
            <h3>{{ t.nom }}</h3>
            <p>{{ t.description || 'Aucune description.' }}</p>

            <div class="template-actions">
              <button @click="modifierTemplate(t)" class="btn-edit">✏️ Modifier</button>
              <span class="template-meta">
                {{ t.ressources?.length || 0 }} ressource(s) associée(s)
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- MODAL MODIFICATION -->
    <div v-if="templateEnEdition" class="modal-overlay" @click.self="templateEnEdition = null">
      <div class="modal">
        <h3>Modifier le template</h3>
        <div class="form-group">
          <label>Nom</label>
          <input v-model="templateEnEdition.nom" type="text" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="templateEnEdition.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Type</label>
          <select v-model="templateEnEdition.modifiable">
            <option :value="true">🔓 Modifiable</option>
            <option :value="false">🔒 Clé en main</option>
          </select>
        </div>
        <div class="modal-actions">
          <button @click="templateEnEdition = null" class="btn-secondary">Annuler</button>
          <button @click="sauvegarderModification" class="btn-primary" :disabled="saving">
            {{ saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const templates = ref([])
const loading = ref(false)
const saving = ref(false)
const feedback = ref({ type: '', message: '' })
const templateEnEdition = ref(null)

const form = ref({ nom: '', description: '', modifiable: true })
const resetForm = () => { form.value = { nom: '', description: '', modifiable: true } }

const chargerTemplates = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/templates')
    templates.value = data || []
  } catch {
    feedback.value = { type: 'error', message: 'Impossible de charger les templates.' }
  } finally {
    loading.value = false
  }
}

const creerTemplate = async () => {
  saving.value = true
  feedback.value = { type: '', message: '' }
  try {
    await api.post('/api/templates', form.value)
    feedback.value = { type: 'success', message: '✅ Template créé avec succès !' }
    resetForm()
    await chargerTemplates()
  } catch (err) {
    if (err.response?.status === 403) {
      feedback.value = { type: 'error', message: '🚫 Accès refusé. Vous devez être enseignant.' }
    } else {
      feedback.value = { type: 'error', message: 'Erreur lors de la création.' }
    }
  } finally {
    saving.value = false
  }
}

const modifierTemplate = (t) => {
  templateEnEdition.value = { ...t }
}

const sauvegarderModification = async () => {
  saving.value = true
  try {
    await api.put(`/api/templates/${templateEnEdition.value.id}`, templateEnEdition.value)
    feedback.value = { type: 'success', message: '✅ Template mis à jour.' }
    templateEnEdition.value = null
    await chargerTemplates()
  } catch {
    feedback.value = { type: 'error', message: 'Erreur lors de la modification.' }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!authStore.canCreateTemplate) {
    router.push('/login')
    return
  }
  await chargerTemplates()
})
</script>

<style scoped>
.enseignant-page { max-width: 1200px; margin: 0 auto; padding: 32px 20px 56px; }

.enseignant-hero {
  display: flex; justify-content: space-between; gap: 24px; align-items: end;
  margin-bottom: 28px; padding: 32px; border-radius: 24px; color: white;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #0ea5e9 100%);
}
.hero-kicker {
  display: inline-flex; margin-bottom: 12px; padding: 6px 12px;
  border-radius: 999px; background: rgba(255,255,255,0.15);
  font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em;
}
.enseignant-hero h1 { margin: 0 0 12px; font-size: 1.9rem; line-height: 1.1; }
.enseignant-hero p { margin: 0; max-width: 680px; color: rgba(255,255,255,0.9); font-size: 0.95rem; }
.hero-actions { display: flex; gap: 12px; }
.hero-link {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px;
  border-radius: 999px; border: none; background: #fff; color: #0f172a;
  font-weight: 700; cursor: pointer; text-decoration: none;
}
.hero-link-secondary { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); }

.feedback-bar {
  padding: 14px 20px; border-radius: 12px; margin-bottom: 20px; font-weight: 600;
}
.feedback-bar.success { background: #dcfce7; color: #166534; }
.feedback-bar.error { background: #fee2e2; color: #991b1b; }

.enseignant-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

.panel { padding: 24px; border-radius: 20px; background: white; border: 1px solid #dbe4f0; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
.panel-header { display: flex; justify-content: space-between; align-items: start; gap: 16px; margin-bottom: 20px; }
.panel-header h2 { margin: 0 0 5px; font-size: 1.2rem; }
.panel-header p { margin: 0; color: #64748b; font-size: 0.88rem; line-height: 1.5; }

.role-chip, .refresh-btn {
  display: inline-flex; align-items: center; min-height: 36px; padding: 0 14px;
  border-radius: 999px; background: #f3e8ff; color: #7c3aed;
  font-size: 0.85rem; font-weight: 700; border: none; font-family: inherit;
}
.refresh-btn { cursor: pointer; }

.template-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.85rem; font-weight: 700; color: #334155; }
.form-group input, .form-group select, .form-group textarea {
  border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px;
  font: inherit; color: #0f172a; background: #f8fafc; width: 100%;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none; border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
}

.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
.btn-primary, .btn-secondary {
  min-height: 42px; padding: 0 18px; border-radius: 12px;
  border: none; font-weight: 700; cursor: pointer; font-family: inherit;
}
.btn-primary { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; }
.btn-secondary { background: #e2e8f0; color: #0f172a; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.empty-state {
  display: grid; place-items: center; min-height: 160px;
  border: 1px dashed #cbd5e1; border-radius: 16px; color: #94a3b8; padding: 20px;
}

.template-list { display: flex; flex-direction: column; gap: 12px; }
.template-card {
  padding: 16px; border-radius: 14px;
  background: linear-gradient(180deg, #ffffff, #faf5ff);
  border: 1px solid #e9d5ff;
}
.template-card-top { margin-bottom: 8px; }
.modif-pill {
  display: inline-flex; align-items: center; padding: 3px 10px;
  border-radius: 999px; font-size: 0.75rem; font-weight: 700;
}
.modif-yes { background: #dcfce7; color: #166534; }
.modif-no { background: #fef3c7; color: #92400e; }
.template-card h3 { margin: 0 0 6px; font-size: 1rem; color: #1e1b4b; }
.template-card p { margin: 0 0 12px; color: #64748b; font-size: 0.88rem; }
.template-actions { display: flex; align-items: center; gap: 10px; }
.btn-edit {
  padding: 6px 14px; border-radius: 8px; border: 1px solid #c4b5fd;
  background: #f3e8ff; color: #7c3aed; font-weight: 600; cursor: pointer; font-size: 13px;
}
.template-meta { font-size: 12px; color: #94a3b8; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal {
  background: white; border-radius: 20px; padding: 32px;
  width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 16px;
}
.modal h3 { margin: 0 0 4px; font-size: 1.2rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }

@media (max-width: 900px) { .enseignant-layout { grid-template-columns: 1fr; } }
</style>
