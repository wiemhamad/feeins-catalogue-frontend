<template>
  <div class="home">

    <!-- ===== HERO SECTION ===== -->
    <section class="hero">
      <div class="stars"></div>
      <div class="nebula nebula-1"></div>
      <div class="nebula nebula-2"></div>

      <div class="hero-content">
        <div class="role-cards">

          <!-- Carte Apprenant -->
          <div
            class="role-card card-learner"
            :class="{ selected: selectedRole === 'apprenant' }"
            @click="selectRole('apprenant')"
          >
            <div class="card-icon icon-blue">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <h2>Je suis apprenant</h2>
            <p>Étudiants ou enseignant souhaitant consulter et suivre des ressources en e-santé</p>
            <ul>
              <li>Explorer des cours</li>
              <li>Suivre une progression</li>
              <li>Valider des quiz interactifs H5P</li>
              <li>Suivre ses statistiques de progression</li>
            </ul>
            <button class="role-btn btn-learner" @click.stop="handleRoleAction('apprenant')">
              <span>Accéder au catalogue</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- Carte Créateur -->
          <div
            class="role-card card-creator"
            :class="{ selected: selectedRole === 'createur' }"
            @click="selectRole('createur')"
          >
            <div class="card-badge">Code requis</div>
            <div class="card-icon icon-purple">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
            </div>
            <h2>Je suis créateur</h2>
            <p>Enseignant souhaitant créer et proposer des cours à mes élèves</p>
            <ul>
              <li>Créer des cours</li>
              <li>Ajouter du contenu pédagogique</li>
              <li>Proposer des cours à vos élèves</li>
            </ul>
            <button class="role-btn btn-creator" @click.stop="handleRoleAction('createur')">
              <span>Créer une ressource</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== FEATURES SECTION ===== -->
    <section class="features">
      <div class="feature-card feature-orange">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div>
          <h3>Bibliothèque Riche</h3>
          <p>Plus de 500 grains pédagogiques</p>
        </div>
      </div>

      <div class="feature-card feature-teal">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
          </svg>
        </div>
        <div>
          <h3>Contenus Structurés</h3>
          <p>Classés par niveau et thématique</p>
        </div>
      </div>

      <div class="feature-card feature-purple">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7l-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3z"/>
          </svg>
        </div>
        <div>
          <h3>Accès Rapide</h3>
          <p>Recherche instantanée et intuitive</p>
        </div>
      </div>
    </section>

    <!-- ===== CATALOGUE SECTION ===== -->
    <section class="catalogue-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">VOUS L'ADOREZ ! ✨</h2>
          <p class="section-subtitle">Découvrez les outils recommandés de la communauté enseignante.</p>
        </div>
        <router-link to="/catalogue" class="btn-voir-tout">
          Voir tout le catalogue →
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-cards">
        <div v-for="i in 3" :key="i" class="card-skeleton"></div>
      </div>

      <!-- Ressources -->
      <div v-else class="ressources-grid">
        <div
          v-for="ressource in ressourcesVedette"
          :key="ressource.id"
          class="ressource-card"
          @click="$router.push(`/ressource/${ressource.id}`)"
        >
          <div class="ressource-card-top">
            <div class="ressource-icon" :style="{ background: iconBg(ressource.typeSupport) }">
              <span>{{ iconeType(ressource.typeSupport) }}</span>
            </div>
            <div class="ressource-sparkle">✦</div>
            <span class="badge-difficulte" :class="diffClass(ressource.difficulte)">
              {{ ressource.difficulte || 'Débutant' }}
              <span v-if="ressource.difficulte === 'INTERMEDIAIRE'"> ▼</span>
            </span>
          </div>

          <h3 class="ressource-titre">{{ ressource.titre }}</h3>
          <p class="ressource-desc">{{ ressource.description }}</p>

          <div class="ressource-tags">
            <span v-for="tag in (ressource.tags || []).slice(0, 3)" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>

          <div class="ressource-footer">
            <span class="ressource-duree">
              <svg v-if="ressource.typeSupport !== 'QUIZ'" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span v-if="ressource.typeSupport === 'QUIZ'">{{ ressource.dureeMinutes || 10 }} questions</span>
              <span v-else>{{ ressource.dureeMinutes || 15 }} min</span>
            </span>
            <router-link :to="`/ressource/${ressource.id}`" class="link-ressource" @click.stop>
              Voir la ressource →
            </router-link>
          </div>
        </div>

        <!-- Cartes placeholder si pas assez de ressources -->
        <div
          v-for="i in Math.max(0, 3 - ressourcesVedette.length)"
          :key="`placeholder-${i}`"
          class="ressource-card card-placeholder"
        >
          <div class="placeholder-content">
            <div class="placeholder-icon">📚</div>
            <p>Bientôt disponible</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const selectedRole = ref(null)
const ressourcesVedette = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/api/ressources')
    ressourcesVedette.value = res.data.slice(0, 3)
  } catch (e) {
    ressourcesVedette.value = []
  } finally {
    loading.value = false
  }
})

const selectRole = (role) => {
  selectedRole.value = role
}

const handleRoleAction = (role) => {
  if (role === 'apprenant') {
    router.push('/catalogue')
  } else if (role === 'createur') {
    router.push('/login')
  }
}

const iconeType = (type) => {
  const map = { VIDEO: '🎥', H5P: '🎮', PDF: '📄', QUIZ: '❓', HTML: '🌐', LIEN: '🔗' }
  return map[type] || '📦'
}

const iconBg = (type) => {
  const map = {
    VIDEO: 'linear-gradient(135deg, #667eea, #764ba2)',
    H5P: 'linear-gradient(135deg, #f093fb, #f5576c)',
    PDF: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    QUIZ: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    HTML: 'linear-gradient(135deg, #fa709a, #fee140)',
    LIEN: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  }
  return map[type] || 'linear-gradient(135deg, #667eea, #764ba2)'
}

const diffClass = (diff) => {
  return {
    DEBUTANT: 'diff-debutant',
    INTERMEDIAIRE: 'diff-intermediaire',
    AVANCE: 'diff-avance',
  }[diff] || 'diff-debutant'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.home {
  font-family: 'DM Sans', sans-serif;
  background: #f7f8fc;
  min-height: 100vh;
}

/* ===== HERO ===== */
.hero {
  position: relative;
  min-height: 420px;
  background: radial-gradient(ellipse at 20% 50%, #1a0533 0%, #0d0820 40%, #0a1628 70%, #1a0a2e 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 40px;
}

/* Stars effect */
.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.9) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 25%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 80% 70%, rgba(255,255,255,0.8) 0%, transparent 100%),
    radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 35% 65%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 50%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 50% 45%, rgba(255,255,255,0.5) 0%, transparent 100%);
  pointer-events: none;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.nebula-1 {
  width: 500px; height: 400px;
  background: radial-gradient(ellipse, rgba(220, 80, 30, 0.35) 0%, transparent 70%);
  right: -100px; top: -50px;
}
.nebula-2 {
  width: 350px; height: 300px;
  background: radial-gradient(ellipse, rgba(80, 30, 180, 0.3) 0%, transparent 70%);
  left: 5%; bottom: -80px;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
}

.role-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* ===== ROLE CARDS ===== */
.role-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  padding: 28px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.role-card.selected {
  box-shadow: 0 0 0 2px #667eea, 0 16px 48px rgba(0, 0, 0, 0.4);
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.icon-blue { background: linear-gradient(135deg, #4facfe, #667eea); }
.icon-purple { background: linear-gradient(135deg, #a855f7, #7c3aed); }

.role-card h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.role-card p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 14px;
}

.role-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}

.role-card ul li {
  font-size: 0.83rem;
  color: #444;
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.role-card ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.card-creator ul li::before { color: #a855f7; }

.role-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}

.btn-learner {
  background: linear-gradient(135deg, #4facfe, #667eea);
  color: white;
}
.btn-learner:hover { opacity: 0.9; transform: translateX(2px); }

.btn-creator {
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: white;
}
.btn-creator:hover { opacity: 0.9; transform: translateX(2px); }

/* ===== FEATURES ===== */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 32px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-card {
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-orange {
  background: linear-gradient(135deg, #fff7ed, #fed7aa);
  border: 1px solid #fb923c22;
}
.feature-teal {
  background: linear-gradient(135deg, #f0fdf4, #bbf7d0);
  border: 1px solid #22c55e22;
}
.feature-purple {
  background: linear-gradient(135deg, #faf5ff, #e9d5ff);
  border: 1px solid #a855f722;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-orange .feature-icon { background: #fb923c22; color: #ea580c; }
.feature-teal .feature-icon   { background: #22c55e22; color: #16a34a; }
.feature-purple .feature-icon { background: #a855f722; color: #7c3aed; }

.feature-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.feature-card p {
  font-size: 0.8rem;
  color: #666;
}

/* ===== CATALOGUE SECTION ===== */
.catalogue-section {
  padding: 20px 40px 60px;
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.section-subtitle {
  font-size: 0.88rem;
  color: #666;
}

.btn-voir-tout {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-voir-tout:hover {
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(102,126,234,0.15);
}

/* ===== RESSOURCE CARDS ===== */
.ressources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ressource-card {
  background: white;
  border-radius: 18px;
  padding: 22px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f5;
  display: flex;
  flex-direction: column;
}

.ressource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.ressource-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.ressource-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.ressource-sparkle {
  color: #f59e0b;
  font-size: 16px;
  flex: 1;
}

.badge-difficulte {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}
.diff-debutant     { background: #dcfce7; color: #16a34a; }
.diff-intermediaire { background: #fef9c3; color: #ca8a04; }
.diff-avance       { background: #fee2e2; color: #dc2626; }

.ressource-titre {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  line-height: 1.3;
}

.ressource-desc {
  font-size: 0.82rem;
  color: #888;
  line-height: 1.5;
  margin-bottom: 14px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ressource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  font-size: 11px;
  color: #6366f1;
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 6px;
}

.ressource-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f5;
}

.ressource-duree {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.link-ressource {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  text-decoration: none;
}
.link-ressource:hover { text-decoration: underline; }

/* Loading skeleton */
.loading-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card-skeleton {
  height: 260px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 18px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Placeholder */
.card-placeholder {
  border: 2px dashed #e5e7eb;
  box-shadow: none;
  cursor: default;
  background: #fafafa;
}

.card-placeholder:hover {
  transform: none;
  box-shadow: none;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  gap: 10px;
  color: #ccc;
}

.placeholder-icon { font-size: 36px; opacity: 0.4; }
.placeholder-content p { font-size: 0.85rem; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .role-cards { grid-template-columns: 1fr; }
  .features { grid-template-columns: 1fr; padding: 24px 20px; }
  .ressources-grid { grid-template-columns: 1fr; }
  .catalogue-section { padding: 20px; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 12px; }
  .hero { padding: 30px 20px; }
}
</style>