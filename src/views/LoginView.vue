<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-orb orb-a"></div>
      <div class="login-orb orb-b"></div>
      <div class="login-orb orb-c"></div>
      <div class="login-grid"></div>
      <div class="login-beam beam-a"></div>
      <div class="login-beam beam-b"></div>
    </div>

    <div class="login-card">
      <section class="login-aside">
        <div class="eyebrow">Plateforme pedagogique</div>

        <div class="aside-copy">
          <h1>Connectez-vous a l'espace FEEINS</h1>
          <p>
            Accedez a vos ressources, a vos parcours et a vos outils de contribution
            dans une interface plus claire, plus elegante et plus chaleureuse.
          </p>
        </div>

        <div class="aside-panels">
          <div class="aside-panel">
            <span class="panel-kicker">Acces rapide</span>
            <strong>Catalogue, quiz et parcours personnalises</strong>
            <p>Les visiteurs peuvent deja explorer le contenu sans compte.</p>
          </div>

          <div class="aside-stats">
            <div class="stat-card">
              <span class="stat-value">3</span>
              <span class="stat-label">profils de connexion</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">24/7</span>
              <span class="stat-label">acces a la plateforme</span>
            </div>
          </div>
        </div>
      </section>

      <section class="login-main">
        <div class="login-header">
          <div class="brand">
            <div class="brand-logo">F</div>
            <span>FEEINS</span>
          </div>
          <p>Catalogue de grains pedagogiques</p>
        </div>

        <div class="info-visiteur">
          <strong>Etudiants et visiteurs</strong> : vous pouvez
          <RouterLink to="/catalogue">consulter le catalogue</RouterLink> et
          <RouterLink to="/quiz">faire le quiz</RouterLink>
          <strong>sans compte</strong>.
        </div>

        <div class="tabs">
          <button :class="['tab', mode === 'login' ? 'tab-active' : '']" @click="mode = 'login'">
            Connexion
          </button>
          <button :class="['tab', mode === 'register' ? 'tab-active' : '']" @click="mode = 'register'">
            Inscription
          </button>
        </div>

        <div v-if="erreur" class="alert-error">{{ erreur }}</div>
        <div v-if="succes" class="alert-success">{{ succes }}</div>

        <form v-if="mode === 'login'" @submit.prevent="login" class="form">
          <div class="form-group">
            <label>Email</label>
            <input v-model="loginForm.email" type="email" placeholder="email@feeins.fr" required />
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input v-model="loginForm.motDePasse" type="password" placeholder="........" required />
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <div class="comptes-test">
            <p>Comptes de test</p>
            <button type="button" @click="remplirAdmin" class="btn-test">Admin</button>
            <button type="button" @click="remplirEnseignant" class="btn-test">Enseignant</button>
            <button type="button" @click="remplirContributeur" class="btn-test">Contributeur</button>
          </div>
        </form>

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
            <input v-model="registerForm.motDePasse" type="password" placeholder="........" required />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="registerForm.typeUtilisateur">
              <option value="CONTRIBUTEUR">Contributeur (cree des ressources)</option>
              <option value="ENSEIGNANT">Enseignant (cree des templates)</option>
              <option value="ADMINISTRATEUR_PEDAGOGIQUE">Administrateur pedagogique</option>
            </select>
            <small class="hint">
              Les etudiants n'ont pas besoin de compte pour consulter le catalogue.
            </small>
          </div>

          <div class="form-group">
            <label>Code d'acces</label>
            <input
              v-model="registerForm.codeAccesEnseignant"
              type="text"
              placeholder="FEEINS2025"
              required
            />
            <small class="hint">Requis pour tout role privilegie.</small>
          </div>

          <div v-if="registerForm.typeUtilisateur === 'ENSEIGNANT'">
            <div class="form-group">
              <label>Role academique</label>
              <input v-model="registerForm.role" type="text" placeholder="Maitre de conferences" />
            </div>
            <div class="form-group">
              <label>Specialite</label>
              <input v-model="registerForm.specialite" type="text" placeholder="Sante numerique" />
            </div>
          </div>

          <div v-if="registerForm.typeUtilisateur === 'CONTRIBUTEUR'">
            <div class="form-group">
              <label>Organisation / Etablissement</label>
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
      </section>
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

const remplirAdmin = () => {
  loginForm.value.email = 'admin@feeins.fr'
  loginForm.value.motDePasse = 'admin123'
}

const remplirEnseignant = () => {
  loginForm.value.email = 'marion@feeins.fr'
  loginForm.value.motDePasse = 'prof123'
}

const remplirContributeur = () => {
  loginForm.value.email = 'contributeur@feeins.fr'
  loginForm.value.motDePasse = 'contributeur'
}

const redirectParRole = (typeUtilisateur) => {
  if (typeUtilisateur === 'ADMINISTRATEUR_PEDAGOGIQUE') return router.push('/admin')
  if (typeUtilisateur === 'ENSEIGNANT') return router.push('/enseignant/templates')
  if (typeUtilisateur === 'CONTRIBUTEUR') return router.push('/contributeur/ressources')
  return router.push('/catalogue')
}

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

const register = async () => {
  loading.value = true
  erreur.value = ''
  try {
    const { data } = await api.post('/api/auth/register', registerForm.value)
    authStore.setSession(data)
    succes.value = `Compte cree avec succes ! Bienvenue ${data.nom}`
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
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(212, 255, 0, 0.06), transparent 22%),
    linear-gradient(150deg, #0b061c 0%, #14082f 34%, #101f4e 68%, #14051e 100%);
  padding: 28px;
}

.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.login-orb,
.login-grid,
.login-beam {
  position: absolute;
  pointer-events: none;
}

.login-orb {
  border-radius: 50%;
  filter: blur(88px);
}

.orb-a {
  width: 420px;
  height: 420px;
  top: -80px;
  left: -120px;
  background: radial-gradient(circle, rgba(64, 198, 255, 0.22) 0%, transparent 70%);
}

.orb-b {
  width: 520px;
  height: 520px;
  right: -180px;
  top: -110px;
  background: radial-gradient(circle, rgba(140, 92, 246, 0.26) 0%, transparent 70%);
}

.orb-c {
  width: 420px;
  height: 420px;
  bottom: -180px;
  left: 30%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, transparent 70%);
}

.login-grid {
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: 84px 84px;
  mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.85), transparent 82%);
  opacity: 0.16;
}

.login-beam {
  width: 34vw;
  max-width: 380px;
  min-width: 220px;
  height: 130vh;
  top: -15vh;
  filter: blur(22px);
  opacity: 0.24;
}

.beam-a {
  left: 2%;
  transform: rotate(-18deg);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(77, 179, 255, 0.28) 34%, rgba(77, 179, 255, 0.04) 76%, rgba(255,255,255,0) 100%);
}

.beam-b {
  right: 8%;
  transform: rotate(18deg);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(177, 107, 255, 0.24) 34%, rgba(177, 107, 255, 0.05) 78%, rgba(255,255,255,0) 100%);
}

.login-card {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(250px, 0.95fr) minmax(360px, 1fr);
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(20, 11, 48, 0.94), rgba(18, 26, 67, 0.9));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 28px;
  width: 100%;
  max-width: 1020px;
  box-shadow:
    0 35px 90px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.08);
}

.login-aside {
  position: relative;
  padding: 42px 36px;
  background:
    radial-gradient(circle at top left, rgba(212, 255, 0, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border-right: 1px solid rgba(255,255,255,0.08);
}

.login-aside::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 32px;
  bottom: 32px;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.22), transparent);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(212, 255, 0, 0.22);
  background: rgba(212, 255, 0, 0.08);
  color: #d4ff00;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 24px;
}

.aside-copy h1 {
  margin: 0;
  color: white;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.aside-copy p {
  margin: 16px 0 0;
  color: rgba(255,255,255,0.68);
  line-height: 1.65;
  max-width: 28rem;
}

.aside-panels {
  margin-top: 34px;
  display: grid;
  gap: 16px;
}

.aside-panel {
  padding: 18px 18px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.panel-kicker {
  display: block;
  margin-bottom: 8px;
  color: rgba(212,255,0,0.9);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.aside-panel strong {
  display: block;
  color: white;
  font-size: 1rem;
  line-height: 1.35;
}

.aside-panel p {
  margin: 8px 0 0;
  color: rgba(255,255,255,0.58);
  font-size: 0.9rem;
  line-height: 1.55;
}

.aside-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 16px;
  border-radius: 18px;
  background: rgba(10, 13, 36, 0.42);
  border: 1px solid rgba(255,255,255,0.08);
}

.stat-value {
  display: block;
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255,255,255,0.58);
  font-size: 0.82rem;
  line-height: 1.45;
}

.login-main {
  padding: 36px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.brand-logo {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #d4ff00, #93d500);
  border-radius: 10px;
  color: #182038;
  font-weight: 800;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(212, 255, 0, 0.24);
}

.brand span {
  font-weight: 800;
  font-size: 1.15rem;
  color: #f5f7ff;
  letter-spacing: 0.04em;
}

.login-header {
  margin-bottom: 18px;
}

.login-header p {
  color: rgba(255,255,255,0.52);
  font-size: 0.92rem;
  margin: 0;
}

.info-visiteur {
  background: linear-gradient(135deg, rgba(212, 255, 0, 0.1), rgba(92, 164, 255, 0.06));
  border: 1px solid rgba(212, 255, 0, 0.16);
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 13px;
  color: #dbe4f5;
  margin-bottom: 22px;
  line-height: 1.5;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.info-visiteur a {
  color: #d4ff00;
  text-decoration: none;
  border-bottom: 1px solid rgba(212,255,0,0.4);
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  padding: 6px;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
}

.tab {
  flex: 1;
  padding: 11px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255,255,255,0.48);
  transition: all 0.2s;
  border-radius: 12px;
}

.tab-active {
  background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06));
  color: white;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.alert-error {
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid rgba(248,113,113,0.24);
}

.alert-success {
  background: rgba(74, 222, 128, 0.12);
  color: #bbf7d0;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid rgba(74,222,128,0.22);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.82);
}

.form-group input,
.form-group select {
  padding: 13px 14px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  font-size: 14px;
  background: rgba(255,255,255,0.06);
  color: white;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: rgba(255,255,255,0.26);
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(212,255,0,0.7);
  background: rgba(255,255,255,0.08);
  outline: none;
  box-shadow: 0 0 0 4px rgba(212,255,0,0.08);
}

select option {
  background: #1e1e3f;
  color: white;
}

.hint {
  font-size: 12px;
  color: rgba(255,255,255,0.42);
}

.btn-submit {
  padding: 14px;
  background: linear-gradient(135deg, #d4ff00, #7fd3ff);
  color: #10162d;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 14px 30px rgba(127, 211, 255, 0.18);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(127, 211, 255, 0.24);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comptes-test {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.comptes-test p {
  font-size: 12px;
  color: rgba(255,255,255,0.46);
  width: 100%;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.btn-test {
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  color: #edf2ff;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.btn-test:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(212,255,0,0.2);
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .login-card {
    grid-template-columns: 1fr;
    max-width: 560px;
  }

  .login-aside {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .login-aside::after {
    display: none;
  }
}

@media (max-width: 520px) {
  .login-page {
    padding: 16px;
  }

  .login-main,
  .login-aside {
    padding: 24px 20px;
  }

  .aside-stats {
    grid-template-columns: 1fr;
  }

  .brand span {
    font-size: 1rem;
  }
}
</style>
