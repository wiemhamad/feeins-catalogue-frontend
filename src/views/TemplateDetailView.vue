<template>
  <div class="template-detail-page">

    <!-- BOUTON RETOUR -->
    <div class="back-bar">
      <button @click="$router.push('/templates')" class="back-btn">
        &larr; Retour aux templates
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="state-center">
      <div class="spinner"></div>
      <p>Chargement du template...</p>
    </div>

    <!-- ERREUR -->
    <div v-else-if="erreur" class="state-center error">
      <div class="error-icon">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" stroke="#f87171" stroke-width="2.5"/>
          <path d="M24 14v12" stroke="#f87171" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="33" r="1.5" fill="#f87171"/>
        </svg>
      </div>
      <h3>Template introuvable</h3>
      <p>Ce template n'existe pas ou n'est plus disponible.</p>
      <button @click="$router.push('/templates')" class="btn-retour">Retour aux templates</button>
    </div>

    <template v-else-if="template">

      <!-- HERO DU TEMPLATE -->
      <section class="template-hero">
        <div class="template-hero-inner">
          <div class="template-hero-left">
            <div class="template-badges">
              <span class="badge-type" :class="template.modifiable ? 'badge-open' : 'badge-locked'">
                <span class="badge-dot" :class="template.modifiable ? 'dot-open' : 'dot-locked'"></span>
                {{ template.modifiable ? 'Modifiable' : 'Clé en main' }}
              </span>
              <span class="badge-count">
                {{ ressources.length }} ressource{{ ressources.length > 1 ? 's' : '' }}
              </span>
            </div>
            <h1>{{ template.nom }}</h1>
            <p v-if="template.description">{{ template.description }}</p>
          </div>
        </div>
      </section>

      <!-- CONTENU PRINCIPAL -->
      <section class="template-content">
        <div class="template-content-inner">

          <!-- AUCUNE RESSOURCE -->
          <div v-if="ressources.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="16" width="48" height="36" rx="6" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <path d="M20 32h24M20 40h16" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/>
                <circle cx="48" cy="16" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                <path d="M48 12v4M48 20v.5" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Aucune ressource dans ce template</h3>
            <p>L'enseignant n'a pas encore associé de ressources à ce template.</p>
            <RouterLink to="/catalogue" class="btn-catalogue">
              Parcourir le catalogue complet &rarr;
            </RouterLink>
          </div>

          <!-- LISTE DES RESSOURCES -->
          <div v-else>
            <div class="ressources-header">
              <h2>Ressources de ce parcours</h2>
              <p>Sélectionnées et organisées par l'enseignant pour ce template pédagogique.</p>
            </div>

            <!-- Filtres rapides -->
            <div class="quick-filters">
              <button
                v-for="f in filtresDispos"
                :key="f.value"
                class="quick-btn"
                :class="{ active: filtreActif === f.value }"
                @click="filtreActif = filtreActif === f.value ? null : f.value"
              >
                <span class="quick-dot" :class="'qdot-' + f.value.toLowerCase()"></span>
                {{ f.value }}
                <span class="quick-count">{{ f.count }}</span>
              </button>
            </div>

            <!-- GRILLE -->
            <div class="ressources-grid">
              <article
                v-for="r in ressourcesFiltrees"
                :key="r.id"
                class="ressource-card"
                @click="ouvrirDetail(r)"
              >
                <div class="card-top">
                  <span class="type-pill" :class="'type-' + r.typeSupport?.toLowerCase()">
                    {{ r.typeSupport }}
                  </span>
                  <span v-if="r.difficulte" class="diff-pill" :class="'diff-' + r.difficulte?.toLowerCase()">
                    {{ labelDiff(r.difficulte) }}
                  </span>
                </div>

                <h3>{{ r.titre }}</h3>

                <p class="card-desc">
                  {{ r.description?.slice(0, 110) }}{{ r.description?.length > 110 ? '…' : '' }}
                </p>

                <div class="card-meta">
                  <span v-if="r.niveauNom" class="meta-item meta-niveau">{{ r.niveauNom }}</span>
                  <span v-if="r.thematiqueNom" class="meta-item meta-theme">{{ r.thematiqueNom }}</span>
                </div>

                <div v-if="r.tags?.length" class="card-tags">
                  <span v-for="t in r.tags.slice(0,3)" :key="t" class="tag">#{{ t }}</span>
                </div>

                <div class="card-footer">
                  <span class="card-duree">{{ r.dureeMinutes ? r.dureeMinutes + ' min' : '—' }}</span>
                  <a
                    v-if="r.urlAcces && !r.urlAcces.startsWith('[')"
                    :href="r.urlAcces"
                    target="_blank"
                    rel="noopener"
                    class="card-link"
                    @click.stop
                  >Consulter &rarr;</a>
                  <span v-else class="card-link-off">Non disponible</span>
                </div>
              </article>
            </div>
          </div>

        </div>
      </section>

    </template>

    <!-- MODALE DÉTAIL RESSOURCE -->
    <div v-if="ressourceDetail" class="modal-overlay" @click.self="ressourceDetail = null">
      <div class="modal">
        <button class="modal-close" @click="ressourceDetail = null">&times;</button>

        <div class="modal-top">
          <span class="type-pill" :class="'type-' + ressourceDetail.typeSupport?.toLowerCase()">
            {{ ressourceDetail.typeSupport }}
          </span>
          <span v-if="ressourceDetail.difficulte" class="diff-pill" :class="'diff-' + ressourceDetail.difficulte?.toLowerCase()">
            {{ labelDiff(ressourceDetail.difficulte) }}
          </span>
        </div>

        <h2>{{ ressourceDetail.titre }}</h2>
        <p class="modal-nomen">{{ ressourceDetail.nomenclature }}</p>
        <p class="modal-desc">{{ ressourceDetail.description }}</p>

        <div class="modal-grid">
          <div v-if="ressourceDetail.niveauNom" class="modal-item">
            <span class="modal-label">Niveau</span>
            <span class="modal-val">{{ ressourceDetail.niveauNom }}</span>
          </div>
          <div v-if="ressourceDetail.thematiqueNom" class="modal-item">
            <span class="modal-label">Thématique</span>
            <span class="modal-val">{{ ressourceDetail.thematiqueNom }}</span>
          </div>
          <div v-if="ressourceDetail.dureeMinutes" class="modal-item">
            <span class="modal-label">Durée</span>
            <span class="modal-val">{{ ressourceDetail.dureeMinutes }} min</span>
          </div>
          <div v-if="ressourceDetail.usagePedagogique" class="modal-item">
            <span class="modal-label">Usage</span>
            <span class="modal-val">{{ formatUsage(ressourceDetail.usagePedagogique) }}</span>
          </div>
          <div v-if="ressourceDetail.auteurPartenaire" class="modal-item">
            <span class="modal-label">Auteur</span>
            <span class="modal-val">{{ ressourceDetail.auteurPartenaire }}</span>
          </div>
        </div>

        <div v-if="ressourceDetail.objectifsPedagogiques" class="modal-section">
          <h4>Objectifs pédagogiques</h4>
          <p>{{ ressourceDetail.objectifsPedagogiques }}</p>
        </div>

        <div v-if="ressourceDetail.competencesVisees" class="modal-section">
          <h4>Compétences visées</h4>
          <p>{{ ressourceDetail.competencesVisees }}</p>
        </div>

        <div v-if="ressourceDetail.tags?.length" class="modal-tags">
          <span v-for="t in ressourceDetail.tags" :key="t" class="modal-tag">#{{ t }}</span>
        </div>

        <div class="modal-actions">
          <button @click="ressourceDetail = null" class="btn-close">Fermer</button>
          <a
            v-if="ressourceDetail.urlAcces && !ressourceDetail.urlAcces.startsWith('[')"
            :href="ressourceDetail.urlAcces"
            target="_blank"
            rel="noopener"
            class="btn-open"
          >
            Ouvrir la ressource &rarr;
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const template = ref(null)
const ressources = ref([])
const loading = ref(true)
const erreur = ref(false)
const filtreActif = ref(null)
const ressourceDetail = ref(null)

const filtresDispos = computed(() => {
  const types = {}
  ressources.value.forEach(r => {
    if (!types[r.typeSupport]) types[r.typeSupport] = 0
    types[r.typeSupport]++
  })
  return Object.entries(types).map(([value, count]) => ({ value, count }))
})

const ressourcesFiltrees = computed(() =>
  filtreActif.value
    ? ressources.value.filter(r => r.typeSupport === filtreActif.value)
    : ressources.value
)

const labelDiff = (d) =>
  ({ DEBUTANT: 'Débutant', INTERMEDIAIRE: 'Intermédiaire', AVANCE: 'Avancé' }[d] || d)

const formatUsage = (u) => ({
  COURS: 'Cours',
  ACTIVITE: 'Activité',
  EVALUATION_FORMATIVE: 'Éval. formative',
  EVALUATION_SOMMATIVE: 'Éval. sommative',
  RESSOURCE_COMPLEMENTAIRE: 'Complémentaire',
  QUIZ_POSITIONNEMENT: 'Quiz positionnement'
}[u] || u)

const ouvrirDetail = (r) => { ressourceDetail.value = r }

onMounted(async () => {
  const id = route.params.id
  try {
    const [tRes, rRes] = await Promise.all([
      api.get(`/api/templates/public/${id}`),
      api.get(`/api/templates/public/${id}/ressources`)
    ])
    template.value = tRes.data
    ressources.value = rRes.data || []
  } catch {
    erreur.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.template-detail-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #080c22 0%, #0f1535 60%, #1a0a3d 100%);
  color: white;
}

/* ===== BACK ===== */
.back-bar { padding: 20px 24px 0; max-width: 1200px; margin: 0 auto; }
.back-btn {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8); border-radius: 999px; padding: 8px 18px;
  font-size: 0.85rem; cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.back-btn:hover { background: rgba(255,255,255,0.15); color: white; }

/* ===== HERO ===== */
.template-hero {
  padding: 40px 24px 48px;
  background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.2), rgba(14,165,233,0.15));
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.template-hero-inner { max-width: 1200px; margin: 0 auto; }
.template-badges { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }

.badge-type {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 700;
}
.badge-open   { background: rgba(34,197,94,0.2);  color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
.badge-locked { background: rgba(234,179,8,0.2);  color: #facc15; border: 1px solid rgba(234,179,8,0.3); }

/* Ronds CSS pour modifiable/clé en main */
.badge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-open   { background: #4ade80; }
.dot-locked { background: #facc15; }

.badge-count {
  padding: 5px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 600;
  background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
}
.template-hero h1 { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 900; margin: 0 0 12px; line-height: 1.2; }
.template-hero p  { color: rgba(255,255,255,0.7); font-size: 1rem; margin: 0; max-width: 640px; line-height: 1.7; }

/* ===== CONTENT ===== */
.template-content { padding: 40px 24px 60px; }
.template-content-inner { max-width: 1200px; margin: 0 auto; }

/* ===== EMPTY ===== */
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { width: 64px; height: 64px; margin: 0 auto 16px; opacity: 0.6; }
.empty-state h3 { font-size: 1.3rem; margin: 0 0 8px; }
.empty-state p  { color: rgba(255,255,255,0.5); margin: 0 0 24px; }
.btn-catalogue {
  display: inline-block; background: #D4FF00; color: #0b0f2a;
  font-weight: 700; padding: 12px 24px; border-radius: 10px; text-decoration: none;
}

/* ===== RESSOURCES HEADER ===== */
.ressources-header { margin-bottom: 24px; }
.ressources-header h2 { font-size: 1.4rem; font-weight: 800; margin: 0 0 6px; }
.ressources-header p  { color: rgba(255,255,255,0.5); font-size: 0.88rem; margin: 0; }

/* ===== FILTRES RAPIDES ===== */
.quick-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.quick-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.quick-btn:hover { background: rgba(255,255,255,0.12); color: white; }
.quick-btn.active { background: rgba(212,255,0,0.15); border-color: rgba(212,255,0,0.4); color: #D4FF00; }

/* Ronds colorés par type dans les filtres rapides */
.quick-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.qdot-video { background: #ef4444; }
.qdot-h5p   { background: #8b5cf6; }
.qdot-pdf   { background: #f97316; }
.qdot-quiz  { background: #3b82f6; }
.qdot-html  { background: #10b981; }
.qdot-lien  { background: #06b6d4; }
.qdot-autre { background: #94a3b8; }

.quick-count { background: rgba(255,255,255,0.1); border-radius: 999px; padding: 1px 7px; font-size: 0.72rem; }
.quick-btn.active .quick-count { background: rgba(212,255,0,0.2); }

/* ===== GRILLE ===== */
.ressources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

/* ===== CARD ===== */
.ressource-card {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 18px; padding: 20px;
  display: flex; flex-direction: column; gap: 10px;
  cursor: pointer; transition: all 0.22s; position: relative; overflow: hidden;
}
.ressource-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  border-radius: 3px 0 0 3px;
  background: linear-gradient(180deg, #D4FF00, transparent);
  opacity: 0; transition: opacity 0.22s;
}
.ressource-card:hover {
  background: rgba(255,255,255,0.09); border-color: rgba(212,255,0,0.2);
  transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.4);
}
.ressource-card:hover::before { opacity: 1; }

.card-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }

/* Badges type */
.type-pill {
  padding: 3px 10px; border-radius: 999px;
  font-size: 0.68rem; font-weight: 800;
  letter-spacing: 0.4px; text-transform: uppercase; color: white;
}
.type-video { background: #e74c3c; }
.type-h5p   { background: #9b59b6; }
.type-pdf   { background: #e67e22; }
.type-quiz  { background: #3498db; }
.type-html  { background: #27ae60; }
.type-lien  { background: #1abc9c; }
.type-autre { background: #7f8c8d; }

/* Badges difficulté */
.diff-pill { padding: 3px 9px; border-radius: 999px; font-size: 0.66rem; font-weight: 700; }
.diff-debutant      { background: rgba(39,174,96,0.2);  color: #2ecc71; border: 1px solid rgba(39,174,96,0.3); }
.diff-intermediaire { background: rgba(241,196,15,0.2); color: #f1c40f; border: 1px solid rgba(241,196,15,0.3); }
.diff-avance        { background: rgba(231,76,60,0.2);  color: #e74c3c; border: 1px solid rgba(231,76,60,0.3); }

.ressource-card h3 { margin: 0; font-size: 0.95rem; font-weight: 800; color: #fff; line-height: 1.4; }
.card-desc { margin: 0; font-size: 0.8rem; color: rgba(255,255,255,0.55); line-height: 1.6; flex: 1; }

.card-meta { display: flex; flex-wrap: wrap; gap: 6px; }
.meta-item {
  font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 500;
}
.meta-niveau { background: rgba(139,92,246,0.15); color: rgba(167,139,250,0.9); }
.meta-theme  { background: rgba(236,72,153,0.15); color: rgba(244,114,182,0.9); }

.card-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.tag {
  background: rgba(212,255,0,0.08); color: rgba(212,255,0,0.7);
  border: 1px solid rgba(212,255,0,0.15); padding: 2px 8px;
  border-radius: 6px; font-size: 0.67rem; font-weight: 600;
}

.card-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.07); margin-top: auto;
}
.card-duree    { font-size: 0.74rem; color: rgba(255,255,255,0.35); }
.card-link     { color: #D4FF00; font-size: 0.75rem; font-weight: 800; text-decoration: none; }
.card-link:hover { opacity: 0.8; }
.card-link-off { color: rgba(255,255,255,0.2); font-size: 0.75rem; cursor: not-allowed; }

/* ===== STATES ===== */
.state-center {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; text-align: center; padding: 40px; gap: 12px;
}
.spinner {
  width: 44px; height: 44px; border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #D4FF00; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-icon { width: 48px; height: 48px; }
.state-center h3 { font-size: 1.3rem; margin: 0; }
.state-center p  { color: rgba(255,255,255,0.5); margin: 0; }
.btn-retour {
  background: #D4FF00; color: #0b0f2a; font-weight: 700;
  padding: 12px 24px; border: none; border-radius: 10px;
  cursor: pointer; font-size: 0.9rem; font-family: inherit;
}

/* ===== MODALE ===== */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px;
}
.modal {
  background: #0f1535; border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px; width: 100%; max-width: 620px;
  max-height: 90vh; overflow-y: auto; padding: 28px;
  position: relative; box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.6);
  font-size: 18px; cursor: pointer; border-radius: 50%;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  line-height: 1;
}
.modal-close:hover { background: rgba(255,255,255,0.15); color: white; }

.modal-top { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.modal h2 { margin: 0 0 4px; font-size: 1.35rem; font-weight: 900; }
.modal-nomen { font-size: 11px; color: rgba(255,255,255,0.35); font-family: monospace; margin: 0 0 14px; }
.modal-desc { color: rgba(255,255,255,0.65); font-size: 0.9rem; line-height: 1.7; margin: 0 0 20px; }

.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.modal-item { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 14px; }
.modal-label {
  display: block; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.35);
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
}
.modal-val { font-size: 0.88rem; font-weight: 600; color: #fff; }

.modal-section { margin-bottom: 16px; }
.modal-section h4 { margin: 0 0 6px; font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.8); }
.modal-section p  { margin: 0; font-size: 0.86rem; color: rgba(255,255,255,0.55); line-height: 1.65; }

.modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
.modal-tag {
  background: rgba(212,255,0,0.1); color: rgba(212,255,0,0.8);
  padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600;
}

.modal-actions {
  display: flex; gap: 12px; justify-content: flex-end;
  padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);
}
.btn-close {
  padding: 11px 20px; background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 10px;
  cursor: pointer; font-weight: 600; font-family: inherit;
}
.btn-open {
  padding: 11px 22px; background: linear-gradient(135deg, #D4FF00, #a8cc00);
  color: #0b0f2a; border: none; border-radius: 10px; cursor: pointer;
  font-weight: 800; text-decoration: none;
  display: inline-flex; align-items: center; gap: 6px; font-family: inherit;
}
.btn-open:hover { opacity: 0.9; }

@media (max-width: 640px) {
  .ressources-grid { grid-template-columns: 1fr; }
  .modal-grid { grid-template-columns: 1fr; }
  .modal-actions { flex-direction: column; }
}
</style>
