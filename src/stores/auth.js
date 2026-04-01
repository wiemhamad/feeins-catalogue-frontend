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
    isAdmin: (state) => state.user?.role === 'ADMINISTRATEUR_PEDAGOGIQUE',
    canCreate: (state) => state.user?.role === 'ENSEIGNANT',
    userDisplayName: (state) => state.user?.nom || state.user?.email || 'Utilisateur'
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
