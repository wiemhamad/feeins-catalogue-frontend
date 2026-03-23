import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useRessourceStore = defineStore('ressource', {
    state: () => ({
        ressources: [],
        niveaux: [],
        thematiques: [],
        tags: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchRessources() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/api/ressources')
                this.ressources = response.data
            } catch (err) {
                this.error = 'Erreur lors du chargement'
            } finally {
                this.loading = false
            }
        },

        async rechercherRessources(criteres) {
            this.loading = true
            this.error = null
            try {
                const response = await api.post('/api/ressources/rechercher', criteres)
                this.ressources = response.data
            } catch (err) {
                this.error = 'Erreur lors de la recherche'
            } finally {
                this.loading = false
            }
        },

        async fetchNiveaux() {
            const response = await api.get('/api/niveaux')
            this.niveaux = response.data
        },

        async fetchThematiques() {
            const response = await api.get('/api/thematiques')
            this.thematiques = response.data
        },

        async fetchTags() {
            const response = await api.get('/api/tags')
            this.tags = response.data
        }
    }
})