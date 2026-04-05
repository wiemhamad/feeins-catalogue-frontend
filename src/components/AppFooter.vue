<template>
  <footer class="footer">

    <div class="footer-container">

      <!-- BRAND -->
      <div class="footer-section brand">
        <h3>FEEINS</h3>
        <p>
          Plateforme dédiée à la formation en santé numérique,
          pour apprendre, créer et partager des ressources pédagogique.
        </p>
      </div>

      <!-- NAVIGATION -->
      <div class="footer-section">
        <h4>Navigation</h4>
        <ul>
          <li><a href="/">Accueil</a></li>
          <li><a href="/catalogue">Catalogue</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <!-- LEGAL -->
      <div class="footer-section">
        <h4>Légal</h4>
        <ul>
          <li><a href="#">Mentions légales</a></li>
          <li><a href="#">Confidentialité</a></li>
        </ul>
      </div>

      <!-- PARTENAIRES -->
      <div class="footer-section">
        <h4>Partenaires</h4>
        <p>UC • UNIT • ISIS</p>
      </div>

    </div>

    <!-- BOTTOM -->
    <div class="footer-bottom">
      <p>© 2026 FEEINS — Tous droits réservés</p>
    </div>

  </footer>
</template>

<script setup>
</script>

<style scoped>

/* FOOTER GLOBAL */
.footer {
  width: 100%;
  padding: 60px 20px 30px;
  background: linear-gradient(135deg, #0b0f2a, #1f1147);
  color: white;
  position: relative;
  overflow: hidden;
}

/* GLOW EFFECT */
.footer::before {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(125, 249, 255, 0.15);
  filter: blur(120px);
  top: -100px;
  left: -100px;
}

/* CONTAINER */
.footer-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;

  padding-bottom: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* SECTIONS */
.footer-section h4 {
  margin-bottom: 12px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7df9ff;
}

.footer-section p {
  color: #bbb;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* BRAND */
.brand h3 {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

/* LIST */
.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

/* LINKS */
.footer-section a {
  color: #bbb;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-section a:hover {
  color: #7df9ff;
  transform: translateX(4px);
}

/* BOTTOM */
.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 0.8rem;
  color: #888;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .footer {
    text-align: center;
  }
}

</style>