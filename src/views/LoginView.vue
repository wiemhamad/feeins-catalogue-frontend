<template>
  <div class="login-page">
    
    <div class="login-card">

      <!-- Logo -->
      <div class="login-header">
        <h1> <div class="brand">
        <div class="brand-logo">F</div>
        <span>FEEINS</span>
      </div> </h1>
        <p>Catalogue de grains pédagogiques</p>
      </div>

      <!-- Tabs Login / Register -->
      <div class="tabs">
        <button
          :class="['tab', mode === 'login' ? 'tab-active' : '']"
          @click="mode = 'login'"
        >
          Connexion
        </button>
        <button
          :class="['tab', mode === 'register' ? 'tab-active' : '']"
          @click="mode = 'register'"
        >
          Inscription
        </button>
      </div>

      <!-- MESSAGE ERREUR -->
      <div v-if="erreur" class="alert-error">
        ⚠️ {{ erreur }}
      </div>

      <!-- MESSAGE SUCCÈS -->
      <div v-if="succes" class="alert-success">
        ✅ {{ succes }}
      </div>

      <!-- FORMULAIRE LOGIN -->
      <form v-if="mode === 'login'" @submit.prevent="login" class="form">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="admin@feeins.fr"
            required
          />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input
            v-model="loginForm.motDePasse"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <!-- Comptes de test -->
        <div class="comptes-test">
          <p>Comptes de test :</p>
          <button type="button" @click="remplirAdmin" class="btn-test">
            👑 Admin
          </button>
          <button type="button" @click="remplirEnseignant" class="btn-test">
            👨‍🏫 Enseignant
          </button>
          <button type="button" @click="remplirEtudiant" class="btn-test">
            🎓 Étudiant
          </button>
        </div>
      </form>

      <!-- FORMULAIRE REGISTER -->
      <form v-else @submit.prevent="register" class="form">
        <div class="form-group">
          <label>Nom</label>
          <input v-model="registerForm.nom" type="text" placeholder="Jean Dupont" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="registerForm.email" type="email" placeholder="jean@univ.fr" required />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="registerForm.motDePasse" type="password" placeholder="••••••••" required />
        </div>
        <div class="form-group">
          <label>Rôle</label>
          <select v-model="registerForm.typeUtilisateur">
            <option value="ETUDIANT">🎓 Étudiant</option>
            <option value="ENSEIGNANT">👨‍🏫 Enseignant</option>
            <option value="CONTRIBUTEUR">✏️ Contributeur</option>
            <option value="ADMINISTRATEUR_PEDAGOGIQUE">👑 Administrateur</option>
          </select>
        </div>

        <!-- Code accès enseignant -->
        <div
          v-if="registerForm.typeUtilisateur === 'ENSEIGNANT' ||
                registerForm.typeUtilisateur === 'ADMINISTRATEUR_PEDAGOGIQUE'"
          class="form-group"
        >
          <label>Code d'accès enseignant</label>
          <input
            v-model="registerForm.codeAccesEnseignant"
            type="text"
            placeholder="FEEINS2025"
            required
          />
        </div>

        <!-- Champs Enseignant -->
        <div v-if="registerForm.typeUtilisateur === 'ENSEIGNANT'">
          <div class="form-group">
            <label>Rôle académique</label>
            <input v-model="registerForm.role" type="text" placeholder="Maître de conférences" />
          </div>
          <div class="form-group">
            <label>Spécialité</label>
            <input v-model="registerForm.specialite" type="text" placeholder="Santé numérique" />
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const mode = ref('login')
const loading = ref(false)
const erreur = ref('')
const succes = ref('')

const loginForm = ref({
  email: '',
  motDePasse: ''
})

const registerForm = ref({
  nom: '',
  email: '',
  motDePasse: '',
  typeUtilisateur: 'ETUDIANT',
  codeAccesEnseignant: '',
  role: '',
  specialite: ''
})

// Remplir automatiquement les comptes de test
const remplirAdmin = () => {
  loginForm.value.email = 'admin@feeins.fr'
  loginForm.value.motDePasse = 'admin123'
}
const remplirEnseignant = () => {
  loginForm.value.email = 'marion@feeins.fr'
  loginForm.value.motDePasse = 'prof123'
}
const remplirEtudiant = () => {
  loginForm.value.email = 'etudiant@feeins.fr'
  loginForm.value.motDePasse = 'etudiant123'
}

// Connexion
const login = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const response = await api.post('/api/auth/login', loginForm.value)
    const data = response.data

    // Sauvegarder le token et les infos utilisateur
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      nom: data.nom,
      email: data.email,
      role: data.typeUtilisateur
    }))

    succes.value = `Bienvenue ${data.nom} !`

    // Rediriger selon le rôle
    setTimeout(() => {
      if (data.typeUtilisateur === 'ADMINISTRATEUR_PEDAGOGIQUE') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }, 800)

  } catch (err) {
    erreur.value = err.response?.data?.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}

// Inscription
const register = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const response = await api.post('/api/auth/register', registerForm.value)
    const data = response.data

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      nom: data.nom,
      email: data.email,
      role: data.typeUtilisateur
    }))

    succes.value = `Compte créé avec succès ! Bienvenue ${data.nom}`
    setTimeout(() => router.push('/'), 1000)

  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0533 0%, #b471be 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.brand-logo {
  width: 28px; height: 28px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  border-radius: 7px;
  color: white;
  font-weight: 800;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
}
.brand span {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: rgba(178, 26, 171, 0.9);
  flex: 1;
}
.brand-nav {
  display: flex;
  gap: 5px;
  align-items: center;
}
.login-header {
  text-align: center;
  margin-bottom: 25px;
}
.login-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 5px;
}
.login-header p {
  color: #888;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  margin-bottom: 25px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #dee2e6;
}
.tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}
.tab-active {
  background: #2c3e50;
  color: white;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
.alert-success {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}

.form { display: flex; flex-direction: column; gap: 15px; }

.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}
.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #3498db;
  outline: none;
}

.btn-submit {
  padding: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 5px;
}
.btn-submit:hover:not(:disabled) { background: #3498db; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.comptes-test {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.comptes-test p {
  font-size: 12px;
  color: #888;
  width: 100%;
}
.btn-test {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-test:hover { background: #e9ecef; }
</style>