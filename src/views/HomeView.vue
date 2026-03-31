<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="space-background">
        <div class="glow glow-left"></div>
        <div class="glow glow-right"></div>
      </div>

      <!-- Barre de recherche -->
      <SearchBar />

      <div class="hero-cards">
        <article class="profile-card">
          <h2>Je suis apprenant</h2>
          <p>Etudiants ou enseignants souhaitant consulter et suivre des ressources en e-sante.</p>
          <ul>
            <li>Explorer des cours</li>
            <li>Visionner des videos</li>
            <li>Reviser des quiz H5P</li>
            <li>Suivre sa progression</li>
          </ul>
          <div class="profile-actions">
            <RouterLink to="/catalogue" class="profile-link">Acceder au catalogue</RouterLink>
            <RouterLink to="/quiz" class="profile-link profile-link-secondary">Se positionner</RouterLink>
          </div>
        </article>

        <article class="profile-card">
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
        <div>
          <h3>Bibliotheque Riche</h3>
          <p>Plus de 500 grains pedagogiques</p>
        </div>
      </article>

      <article class="feature-card green">
        <div>
          <h3>Contenus Structures</h3>
          <p>Classes par theme et niveau</p>
        </div>
      </article>

      <article class="feature-card purple">
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
import SearchBar from '@/components/SearchBar.vue'

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
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 0;
  background-color: #f9fafb;
  min-height: 100vh;
}

.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 500px;
  background: linear-gradient(135deg, #470140 0%, #e4e1ea 50%, #d3b2ca 100%);
  padding: 60px 20px 80px;
}

.space-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15), transparent 25%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1), transparent 25%);
}

.glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.glow-left {
  left: -100px;
  top: 50px;
  background: rgba(255, 255, 255, 0.3);
}

.glow-right {
  right: -50px;
  bottom: 100px;
  background: rgba(255, 255, 255, 0.2);
}

.hero-cards {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-card {
  position: relative;
  padding: 32px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.profile-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.2);
}

.profile-card h2 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

.profile-card p {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
}

.profile-card ul {
  list-style: none;
  margin: 16px 0;
  padding: 0;
}

.profile-card ul li {
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 0.9rem;
  padding-left: 20px;
  position: relative;
}

.profile-card ul li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #6366f1;
  font-weight: bold;
}

.profile-link {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #dcc5ff 0%, #ecd9ff 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #cfadff;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.profile-link:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 20px rgba(177, 136, 232, 0.35);
}

.profile-link-secondary {
  background: linear-gradient(135deg, #dcc5ff 0%, #ecd9ff 100%);
  color: white;
  border-color: #cfadff;
}

.profile-link-secondary:hover {
  background: linear-gradient(135deg, #d4b8ff 0%, #e7d0ff 100%);
  color: white;
}

.small-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.features-section {
  max-width: 1180px;
  margin: 60px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 24px;
  border-radius: 12px;
  background: white;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.feature-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.feature-card h3 {
  margin: 0 0 6px;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.featured-section {
  max-width: 1180px;
  margin: 60px auto;
  padding: 0 20px;
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.section-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header p {
  margin: 0;
  color: #6b7280;
  font-size: 1rem;
}

.see-all-link {
  padding: 12px 28px;
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.see-all-link:hover {
  background: #6366f1;
  color: white;
  transform: translateX(4px);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-panel {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 1.1rem;
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
  margin-top: 0;
  color: white;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
}

.profile-actions .profile-link-secondary {
  color: white;
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
