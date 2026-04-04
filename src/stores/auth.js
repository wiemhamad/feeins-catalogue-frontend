import { defineStore } from 'pinia'

const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: parseStoredUser(),
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.user),

    // Rôles
    isAdmin: (state) => state.user?.role === 'ADMINISTRATEUR_PEDAGOGIQUE',

    // L'enseignant crée des TEMPLATES (pas des ressources)
    isEnseignant: (state) => state.user?.role === 'ENSEIGNANT',

    // Le contributeur (consultant pédagogique) CRÉE et PROPOSE des ressources
    isContributeur: (state) => state.user?.role === 'CONTRIBUTEUR',

    // Peut créer des ressources = CONTRIBUTEUR ou ADMIN
    canCreateRessource: (state) =>
      state.user?.role === 'CONTRIBUTEUR' ||
      state.user?.role === 'ADMINISTRATEUR_PEDAGOGIQUE',

    // Peut créer des templates = ENSEIGNANT ou ADMIN
    canCreateTemplate: (state) =>
      state.user?.role === 'ENSEIGNANT' ||
      state.user?.role === 'ADMINISTRATEUR_PEDAGOGIQUE',

    // Peut valider = ADMIN uniquement
    canValider: (state) => state.user?.role === 'ADMINISTRATEUR_PEDAGOGIQUE',

    userDisplayName: (state) => state.user?.nom || state.user?.email || 'Utilisateur',

    userRole: (state) => state.user?.role || null
  },

  actions: {
    hydrate() {
      this.user = parseStoredUser()
      this.token = localStorage.getItem('token') || null
    },

    setSession(data) {
      const user = {
        id: data.id,
        nom: data.nom,
        email: data.email,
        role: data.typeUtilisateur
      }
      this.user = user
      this.token = data.token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
