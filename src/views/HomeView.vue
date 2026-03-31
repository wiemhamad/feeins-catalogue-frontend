<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="space-background">
        <div class="glow glow-left"></div>
        <div class="glow glow-right"></div>
      </div>

      <!-- Barre de recherche centrale -->
      <div class="search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Rechercher des ressources pédagogiques..."
              class="search-input"
            />
            <button @click="performSearch" class="search-btn">
              <span class="search-icon">🔍</span>
            </button>
          </div>
          <p class="search-hint">Tapez un mot-clé, un thème ou un format (vidéo, quiz, PDF...)</p>
        </div>
      </div>

      <div class="hero-cards">
        <article class="profile-card">
          <div class="profile-icon blue">🎓</div>
          <h2>Je suis apprenant</h2>
          <p>Etudiants ou enseignants souhaitant consulter et suivre des ressources en e-sante.</p>
          <ul>
            <li>Explorer des cours</li>
            <li>Visionner des videos</li>
            <li>Reviser des quiz H5P</li>
            <li>Suivre sa progression</li>
          </ul>
          <RouterLink to="/catalogue" class="profile-link">Acceder au catalogue</RouterLink>
        </article>

        <article class="profile-card">
          <div class="profile-icon purple">🧠</div>
          <span class="small-badge">Code requis</span>
          <h2>Je suis createur</h2>
          <p>Enseignants souhaitant creer et proposer des cours a leurs eleves.</p>
          <ul>
            <li>Creer des cours</li>
            <li>Ajouter du contenu pedagogique</li>
            <li>Proposer des cours a vos eleves</li>
          </ul>
          <RouterLink to="/login" class="profile-link">Se connecter</RouterLink>
        </article>
      </div>
    </section>

    <section class="features-section">
      <article class="feature-card orange">
        <div class="feature-icon">📁</div>
        <div>
          <h3>Bibliotheque Riche</h3>
          <p>Plus de 500 grains pedagogiques</p>
        </div>
      </article>

      <article class="feature-card green">
        <div class="feature-icon">📚</div>
        <div>
          <h3>Contenus Structures</h3>
          <p>Classes par theme et niveau</p>
        </div>
      </article>

      <article class="feature-card purple">
        <div class="feature-icon">⚡</div>
        <div>
          <h3>Acces Rapide</h3>
          <p>Recherche instantanee et intuitive</p>
        </div>
      </article>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <div>
          <h2>VOUS L'ADOREZ !</h2>
          <p>Decouvrez les outils recommandes de la communaute enseignante.</p>
        </div>
        <RouterLink to="/catalogue" class="see-all-link">Voir tout le catalogue</RouterLink>
      </div>

      <div v-if="loading" class="empty-panel">
        Chargement des ressources...
      </div>

      <div v-else-if="ressourcesVedette.length === 0" class="empty-panel">
        Aucune ressource disponible pour le moment.
      </div>

      <div v-else class="resource-grid">
        <RessourceCard
          v-for="ressource in ressourcesVedette"
          :key="ressource.id"
          :ressource="ressource"
          action-label="Voir la ressource"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/axios'
import RessourceCard from '@/components/RessourceCard.vue'


const loading = ref(true)
const ressourcesVedette = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/api/ressources')
    ressourcesVedette.value = response.data.slice(0, 3)
  } catch (error) {
    ressourcesVedette.value = []
  } finally {
    loading.value = false
  }
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/catalogue',
      query: { q: searchQuery.value.trim() }
    })
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 350px;
  border-radius: 18px;
  background: linear-gradient(135deg, #111827, #1e1b4b 55%, #3b0764 100%);
  border: 1px solid #dbe4f0;
}

.space-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 54%, rgba(59, 130, 246, 0.55), transparent 18%),
    radial-gradient(circle at 84% 62%, rgba(249, 115, 22, 0.5), transparent 18%),
    radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.28), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
}

.glow {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  filter: blur(36px);
}

.glow-left {
  left: 30px;
  bottom: 20px;
  background: rgba(59, 130, 246, 0.34);
}

.glow-right {
  right: 30px;
  bottom: 10px;
  background: rgba(249, 115, 22, 0.3);
}

.hero-cards {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  max-width: 930px;
  margin: 62px auto 0;
  padding: 0 24px;
}

.profile-card {
  position: relative;
  padding: 22px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.24);
}

.profile-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #fff;
  margin-bottom: 14px;
}

.profile-icon.blue {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.profile-icon.purple {
  background: linear-gradient(135deg, #9333ea, #c084fc);
}

.small-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3e8ff;
  color: #9333ea;
  font-size: 0.68rem;
  font-weight: 700;
}

.profile-card h2 {
  margin: 0 0 8px;
  font-size: 1rem;
}

.profile-card p {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.5;
}

.profile-card ul {
  margin: 0 0 12px;
  padding-left: 16px;
  color: #4b5563;
  font-size: 0.82rem;
  line-height: 1.7;
}

.profile-link {
  color: #0f766e;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.feature-card.orange {
  background: linear-gradient(135deg, #fff7ed, #ffffff);
}

.feature-card.green {
  background: linear-gradient(135deg, #ecfeff, #ffffff);
}

.feature-card.purple {
  background: linear-gradient(135deg, #faf5ff, #ffffff);
}

.feature-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.feature-card h3 {
  margin: 0 0 4px;
  font-size: 0.95rem;
}

.feature-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.82rem;
}

.featured-section {
  padding: 8px 0 0;
}

.section-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0 0 6px;
  font-size: 1.9rem;
  letter-spacing: -0.03em;
}

.section-header p {
  margin: 0;
  color: #64748b;
}

.see-all-link {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #ffffff;
  color: #334155;
  text-decoration: none;
  font-weight: 600;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.empty-panel {
  display: grid;
  place-items: center;
  min-height: 180px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

@media (max-width: 960px) {
  .hero-cards,
  .features-section,
  .resource-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: start;
    flex-direction: column;
  }
}
</style>
