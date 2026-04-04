<template>
  <div class="login-page">
    <div class="login-card">

      <!-- Logo -->
      <div class="login-header">
        <h1>
          <div class="brand">
            <div class="brand-logo">F</div>
            <span>FEEINS</span>
          </div>
        </h1>
        <p>Catalogue de grains pédagogiques</p>
      </div>

      <!-- Info visiteurs -->
      <div class="info-visiteur">
        ℹ️ <strong>Étudiants et visiteurs</strong> : vous pouvez
        <RouterLink to="/catalogue">consulter le catalogue</RouterLink> et
        <RouterLink to="/quiz">faire le quiz</RouterLink>
        <strong>sans compte</strong>.
      </div>

      <!-- Tabs Login / Register -->
      <div class="tabs">
        <button :class="['tab', mode === 'login' ? 'tab-active' : '']" @click="mode = 'login'">
          Connexion
        </button>
        <button :class="['tab', mode === 'register' ? 'tab-active' : '']" @click="mode = 'register'">
          Inscription
        </button>
      </div>

      <!-- Erreur / Succès -->
      <div v-if="erreur" class="alert-error">⚠️ {{ erreur }}</div>
      <div v-if="succes" class="alert-success">✅ {{ succes }}</div>

      <!-- FORMULAIRE LOGIN -->
      <form v-if="mode === 'login'" @submit.prevent="login" class="form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="loginForm.email" type="email" placeholder="email@feeins.fr" required />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="loginForm.motDePasse" type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <!-- Comptes de test -->
        <div class="comptes-test">
          <p>Comptes de test :</p>
          <button type="button" @click="remplirAdmin" class="btn-test">👑 Admin</button>
          <button type="button" @click="remplirEnseignant" class="btn-test">👨‍🏫 Enseignant</button>
          <button type="button" @click="remplirContributeur" class="btn-test">✏️ Contributeur</button>
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
            <option value="CONTRIBUTEUR">✏️ Contributeur (crée des ressources)</option>
            <option value="ENSEIGNANT">👨‍🏫 Enseignant (crée des templates)</option>
            <option value="ADMINISTRATEUR_PEDAGOGIQUE">👑 Administrateur pédagogique</option>
          </select>
          <small class="hint">
            Les étudiants n'ont pas besoin de compte pour consulter le catalogue.
          </small>
        </div>

        <!-- Code d'accès requis pour tous les rôles -->
        <div class="form-group">
          <label>Code d'accès</label>
          <input
            v-model="registerForm.codeAccesEnseignant"
            type="text"
            placeholder="FEEINS2025"
            required
          />
          <small class="hint">Requis pour tout rôle privilégié.</small>
        </div>

        <!-- Champs spécifiques ENSEIGNANT -->
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

        <!-- Champs spécifiques CONTRIBUTEUR -->
        <div v-if="registerForm.typeUtilisateur === 'CONTRIBUTEUR'">
          <div class="form-group">
            <label>Organisation / Établissement</label>
            <input
              v-model="registerForm.organisation"
              type="text"
              placeholder="ex: ANAP, CHU de Lyon, ISIS..."
            />
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mode = ref('login')
const loading = ref(false)
const erreur = ref('')
const succes = ref('')

const loginForm = ref({ email: '', motDePasse: '' })

const registerForm = ref({
  nom: '',
  email: '',
  motDePasse: '',
  typeUtilisateur: 'CONTRIBUTEUR',
  codeAccesEnseignant: '',
  role: '',
  specialite: '',
  organisation: ''
})

// Comptes de test
const remplirAdmin = () => {
  loginForm.value.email = 'admin@feeins.fr'
  loginForm.value.motDePasse = 'admin123'
}
const remplirEnseignant = () => {
  loginForm.value.email = 'marion@feeins.fr'
  loginForm.value.motDePasse = 'prof123'
}
const remplirContributeur = () => {
  loginForm.value.email = 'contrib@feeins.fr'
  loginForm.value.motDePasse = 'contrib123'
}

// Redirection selon le rôle
const redirectParRole = (typeUtilisateur) => {
  if (typeUtilisateur === 'ADMINISTRATEUR_PEDAGOGIQUE') return router.push('/admin')
  if (typeUtilisateur === 'ENSEIGNANT') return router.push('/enseignant/templates')
  if (typeUtilisateur === 'CONTRIBUTEUR') return router.push('/contributeur/ressources')
  return router.push('/catalogue')
}

// Connexion
const login = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const { data } = await api.post('/api/auth/login', loginForm.value)
    authStore.setSession(data)
    succes.value = `Bienvenue ${data.nom} !`
    setTimeout(() => redirectParRole(data.typeUtilisateur), 800)
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
    const { data } = await api.post('/api/auth/register', registerForm.value)
    authStore.setSession(data)
    succes.value = `Compte créé avec succès ! Bienvenue ${data.nom}`
    setTimeout(() => redirectParRole(data.typeUtilisateur), 1000)
  } catch (err) {
    erreur.value = err.response?.data?.message || "Erreur lors de l'inscription"
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
  background: #151039;
  padding: 20px;
}
.login-card {
  background: rgb(35, 8, 81);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.brand { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.brand-logo {
  width: 28px; height: 28px;
  background: #D4FF00;
  border-radius: 7px;
  color: white; font-weight: 800; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
}
.brand span { font-weight: 700; font-size: 1.25rem; color: #D4FF00; }
.login-header { text-align: center; margin-bottom: 16px; }
.login-header h1 { font-size: 1.6rem; color: white; margin-bottom: 5px; }
.login-header p { color: #888; font-size: 0.9rem; }

.info-visiteur {
  background: rgba(212, 255, 0, 0.08);
  border: 1px solid rgba(212, 255, 0, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 20px;
  line-height: 1.5;
}
.info-visiteur a { color: #D4FF00; text-decoration: underline; }

.tabs { display: flex; margin-bottom: 20px; border-radius: 8px; overflow: hidden; border: 2px solid #3a2870; }
.tab { flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-size: 14px; font-weight: 500; color: #888; transition: all 0.2s; }
.tab-active { background: #2c3e50; color: white; }

.alert-error { background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
.alert-success { background: #d4edda; color: #155724; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }

.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 13px; font-weight: 600; color: #ccc; }
.form-group input, .form-group select {
  padding: 10px 12px;
  border: 1.5px solid #3a2870;
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.07);
  color: white;
  transition: border-color 0.2s;
}
.form-group input::placeholder { color: #666; }
.form-group input:focus, .form-group select:focus { border-color: #D4FF00; outline: none; }
select option { background: #1e1e3f; color: white; }
.hint { font-size: 12px; color: #888; }

.btn-submit {
  padding: 12px; background: #D4FF00; color: #1a1a1a;
  border: none; border-radius: 8px; font-size: 15px;
  font-weight: 700; cursor: pointer; margin-top: 5px;
}
.btn-submit:hover:not(:disabled) { background: #bfe000; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.comptes-test { border-top: 1px solid #2a1f5a; padding-top: 15px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.comptes-test p { font-size: 12px; color: #888; width: 100%; margin: 0 0 4px; }
.btn-test { padding: 6px 12px; background: rgba(255,255,255,0.08); border: 1px solid #3a2870; border-radius: 6px; font-size: 12px; cursor: pointer; color: #ccc; }
.btn-test:hover { background: rgba(255,255,255,0.15); }
</style>
