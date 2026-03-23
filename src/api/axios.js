import axios from 'axios'

const api = axios.create({
    // En local : vide → proxy Vite redirige /api vers localhost:8080
    // En production : URL Render complète
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Ajouter le token JWT automatiquement sur chaque requête
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expiré → déconnecter
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api