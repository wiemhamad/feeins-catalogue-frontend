<template>
  <div class="search-component">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          @keyup.enter="performSearch"
          @focus="showSuggestions = true"
          @blur="setTimeout(() => showSuggestions = false, 200)"
          type="text"
          placeholder="Rechercher des ressources pédagogiques..."
          class="search-input"
          autocomplete="off"
        />
        <button @click="performSearch" class="search-btn" :disabled="ressourceStore.loading">
          <span class="search-icon">🔍</span>
        </button>

        <!-- Dropdown de suggestions -->
        <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
          <div
            v-for="ressource in suggestions"
            :key="ressource.id"
            class="suggestion-item"
            @click="selectSuggestion(ressource)"
          >
            <div class="suggestion-icon">📄</div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ ressource.titre }}</div>
              <div class="suggestion-subtitle">{{ ressource.thematique?.nom || 'Sans thématique' }}</div>
            </div>
          </div>
        </div>

        <div v-if="showSuggestions && searchQuery.trim() && suggestions.length === 0 && !ressourceStore.loading" class="suggestions-dropdown">
          <div class="suggestion-item empty">
            Aucune ressource trouvée
          </div>
        </div>
      </div>
    </div>

    <!-- Résultats de recherche complets -->
    <div v-if="ressourceStore.ressources.length > 0 && displayResults" class="search-results">
      <h3>Résultats de recherche ({{ ressourceStore.ressources.length }})</h3>
      <div class="results-grid">
        <RessourceCard 
          v-for="ressource in ressourceStore.ressources" 
          :key="ressource.id"
          :ressource="ressource"
        />
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="ressourceStore.error" class="search-error">
      {{ ressourceStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRessourceStore } from '@/stores/ressource'
import RessourceCard from '@/components/RessourceCard.vue'

const ressourceStore = useRessourceStore()
const searchQuery = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const displayResults = ref(false)
let searchTimeout

const onSearchInput = async () => {
  displayResults.value = false
  
  // Annuler la requête précédente
  clearTimeout(searchTimeout)
  
  if (searchQuery.value.trim().length === 0) {
    suggestions.value = []
    return
  }

  // Délai pour éviter trop d'appels API
  searchTimeout = setTimeout(async () => {
    try {
      await ressourceStore.rechercherRessources({
        motCle: searchQuery.value
      })
      // Les suggestions sont basées sur les résultats
      suggestions.value = ressourceStore.ressources.slice(0, 5)
    } catch (err) {
      suggestions.value = []
    }
  }, 300)
}

const selectSuggestion = async (ressource) => {
  searchQuery.value = ressource.titre
  suggestions.value = [ressource]
  showSuggestions.value = false
  displayResults.value = true
}

const performSearch = async () => {
  if (searchQuery.value.trim()) {
    await ressourceStore.rechercherRessources({
      motCle: searchQuery.value
    })
    displayResults.value = true
    showSuggestions.value = false
  }
}
</script>

<style scoped>
.search-component {
  width: 100%;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 40px;
  position: relative;
}

.search-input-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-icon {
  font-size: 20px;
}

.search-hint {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

/* Suggestions dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 66px;
  background: white;
  border: 2px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:hover:not(.empty) {
  background-color: #f5f5f5;
}

.suggestion-item.empty {
  cursor: default;
  color: #999;
  justify-content: center;
}

.suggestion-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-subtitle {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Résultats */
.search-results {
  margin-top: 40px;
}

.search-results h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.search-error {
  padding: 16px;
  background-color: #fee;
  color: #c00;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}
</style>
