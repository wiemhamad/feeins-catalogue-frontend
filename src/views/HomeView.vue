<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-content">

        <div class="pricing">

          <!-- Carte Visiteur / Étudiant -->
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Visiteur / Étudiant</p>
            <span>
              Consultez le catalogue, faites le quiz de positionnement et accédez aux ressources
              — <strong>sans compte requis</strong>.
            </span>
            <RouterLink to="/catalogue" class="btn">ACCÉDER AU CATALOGUE</RouterLink>
          </div>

          <!-- Carte Contributeur -->
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Contributeur</p>
            <span>
              Vous créez et proposez des ressources pédagogiques.
              Elles sont validées par l'administrateur avant publication.
            </span>
            <RouterLink to="/login" class="btn">SE CONNECTER</RouterLink>
          </div>

          <!-- Carte Enseignant -->
          <div class="price-card">
            <div class="price">VOUS ÊTES</div>
            <p>Enseignant</p>
            <span>
              Vous composez des templates pédagogiques à partir de ressources
              validées existantes dans le catalogue.
            </span>
            <RouterLink to="/login" class="btn">SE CONNECTER</RouterLink>
          </div>

        </div>

        <div class="hero-text">
          <h1>
            BOOSTEZ VOTRE APPRENTISSAGE <br />
            AVEC DES RESSOURCES E-SANTÉ
          </h1>
          <p>
            Accédez à une plateforme moderne pour apprendre, réviser et progresser
            en santé numérique grâce à des contenus interactifs.
          </p>
          <RouterLink to="/catalogue" class="cta">ACCÉDER AU CATALOGUE</RouterLink>
        </div>

      </div>

      <div class="hero-illustration">
        <img src="https://assets.website-files.com/62ce572e448ae60684f0d244/62ce5c62fd06b3ba30e2a39e_hero.svg" alt="illustration" />
      </div>
    </section>
  </div>
</template>

<script setup></script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f2a, #1f1147);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 100vh;
  padding: 40px 20px;
}

.hero-content { flex: 1; }

.pricing { display: flex; gap: 20px; margin-bottom: 50px; flex-wrap: wrap; }

.price-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  text-align: left;
  width: 200px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
}
.price-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

.price { font-size: 12px; font-weight: 700; color: #7df9ff; letter-spacing: 1px; margin-bottom: 8px; }
.price-card p { font-size: 18px; margin: 0 0 8px; font-weight: 700; }
.price-card span { display: block; font-size: 13px; color: #bbb; line-height: 1.5; margin-bottom: 12px; }

.btn {
  display: inline-block;
  margin-top: 10px;
  background: #d4ff00;
  color: black;
  padding: 9px 14px;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
}

.hero-text h1 { font-size: 38px; line-height: 1.2; margin-bottom: 20px; }
.hero-text p { color: #bbb; margin-bottom: 25px; max-width: 500px; }

.cta {
  background: #d4ff00; padding: 14px 28px;
  color: black; font-weight: bold; border-radius: 6px; text-decoration: none;
}

.hero-illustration img { width: 440px; }

@media (max-width: 900px) {
  .hero { flex-direction: column; text-align: center; padding: 60px 20px; }
  .pricing { justify-content: center; }
  .price-card { width: 100%; max-width: 280px; }
  .hero-illustration { display: none; }
}
</style>
