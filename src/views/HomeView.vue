<template>
  <div class="landing-page">
    <div class="page-orb orb-one"></div>
    <div class="page-orb orb-two"></div>
    <div class="page-orb orb-three"></div>
    <div class="page-orb orb-four"></div>
    <div class="page-grid"></div>

    <div v-if="authStore.isLoggedIn" class="welcome-bar">
      <div class="welcome-bar-inner">
        <div class="welcome-avatar">{{ authStore.userDisplayName.charAt(0).toUpperCase() }}</div>
        <div class="welcome-texts">
          <span>Bonjour, <strong>{{ authStore.userDisplayName }}</strong></span>
          <small>{{ roleLabel }}</small>
        </div>
        <div class="welcome-actions">
          <RouterLink to="/templates" class="wb-btn wb-secondary">Templates</RouterLink>
          <RouterLink :to="dashboardLink" class="wb-btn wb-primary">Mon espace</RouterLink>
        </div>
      </div>
    </div>

    <section class="hero">
      <div class="hero-content">
        <div class="pricing">
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Visiteur / Etudiant</p>
            <span>
              Consultez le catalogue, faites le quiz de positionnement et accedez aux ressources
              <strong> sans compte requis</strong>.
            </span>
            <div class="card-btns">
              <RouterLink to="/catalogue" class="btn">ACCEDER AU CATALOGUE</RouterLink>
              <RouterLink to="/templates" class="btn btn-outline">TEMPLATES</RouterLink>
            </div>
          </div>

          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Contributeur</p>
            <span>
              Vous creez et proposez des ressources pedagogiques.
              Elles sont validees par l'administrateur avant publication.
            </span>
            <RouterLink to="/login" class="btn">SE CONNECTER</RouterLink>
          </div>

          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Enseignant</p>
            <span>
              Vous composez des templates pedagogiques a partir de ressources
              validees existantes dans le catalogue.
            </span>
            <RouterLink to="/login" class="btn">SE CONNECTER</RouterLink>
          </div>
        </div>

        <div class="hero-text">
          <div class="hero-kicker-row">
            <span class="hero-kicker">Plateforme FEEINS</span>
            <span class="hero-kicker hero-kicker-muted">Catalogue, templates et parcours</span>
          </div>
          <h1>
            BOOSTEZ VOTRE APPRENTISSAGE <br />
            AVEC DES RESSOURCES E-SANTE
          </h1>
          <p>
            Accedez a une plateforme moderne pour apprendre, reviser et progresser
            en sante numerique grace a des contenus interactifs.
          </p>
        
          <div class="hero-metrics">
            <article class="metric-card">
              <strong>Catalogue ouvert</strong>
              <span>Parcours libre pour visiteurs et etudiants</span>
            </article>
            <article class="metric-card">
              <strong>Contribution encadree</strong>
              <span>Validation pedagogique avant publication</span>
            </article>
            <article class="metric-card">
              <strong>Templates reutilisables</strong>
              <span>Assemblage rapide pour les enseignants</span>
            </article>
          </div>
        </div>
      </div>

      <div class="hero-illustration">
        <img src="https://assets.website-files.com/62ce572e448ae60684f0d244/62ce5c62fd06b3ba30e2a39e_hero.svg" alt="illustration" />
      </div>
    </section>

    <section class="highlights">
      <div class="highlights-inner">
        <article class="highlight-card">
          <span class="highlight-index">01</span>
          <h3>Explorer rapidement</h3>
          <p>Accedez aux ressources les plus utiles avec un parcours clair et immediat.</p>
        </article>
        <article class="highlight-card">
          <span class="highlight-index">02</span>
          <h3>Structurer l'apprentissage</h3>
          <p>Niveaux, thematiques et formats facilitent le reperage des bons contenus.</p>
        </article>
        <article class="highlight-card">
          <span class="highlight-index">03</span>
          <h3>Valoriser les contributeurs</h3>
          <p>Les ressources proposees sont integrees dans une experience plus lisible et plus soignee.</p>
        </article>
      </div>
    </section>

    <section class="suggestions">
      <div class="suggestions-inner">
        <div class="suggestions-header">
          <div>
            <h2>Ressources a la une</h2>
            <p>Quelques ressources FEEINS validees pour commencer votre parcours</p>
          </div>
          <RouterLink to="/catalogue" class="see-all">Tout voir</RouterLink>
        </div>

        <div v-if="loadingRessources" class="sug-loading">Chargement...</div>

        <div v-else-if="ressourcesSuggerees.length === 0" class="sug-empty">
          Aucune ressource disponible pour l'instant.
        </div>

        <div v-else class="suggestions-grid">
          <article v-for="r in ressourcesSuggerees" :key="r.id" class="sug-card">
            <div class="sug-top">
              <span class="sug-type" :class="'sug-' + r.typeSupport?.toLowerCase()">
                {{ typeLabel(r.typeSupport) }}
              </span>
              <span v-if="r.difficulte" class="sug-diff" :class="'diff-' + r.difficulte?.toLowerCase()">
                {{ r.difficulte }}
              </span>
            </div>
            <h3>{{ r.titre }}</h3>
            <p>{{ r.description?.slice(0, 100) }}{{ r.description?.length > 100 ? '...' : '' }}</p>
            <div v-if="r.tags?.length" class="sug-tags">
              <span v-for="t in r.tags.slice(0, 3)" :key="t" class="sug-tag">#{{ t }}</span>
            </div>
            <div class="sug-footer">
              <span class="sug-meta">{{ r.dureeMinutes ? r.dureeMinutes + ' min' : '' }}</span>
              <a
                v-if="r.urlAcces && !r.urlAcces.startsWith('[')"
                :href="r.urlAcces"
                target="_blank"
                class="sug-link"
              >Consulter</a>
              <span v-else class="sug-link-off">Consulter</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const authStore = useAuthStore()
const ressourcesSuggerees = ref([])
const loadingRessources = ref(true)

const roleLabels = {
  ADMINISTRATEUR_PEDAGOGIQUE: 'Administrateur pedagogique',
  ENSEIGNANT: 'Enseignant',
  CONTRIBUTEUR: 'Contributeur',
  ETUDIANT: 'Etudiant',
}

const roleLabel = computed(() => roleLabels[authStore.userRole] || 'Utilisateur')

const dashboardLink = computed(() => {
  if (authStore.isAdmin) return '/admin'
  if (authStore.isEnseignant) return '/enseignant/templates'
  if (authStore.isContributeur) return '/contributeur/ressources'
  return '/catalogue'
})

const typeLabel = (type) =>
  ({ VIDEO: 'Video', H5P: 'H5P', PDF: 'PDF', QUIZ: 'Quiz', HTML: 'HTML', LIEN: 'Lien', AUTRE: 'Autre' }[type] || 'Autre')

onMounted(async () => {
  try {
    const { data } = await api.get('/api/ressources')
    const types = ['VIDEO', 'PDF', 'H5P', 'QUIZ', 'HTML', 'LIEN']
    let selected = []

    for (const type of types) {
      const found = data.find((ressource) => ressource.typeSupport === type && !selected.includes(ressource))
      if (found) selected.push(found)
      if (selected.length >= 3) break
    }

    if (selected.length < 3) {
      selected = [...selected, ...data.filter((ressource) => !selected.includes(ressource))].slice(0, 3)
    }

    ressourcesSuggerees.value = selected
  } catch {
    ressourcesSuggerees.value = []
  } finally {
    loadingRessources.value = false
  }
})
</script>

<style scoped>
.landing-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f2a, #1f1147);
  color: white;
  overflow: hidden;
}

.page-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  pointer-events: none;
  opacity: 0.78;
}

.orb-one {
  width: 420px;
  height: 420px;
  top: 90px;
  left: -120px;
  background: rgba(40, 190, 255, 0.34);
}

.orb-two {
  width: 480px;
  height: 480px;
  top: 330px;
  right: -160px;
  background: rgba(212, 255, 0, 0.28);
}

.orb-three {
  width: 240px;
  height: 240px;
  top: 560px;
  left: 8%;
  background: rgba(255, 255, 255, 0.14);
}

.orb-four {
  width: 280px;
  height: 280px;
  top: 120px;
  right: 18%;
  background: rgba(122, 92, 255, 0.2);
}

.page-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 75%);
  pointer-events: none;
}

.welcome-bar {
  position: relative;
  z-index: 1;
  background: linear-gradient(90deg, rgba(212,255,0,0.1), rgba(99,102,241,0.12));
  border-bottom: 1px solid rgba(212,255,0,0.18);
  padding: 12px 20px;
  backdrop-filter: blur(8px);
}

.welcome-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.welcome-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4ff00, #8aaa00);
  color: #0b0f2a;
  font-weight: 900;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-texts { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.welcome-texts span { font-size: 0.9rem; color: #fff; }
.welcome-texts strong { color: #d4ff00; }
.welcome-texts small { font-size: 0.72rem; color: rgba(255,255,255,0.5); }
.welcome-actions { display: flex; gap: 8px; }

.wb-btn {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}

.wb-primary { background: #d4ff00; color: #0b0f2a; }
.wb-primary:hover { background: #bfeb00; }
.wb-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
.wb-secondary:hover { background: rgba(255,255,255,0.18); }

.hero {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 100vh;
  padding: 40px 20px;
}

.hero-content { flex: 1; }
.hero-kicker-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.14);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-kicker-muted {
  background: rgba(212,255,0,0.12);
  border-color: rgba(212,255,0,0.2);
  color: #d4ff00;
}

.pricing { display: flex; gap: 20px; margin-bottom: 50px; flex-wrap: wrap; }

.price-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  text-align: left;
  width: 200px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border-color: rgba(212,255,0,0.24);
}
.price { font-size: 12px; font-weight: 700; color: #7df9ff; letter-spacing: 1px; }
.price-card p { font-size: 18px; margin: 0; font-weight: 700; }
.price-card span { display: block; font-size: 13px; color: #bbb; line-height: 1.5; flex: 1; }
.card-btns { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }

.btn {
  display: inline-block;
  background: #d4ff00;
  color: black;
  padding: 9px 14px;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
  font-size: 12px;
  text-align: center;
}

.btn:hover { background: #bfeb00; }
.btn-outline { background: transparent; color: #d4ff00; border: 1px solid rgba(212,255,0,0.5); }
.btn-outline:hover { background: rgba(212,255,0,0.08); }
.hero-text h1 { font-size: 38px; line-height: 1.2; margin-bottom: 20px; }
.hero-text p { color: #bbb; margin-bottom: 25px; max-width: 500px; }
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
  max-width: 860px;
}

.metric-card {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.metric-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #fff;
}

.metric-card span {
  display: block;
  color: rgba(255,255,255,0.62);
  font-size: 0.8rem;
  line-height: 1.5;
}

.cta {
  background: #d4ff00;
  padding: 14px 28px;
  color: black;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
}

.cta:hover { background: #bfeb00; }
.cta-secondary { background: rgba(255,255,255,0.08); color: white; border: 1px solid rgba(255,255,255,0.2); }
.cta-secondary:hover { background: rgba(255,255,255,0.15); }
.hero-illustration {
  position: relative;
  z-index: 1;
}

.hero-illustration::before {
  content: "";
  position: absolute;
  inset: 18% 10% auto;
  height: 58%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(212,255,0,0.24), transparent 70%);
  filter: blur(40px);
}

.hero-illustration img {
  position: relative;
  width: 440px;
  filter: drop-shadow(0 30px 55px rgba(0,0,0,0.28));
}

.highlights {
  position: relative;
  z-index: 1;
  padding: 0 20px 28px;
}

.highlights-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.highlight-card {
  position: relative;
  padding: 24px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.highlight-index {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #d4ff00;
}

.highlight-card h3 {
  margin: 0 0 10px;
  font-size: 1.08rem;
}

.highlight-card p {
  margin: 0;
  color: rgba(255,255,255,0.62);
  line-height: 1.6;
  font-size: 0.9rem;
}

.suggestions {
  position: relative;
  z-index: 1;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 60px 20px;
}

.suggestions-inner { max-width: 1200px; margin: 0 auto; }
.suggestions-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 16px; }
.suggestions-header h2 { margin: 0 0 6px; font-size: 1.6rem; font-weight: 800; }
.suggestions-header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }

.see-all {
  color: #d4ff00;
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid rgba(212,255,0,0.3);
  padding: 8px 16px;
  border-radius: 999px;
  transition: all 0.2s;
}

.see-all:hover { background: rgba(212,255,0,0.1); }
.sug-loading { color: rgba(255,255,255,0.4); padding: 30px 0; }
.sug-empty { color: rgba(255,255,255,0.25); font-style: italic; padding: 30px 0; }

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.sug-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.25s;
}

.sug-card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(212,255,0,0.2);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

.sug-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.sug-type { padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; color: white; }
.sug-video { background: #e74c3c; }
.sug-h5p { background: #9b59b6; }
.sug-pdf { background: #e67e22; }
.sug-quiz { background: #3498db; }
.sug-html { background: #27ae60; }
.sug-lien { background: #1abc9c; }
.sug-autre { background: #7f8c8d; }

.sug-diff { padding: 3px 10px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; }
.diff-debutant { background: rgba(39,174,96,0.2); color: #2ecc71; }
.diff-intermediaire { background: rgba(241,196,15,0.2); color: #f1c40f; }
.diff-avance { background: rgba(231,76,60,0.2); color: #e74c3c; }

.sug-card h3 { margin: 0; font-size: 0.92rem; font-weight: 700; color: #fff; line-height: 1.4; }
.sug-card p { margin: 0; font-size: 0.8rem; color: rgba(255,255,255,0.55); line-height: 1.55; flex: 1; }
.sug-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.sug-tag { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 2px 8px; border-radius: 6px; font-size: 0.68rem; }

.sug-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

.sug-meta { font-size: 0.74rem; color: rgba(255,255,255,0.35); }
.sug-link { color: #d4ff00; font-size: 0.76rem; font-weight: 700; text-decoration: none; }
.sug-link:hover { opacity: 0.8; }
.sug-link-off { color: rgba(255,255,255,0.2); font-size: 0.76rem; cursor: not-allowed; }

@media (max-width: 900px) {
  .hero { flex-direction: column; text-align: center; padding: 60px 20px; min-height: unset; }
  .pricing { justify-content: center; }
  .price-card { width: 100%; max-width: 280px; }
  .hero-illustration { display: none; }
  .hero-ctas { justify-content: center; }
  .hero-kicker-row { justify-content: center; }
  .hero-metrics { grid-template-columns: 1fr; }
  .highlights-inner { grid-template-columns: 1fr; }
  .suggestions-grid { grid-template-columns: repeat(2, 1fr); }
  .orb-one,
  .orb-two,
  .orb-three,
  .orb-four {
    opacity: 0.5;
    filter: blur(64px);
  }
}

@media (max-width: 600px) {
  .suggestions-grid { grid-template-columns: 1fr; }
  .welcome-bar-inner { flex-wrap: wrap; }
  .suggestions-header { flex-direction: column; align-items: flex-start; }
}
</style>
