<template>
  <div class="catalogue">

    <!-- HEADER -->
    <div class="catalogue-header">
      <h1>📚 Catalogue FEEINS</h1>
      <p>Catalogue de grains pédagogiques en santé numérique</p>
    </div>

    <!-- FILTRES -->
    <div class="filtres">
      <div class="filtre-row">

        <input
          v-model="criteres.keyword"
          type="text"
          placeholder="🔍 Rechercher..."
          class="input-search"
          @input="rechercher"
        />

        <select v-model="criteres.niveauId" @change="rechercher" class="select-filtre">
          <option value="">Tous les niveaux</option>
          <option v-for="n in store.niveaux" :key="n.id" :value="n.id">
            {{ n.nom }}
          </option>
        </select>

        <select v-model="criteres.thematiqueId" @change="rechercher" class="select-filtre">
          <option value="">Toutes les thématiques</option>
          <option v-for="t in store.thematiques" :key="t.id" :value="t.id">
            {{ t.nom }}
          </option>
        </select>

        <select v-model="criteres.typeSupport" @change="rechercher" class="select-filtre">
          <option value="">Tous les types</option>
          <option value="VIDEO">🎥 Vidéo</option>
          <option value="H5P">🎮 H5P</option>
          <option value="PDF">📄 PDF</option>
          <option value="QUIZ">❓ Quiz</option>
          <option value="HTML">🌐 HTML</option>
          <option value="LIEN">🔗 Lien</option>
        </select>

        <select v-model="criteres.difficulte" @change="rechercher" class="select-filtre">
          <option value="">Toutes les difficultés</option>
          <option value="DEBUTANT">🟢 Débutant</option>
          <option value="INTERMEDIAIRE">🟡 Intermédiaire</option>
          <option value="AVANCE">🔴 Avancé</option>
        </select>

        <input
          v-model="criteres.dureeMax"
          type="number"
          placeholder="Durée max (min)"
          class="input-duree"
          @input="rechercher"
        />

        <button @click="resetFiltres" class="btn-reset">✖ Reset</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats">
      <span>{{ store.ressources.length }} ressource(s) trouvée(s)</span>
    </div>

    <!-- LOADING -->
    <div v-if="store.loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <!-- ERREUR -->
    <div v-else-if="store.error" class="error">
      ⚠️ {{ store.error }}
    </div>

    <!-- LISTE VIDE -->
    <div v-else-if="store.ressources.length === 0" class="empty">
      <p>📭 Aucune ressource trouvée</p>
    </div>

    <!-- GRILLE DE CARTES -->
    <div v-else class="grille">
      <div
        v-for="ressource in store.ressources"
        :key="ressource.id"
        class="carte"
        @click="voirDetail(ressource.id)"
      >
        <!-- Badge type -->
        <div class="carte-badge" :class="badgeClass(ressource.typeSupport)">
          {{ iconeType(ressource.typeSupport) }} {{ ressource.typeSupport }}
        </div>

        <!-- Contenu -->
        <div class="carte-body">
          <h3 class="carte-titre">{{ ressource.titre }}</h3>
          <p class="carte-desc">{{ ressource.description }}</p>

          <!-- Métadonnées -->
          <div class="carte-meta">
            <span v-if="ressource.niveauNom" class="meta-tag">
              🎓 {{ ressource.niveauNom }}
            </span>
            <span v-if="ressource.thematiqueNom" class="meta-tag">
              📂 {{ ressource.thematiqueNom }}
            </span>
            <span v-if="ressource.dureeMinutes" class="meta-tag">
              ⏱ {{ ressource.dureeMinutes }} min
            </span>
            <span v-if="ressource.difficulte" class="meta-tag"
              :class="difficulteClass(ressource.difficulte)">
              {{ ressource.difficulte }}
            </span>
          </div>

          <!-- Tags -->
          <div class="carte-tags" v-if="ressource.tags && ressource.tags.length">
            <span v-for="tag in ressource.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>

          <!-- Nomenclature -->
          <div class="carte-nomenclature">
            🏷️ {{ ressource.nomenclature }}
          </div>
        </div>

        <!-- Footer -->
        <div class="carte-footer">
          <span v-if="ressource.createurNom">Par {{ ressource.createurNom }}</span>
          <a
            v-if="ressource.urlAcces"
            :href="ressource.urlAcces"
            target="_blank"
            class="btn-acceder"
            @click.stop
          >
            Accéder →
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRessourceStore } from '@/stores/ressource'

const store = useRessourceStore()
const router = useRouter()

const criteres = ref({
  keyword: '',
  niveauId: '',
  thematiqueId: '',
  typeSupport: '',
  difficulte: '',
  dureeMax: null
})

let searchTimer = null

onMounted(async () => {
  await Promise.all([
    store.fetchRessources(),
    store.fetchNiveaux(),
    store.fetchThematiques(),
    store.fetchTags()
  ])
})

const rechercher = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const payload = {}
    if (criteres.value.keyword) payload.keyword = criteres.value.keyword
    if (criteres.value.niveauId) payload.niveauId = criteres.value.niveauId
    if (criteres.value.thematiqueId) payload.thematiqueId = criteres.value.thematiqueId
    if (criteres.value.typeSupport) payload.typeSupport = criteres.value.typeSupport
    if (criteres.value.difficulte) payload.difficulte = criteres.value.difficulte
    if (criteres.value.dureeMax) payload.dureeMax = criteres.value.dureeMax

    if (Object.keys(payload).length === 0) {
      store.fetchRessources()
    } else {
      store.rechercherRessources(payload)
    }
  }, 400)
}

const resetFiltres = () => {
  criteres.value = {
    keyword: '', niveauId: '', thematiqueId: '',
    typeSupport: '', difficulte: '', dureeMax: null
  }
  store.fetchRessources()
}

const voirDetail = (id) => {
  router.push(`/ressource/${id}`)
}

const iconeType = (type) => {
  const icones = {
    VIDEO: '🎥', H5P: '🎮', PDF: '📄',
    QUIZ: '❓', HTML: '🌐', LIEN: '🔗', AUTRE: '📦'
  }
  return icones[type] || '📦'
}

const badgeClass = (type) => {
  const classes = {
    VIDEO: 'badge-video', H5P: 'badge-h5p', PDF: 'badge-pdf',
    QUIZ: 'badge-quiz', HTML: 'badge-html', LIEN: 'badge-lien'
  }
  return classes[type] || 'badge-autre'
}

const difficulteClass = (diff) => {
  return {
    DEBUTANT: 'diff-debutant',
    INTERMEDIAIRE: 'diff-intermediaire',
    AVANCE: 'diff-avance'
  }[diff] || ''
}
</script>

<style scoped>
.catalogue { max-width: 1200px; margin: 0 auto; padding: 20px; }

.catalogue-header { text-align: center; margin-bottom: 30px; }
.catalogue-header h1 { font-size: 2rem; color: #2c3e50; }
.catalogue-header p { color: #666; font-size: 1.1rem; }

.filtres {
  background: #f8f9fa; border-radius: 12px;
  padding: 20px; margin-bottom: 20px;
}
.filtre-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

.input-search {
  flex: 1; min-width: 200px; padding: 10px 15px;
  border: 2px solid #dee2e6; border-radius: 8px; font-size: 14px;
}
.input-search:focus { border-color: #4CAF50; outline: none; }

.select-filtre, .input-duree {
  padding: 10px; border: 2px solid #dee2e6;
  border-radius: 8px; font-size: 14px; background: white;
}

.btn-reset {
  padding: 10px 15px; background: #dc3545;
  color: white; border: none; border-radius: 8px;
  cursor: pointer; font-size: 14px;
}
.btn-reset:hover { background: #c82333; }

.stats { color: #666; margin-bottom: 15px; font-size: 14px; }

.loading { text-align: center; padding: 50px; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50; border-radius: 50%;
  animation: spin 1s linear infinite; margin: 0 auto 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { text-align: center; padding: 30px; color: #dc3545; }
.empty { text-align: center; padding: 50px; color: #666; font-size: 1.2rem; }

.grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.carte {
  background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column; overflow: hidden;
}
.carte:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.carte-badge {
  padding: 8px 15px; font-size: 12px;
  font-weight: bold; color: white;
}
.badge-video { background: #e74c3c; }
.badge-h5p   { background: #9b59b6; }
.badge-pdf   { background: #e67e22; }
.badge-quiz  { background: #3498db; }
.badge-html  { background: #27ae60; }
.badge-lien  { background: #1abc9c; }
.badge-autre { background: #95a5a6; }

.carte-body { padding: 15px; flex: 1; }
.carte-titre { font-size: 1rem; font-weight: bold; margin-bottom: 8px; color: #2c3e50; }
.carte-desc {
  font-size: 0.85rem; color: #666;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
  margin-bottom: 12px;
}

.carte-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.meta-tag {
  background: #f0f0f0; padding: 3px 8px;
  border-radius: 12px; font-size: 12px; color: #555;
}
.diff-debutant      { background: #d4edda; color: #155724; }
.diff-intermediaire { background: #fff3cd; color: #856404; }
.diff-avance        { background: #f8d7da; color: #721c24; }

.carte-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.tag {
  background: #e8f4f8; color: #2980b9;
  padding: 2px 8px; border-radius: 10px; font-size: 11px;
}

.carte-nomenclature { font-size: 11px; color: #aaa; font-family: monospace; }

.carte-footer {
  padding: 10px 15px; border-top: 1px solid #f0f0f0;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: #888;
}
.btn-acceder {
  background: #4CAF50; color: white; padding: 5px 12px;
  border-radius: 6px; text-decoration: none; font-size: 12px;
}
.btn-acceder:hover { background: #45a049; }
</style>