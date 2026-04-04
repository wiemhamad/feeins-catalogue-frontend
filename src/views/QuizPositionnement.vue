<template>
  <div class="quiz-page">

    <!-- Fond spatial -->
    <div class="space-bg">
      <div class="nebula n1"></div>
      <div class="nebula n2"></div>
      <div class="nebula n3"></div>
      <div class="stars"></div>
    </div>

    <!-- ===== ÉTAPE 0 : ACCUEIL ===== -->
    <div v-if="etape === 0" class="quiz-accueil glass-card">
      <div class="brand">
        <div class="brand-logo">F</div>
        <span>FEEINS</span>
      </div>
      <div class="accueil-body">
        <h1>Positionnez-vous</h1>
        <p>Nous sélectionnons le contenu idéal pour votre parcours actuel.</p>
        <button @click="demarrer" class="btn-primary btn-large">
          Positionnez-vous &nbsp;›
        </button>
        <button class="btn-ghost" @click="$router.push('/catalogue')">
          Accéder aux ressources
        </button>
      </div>
    </div>

    <!-- ===== ÉTAPES QUESTIONS ===== -->
    <div v-else-if="etape <= questions.length" class="quiz-container glass-card">

      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">F</div>
        <span>FEEINS</span>
        <div class="brand-nav">
          <span v-for="i in questions.length" :key="i" class="nav-dot" :class="{ active: i === etape, done: i < etape }"></span>
        </div>
      </div>

      <!-- Progression -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: ((etape - 1) / questions.length * 100) + '%' }"></div>
      </div>

      <!-- Question -->
      <div class="question-block" :key="etape">
        <h2 class="question-titre">{{ questionActuelle.titre }}</h2>
        <p class="question-sub" v-if="questionActuelle.description">{{ questionActuelle.description }}</p>

        <div class="choix-grid" :class="{ 'choix-grid-2': questionActuelle.choix.length === 4 && questionActuelle.id === 'typeSupport' }">
          <button
            v-for="choix in questionActuelle.choix"
            :key="choix.valeur"
            class="choix-btn"
            :class="{ selected: reponseSelectionnee === choix.valeur }"
            @click="selectionnerReponse(choix.valeur)"
          >
            <div class="choix-left">
              <span class="choix-icone">{{ choix.icone }}</span>
              <div class="choix-text">
                <span class="choix-label">{{ choix.label }}</span>
                <span class="choix-detail" v-if="choix.detail">{{ choix.detail }}</span>
              </div>
            </div>
            <div class="choix-right">
              <span v-if="choix.badge" class="choix-badge" :class="'badge-' + choix.badge">{{ choix.badge }}</span>
              <div class="choix-check" :class="{ visible: reponseSelectionnee === choix.valeur }">✓</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="quiz-nav">
        <button v-if="etape > 1" @click="precedente" class="btn-ghost-sm">← Retour</button>
        <span v-else></span>
        <div class="nav-right">
          <button @click="suivante" class="btn-primary" :disabled="!reponseSelectionnee">
            {{ etape === questions.length ? 'Continuer' : 'Suivant' }} &nbsp;›
          </button>
          <button class="btn-skip" @click="passer">Passer le quiz</button>
        </div>
      </div>
    </div>

    <!-- ===== RÉSULTATS ===== -->
    <div v-else class="quiz-resultats glass-card">

      <div class="brand">
        <div class="brand-logo">F</div>
        <span>FEEINS</span>
      </div>

      <div class="profil-header">
        <div class="profil-badge">✦</div>
        <h2>Profil complété !</h2>
        <p>Voici vos recommandations personnalisées</p>
      </div>

      <!-- Image profil + info -->
      <div class="profil-info">
        <div class="profil-visual">
          <div class="profil-avatar">{{ profilDetecte.icone }}</div>
          <h3>{{ profilDetecte.titre }}</h3>
          <p>{{ profilDetecte.description }}</p>
          <div class="profil-tags">
            <span v-for="tag in profilDetecte.tags" :key="tag" class="ptag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Parcours recommandés -->
      <div class="recommandations">
        <h3>Parcours recommandés</h3>

        <div v-if="loadingRessources" class="loading-state">
          <div class="spinner"></div>
          <p>Recherche en cours...</p>
        </div>

        <div v-else-if="ressourcesRecommandees.length === 0" class="empty-state">
          <p>Aucune ressource trouvée. De nouvelles ressources arrivent bientôt !</p>
        </div>

        <div v-else class="reco-list">
          <div
            v-for="r in ressourcesRecommandees"
            :key="r.id"
            class="reco-item"
            @click="$router.push(`/ressource/${r.id}`)"
          >
            <div class="reco-icon" :style="{ background: iconBg(r.typeSupport) }">
              {{ iconeType(r.typeSupport) }}
            </div>
            <div class="reco-text">
              <span class="reco-titre">{{ r.titre }}</span>
              <span class="reco-meta">{{ r.dureeMinutes || 15 }} min · {{ labelDiff(r.difficulte) }}</span>
            </div>
            <div class="reco-type-badge" :style="{ background: iconBg(r.typeSupport) }">
              {{ r.typeSupport }}
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary btn-large" @click="$router.push('/catalogue')">
        Accéder à mon espace &nbsp;›
      </button>
      <button class="btn-ghost" @click="recommencer">🔄 Refaire le quiz</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const etape = ref(0)
const reponses = ref({})
const reponseSelectionnee = ref(null)
const ressourcesRecommandees = ref([])
const loadingRessources = ref(false)

const questions = ref([
  {
    id: 'objectif',
    titre: "Quel est votre objectif aujourd'hui ?",
    description: 'Nous sélectionnons le contenu idéal pour votre parcours actuel.',
    choix: [
      { valeur: 'consulter', label: 'Consulter les ressources', detail: 'Explorer le catalogue disponible', icone: '🔍' },
      { valeur: 'reviser',   label: 'Réviser / Apprendre',     detail: 'Tester et valider mes connaissances', icone: '📖' },
      { valeur: 'creer',     label: 'Créer / Publier du contenu', detail: 'Partager votre expertise à la communauté', icone: '✏️' },
      { valeur: 'expert',    label: 'Enseignant / Expert',     detail: 'Formation continue et pédagogie', icone: '🎓', badge: 'Expert' }
    ]
  },
  {
    id: 'niveau',
    titre: 'Quel est votre niveau ?',
    description: 'Nous filtrons les contenus adaptés pour vous.',
    choix: [
      { valeur: 1, label: 'Débutant',        detail: 'Je débute dans le numérique en santé', icone: '🌱', badge: 'Débutant' },
      { valeur: 2, label: 'Intermédiaire',   detail: "J'ai déjà des bases solides", icone: '📈', badge: 'Intermédiaire' },
      { valeur: 3, label: 'Avancé',          detail: 'Je suis à l\'aise dans ce domaine de compétence', icone: '🚀', badge: 'Avancé' },
      { valeur: 4, label: 'Enseignant / Expert', detail: 'Formation continue en santé numérique', icone: '👨‍🏫', badge: 'Expert' }
    ]
  },
  {
    id: 'dureeMax',
    titre: 'Combien de temps avez-vous ?',
    description: 'Nous adapterons la durée des ressources proposées.',
    choix: [
      { valeur: 10,  label: '5 - 10 min',    detail: 'Micro-learning rapide', icone: '⚡' },
      { valeur: 30,  label: '15 - 30 min',   detail: "Apprentissage d'appoint", icone: '⏱' },
      { valeur: 60,  label: '30 - 60 min',   detail: "Approfondissement d'un sujet", icone: '📚' },
      { valeur: 999, label: 'Plus d\'1h',    detail: 'Apprentissage expert', icone: '🎯' }
    ]
  },
  {
    id: 'typeSupport',
    titre: 'Préférence de format ?',
    description: 'Comment préférez-vous apprendre ?',
    choix: [
      { valeur: 'VIDEO', label: 'Vidéos',             icone: '🎥' },
      { valeur: 'QUIZ',  label: 'Quiz',               icone: '❓' },
      { valeur: 'H5P',   label: 'Modules Interactifs', icone: '🎮' },
      { valeur: 'PDF',   label: 'Documents PDF',       icone: '📄' },
      { valeur: null,    label: 'Tous les formats',   icone: '📦' }
    ]
  },
  {
    id: 'difficulte',
    titre: 'Quel niveau de difficulté adapté ?',
    description: 'Pour mieux filtrer les contenus par difficulté.',
    choix: [
      { valeur: 'DEBUTANT',      label: 'Débutant',       detail: 'Je découvre la santé numérique', icone: '🌱', badge: 'Débutant' },
      { valeur: 'intermediaire', label: 'Réviser / Apprendre', detail: 'Tester mes connaissances', icone: '📈' },
      { valeur: 'AVANCE',        label: "Créer / Publier du contenu", detail: 'Partager votre expertise', icone: '🚀' },
      { valeur: 'autre',         label: 'Autre',          detail: '', icone: '…' }
    ]
  },
  {
    id: 'thematique',
    titre: 'Quels domaines vous intéressent ?',
    description: 'Pour vous proposer les meilleurs contenus.',
    choix: [
      { valeur: 5, label: 'Télémédecine',  icone: '🏥' },
      { valeur: 3, label: 'Données médicales', icone: '🔒' },
      { valeur: 6, label: 'Anatomie',      icone: '🫀' },
      { valeur: 1, label: 'Réglementation', icone: '📋' }
    ]
  }
])

const questionActuelle = computed(() => questions.value[etape.value - 1])

const profils = [
  {
    icone: '🌱', titre: 'Apprenant débutant',
    description: 'Nous vous proposons des ressources accessibles pour construire vos bases.',
    tags: ['Débutant', 'Fondamentaux', 'Découverte'],
    condition: (r) => r.difficulte === 'DEBUTANT' || r.niveau === 1
  },
  {
    icone: '📈', titre: 'Apprenant intermédiaire',
    description: 'Approfondissez vos connaissances avec des ressources ciblées.',
    tags: ['Intermédiaire', 'Approfondissement'],
    condition: (r) => r.niveau === 2
  },
  {
    icone: '🚀', titre: 'Expert en formation',
    description: 'Accédez aux ressources les plus spécialisées.',
    tags: ['Avancé', 'Expert', 'Spécialisation'],
    condition: (r) => r.niveau === 3 || r.difficulte === 'AVANCE'
  },
  {
    icone: '👨‍🏫', titre: 'Enseignant / Professionnel',
    description: 'Des ressources pédagogiques pour enrichir vos cours.',
    tags: ['Professionnel', 'Pédagogie'],
    condition: (r) => r.niveau === 4
  }
]

const profilDetecte = computed(() => profils.find(p => p.condition(reponses.value)) || profils[0])

const demarrer = () => { etape.value = 1 }
const passer   = () => { router.push('/catalogue') }

const selectionnerReponse = (v) => { reponseSelectionnee.value = v }

const suivante = async () => {
  if (reponseSelectionnee.value === undefined || reponseSelectionnee.value === null) return
  reponses.value[questionActuelle.value.id] = reponseSelectionnee.value
  reponseSelectionnee.value = null
  if (etape.value < questions.value.length) {
    etape.value++
    reponseSelectionnee.value = reponses.value[questions.value[etape.value - 1].id] ?? null
  } else {
    etape.value++
    await chargerRessources()
  }
}

const precedente = () => {
  reponses.value[questionActuelle.value.id] = reponseSelectionnee.value
  etape.value--
  reponseSelectionnee.value = reponses.value[questions.value[etape.value - 1].id] ?? null
}

const recommencer = () => {
  etape.value = 0
  reponses.value = {}
  reponseSelectionnee.value = null
  ressourcesRecommandees.value = []
}

const chargerRessources = async () => {
  loadingRessources.value = true
  try {
    const r = reponses.value
    const criteres = {}
    if (r.niveau && r.niveau !== 4) criteres.niveauId = r.niveau
    if (r.thematique) criteres.thematiqueId = r.thematique
    if (r.typeSupport) criteres.typeSupport = r.typeSupport
    if (r.difficulte && !['intermediaire','autre'].includes(r.difficulte)) criteres.difficulte = r.difficulte
    if (r.dureeMax && r.dureeMax !== 999) criteres.dureeMax = r.dureeMax

    const res = await api.post('/api/ressources/rechercher', criteres)
    ressourcesRecommandees.value = res.data.slice(0, 4)
    if (ressourcesRecommandees.value.length === 0) {
      const res2 = await api.get('/api/ressources')
      ressourcesRecommandees.value = res2.data.slice(0, 4)
    }
  } catch { ressourcesRecommandees.value = [] }
  finally { loadingRessources.value = false }
}

const iconeType = (t) => ({ VIDEO:'🎥', H5P:'🎮', PDF:'📄', QUIZ:'❓', HTML:'🌐', LIEN:'🔗' }[t] || '📦')
const iconBg   = (t) => ({ VIDEO:'linear-gradient(135deg,#4facfe,#667eea)', H5P:'linear-gradient(135deg,#a855f7,#7c3aed)', PDF:'linear-gradient(135deg,#f87171,#ef4444)', QUIZ:'linear-gradient(135deg,#34d399,#059669)' }[t] || 'linear-gradient(135deg,#94a3b8,#64748b)')
const labelDiff = (d) => ({ DEBUTANT:'Débutant', INTERMEDIAIRE:'Intermédiaire', AVANCE:'Avancé' }[d] || d || '')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ===== BASE ===== */
* { box-sizing: border-box; }

.quiz-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}

/* ===== FOND SPATIAL ===== */
.space-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f0524 0%, #1a0a3e 30%, #0d1b4b 60%, #1a0533 100%);
  z-index: 0;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}


.n1 {
  width: 600px; height: 500px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.45) 0%, transparent 70%);
  top: -100px; right: -150px;
}
.n2 {
  width: 500px; height: 400px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.35) 0%, transparent 70%);
  bottom: -80px; left: -100px;
}
.n3 {
  width: 300px; height: 300px;
  background: radial-gradient(ellipse, rgba(236, 72, 153, 0.25) 0%, transparent 70%);
  top: 40%; left: 50%;
  transform: translate(-50%, -50%);
}
.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(1px 1px at 22% 38%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 38% 8%,  rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 52% 62%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 68% 22%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 78% 72%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 88% 42%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 14% 78%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 58% 88%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 33% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 72% 48%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 45% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 92% 18%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 5%  55%, rgba(255,255,255,0.4) 0%, transparent 100%);
}

/* ===== GLASS CARD ===== */
.glass-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
}

/* ===== BRAND ===== */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.brand-logo {
  width: 28px; height: 28px;
  background:  #D4FF00;
  border-radius: 7px;
  color: white;
  font-weight: 800;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
}
.brand span {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
  flex: 1;
}
.brand-nav {
  display: flex;
  gap: 5px;
  align-items: center;
}
.nav-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: all 0.3s;
}
.nav-dot.active { background: white; width: 18px; border-radius: 3px; }
.nav-dot.done   { background: rgba(139, 92, 246, 0.7); }

/* ===== PROGRESS ===== */
.progress-bar {
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  margin-bottom: 28px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #D4FF00;
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* ===== ACCUEIL ===== */
.accueil-body {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.accueil-body h1 {
  font-family: 'Syne', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin: 0;
}
.accueil-body p {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* ===== QUESTION ===== */
.question-block { animation: fadeSlide 0.3s ease; }
@keyframes fadeSlide {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}

.question-titre {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  margin: 0 0 6px;
  line-height: 1.3;
}
.question-sub {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.5);
  margin: 0 0 20px;
}

/* ===== CHOIX ===== */
.choix-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.choix-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.choix-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
  color: white;
}

.choix-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.choix-btn.selected {
  background: rgba(139, 92, 246, 0.25);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.4);
}

.choix-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.choix-icone { font-size: 1.2rem; flex-shrink: 0; }

.choix-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.choix-label {
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.choix-detail {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.choix-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.choix-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.badge-Débutant      { background: rgba(52, 211, 153, 0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
.badge-Intermédiaire { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
.badge-Avancé        { background: rgba(248, 113, 113, 0.2); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
.badge-Expert        { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }

.choix-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background:  #D4FF00;
  color: white;
  font-size: 11px;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: bold;
}
.choix-check.visible { opacity: 1; }

/* ===== NAV ===== */
.quiz-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* ===== BUTTONS ===== */
.btn-primary {
  background: linear-gradient(135deg, #D4FF00, #140F37);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 13px 28px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.5);
}
.btn-primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}
.btn-primary.btn-large {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  border-radius: 14px;
}

.btn-ghost {
  background: transparent;
  color: rgba(255,255,255,0.5);
  border: none;
  padding: 10px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.2s;
  text-align: center;
  width: 100%;
}
.btn-ghost:hover { color: rgba(255,255,255,0.8); }

.btn-ghost-sm {
  background: transparent;
  color: rgba(255,255,255,0.5);
  border: none;
  padding: 8px 0;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.2s;
}
.btn-ghost-sm:hover { color: rgba(255,255,255,0.8); }

.btn-skip {
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  font-size: 0.75rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.2s;
}
.btn-skip:hover { color: rgba(255,255,255,0.6); }

/* ===== RÉSULTATS ===== */
.profil-header {
  text-align: center;
  margin-bottom: 20px;
}
.profil-badge {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
  font-size: 20px;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}
.profil-header h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 4px;
}
.profil-header p {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.profil-info {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 20px;
}
.profil-avatar { font-size: 2.5rem; margin-bottom: 8px; }
.profil-info h3 {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 6px;
}
.profil-info p {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.5;
  margin: 0 0 10px;
}
.profil-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ptag {
  font-size: 11px;
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(139,92,246,0.3);
  padding: 3px 10px;
  border-radius: 20px;
}

/* ===== RECO ===== */
.recommandations { margin-bottom: 20px; }
.recommandations h3 {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reco-list { display: flex; flex-direction: column; gap: 8px; }

.reco-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.reco-item:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.18);
  transform: translateX(3px);
}

.reco-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.reco-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.reco-titre {
  font-size: 0.83rem;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.reco-meta {
  font-size: 0.73rem;
  color: rgba(255,255,255,0.4);
}

.reco-type-badge {
  font-size: 10px;
  font-weight: 700;
  color: white;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 24px;
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
}
.spinner {
  width: 28px; height: 28px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 20px;
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 520px) {
  .quiz-page { padding: 16px; align-items: flex-start; }
  .glass-card { padding: 24px 20px; }
  .choix-grid-2 { grid-template-columns: 1fr; }
}
</style>