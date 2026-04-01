<template>
  <div class="landing-page">

    <!-- HERO -->
    <section class="hero">

      <div class="hero-content">

        <!-- Cards -->
        <div class="pricing">
          
          <!-- Apprenant -->
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Apprenant</p>
            <span>
              Accédez à des cours, vidéos et quiz interactifs pour améliorer
              vos compétences en e-santé.
            </span>
            <RouterLink to="/catalogue" class="btn">COMMENCER</RouterLink>
          </div>

          <!-- Créateur -->
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Créateur</p>
            <span>
              Créez, gérez et partagez vos ressources pédagogiques avec vos étudiants.
            </span>
            <RouterLink to="/login" class="btn">SE CONNECTER</RouterLink>
          </div>

        </div>

        <!-- Texte -->
        <div class="hero-text">
          <h1>
            BOOSTEZ VOTRE APPRENTISSAGE <br />
            AVEC DES RESSOURCES E-SANTÉ
          </h1>

          <p>
            Accédez à une plateforme moderne pour apprendre, réviser et progresser
            en santé numérique grâce à des contenus interactifs.
          </p>

          <RouterLink to="/catalogue" class="cta">
            ACCÉDER AU CATALOGUE
          </RouterLink>
        </div>

      </div>

      <!-- Image -->
      <div class="hero-illustration">
        <img src="https://assets.website-files.com/62ce572e448ae60684f0d244/62ce5c62fd06b3ba30e2a39e_hero.svg" />
      </div>

    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>

/* GLOBAL */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f2a, #1f1147);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* HERO */
.hero {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 100vh;
  padding: 0;
}

/* LEFT */
.hero-content {
  flex: 1;
}

/* CARDS */
.pricing {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
}

.price-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  padding: 28px;
  border-radius: 16px;
  text-align: left;
  width: 240px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}

.price-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.price {
  font-size: 13px;
  font-weight: 700;
  color: #7df9ff;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.price-card p {
  font-size: 20px;
  margin: 0 0 10px;
  font-weight: 700;
}

.price-card span {
  display: block;
  font-size: 14px;
  color: #bbb;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* BUTTON */
.btn {
  display: inline-block;
  margin-top: 10px;
  background: #d4ff00;
  color: black;
  padding: 10px 16px;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
}

/* TEXT */
.hero-text h1 {
  font-size: 42px;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-text p {
  color: #bbb;
  margin-bottom: 25px;
  max-width: 500px;
}

.cta {
  background: #d4ff00;
  padding: 14px 28px;
  color: black;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
}

/* IMAGE */
.hero-illustration img {
  width: 480px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .pricing {
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
}

</style>