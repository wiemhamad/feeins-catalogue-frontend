<template>
<footer class="footer">
  <div class="footer-container">
    <div class="footer-section">
      <h4>FEEINS</h4>
      <p>Former des designers et des étudiants ingénieurs en Santé Numérique.</p>
    </div>

    <div class="footer-section">
      <h4>Liens utiles</h4>
      <ul>
        <li><a href="#">À propos</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Mentions légales</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Partenaires</h4>
      <p>UC • Unit • ISIS</p>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2026 FEEINS. Tous droits réservés.</p>
  </div>
</footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(135deg,#d4ff0074 50%,#120F34 50%);
  border-top: none;
  padding: 40px 20px 20px;
  color: white;
  font-size: 0.95rem;
  margin-top: 60px;
}

.footer-container {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-section h4 {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-section p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section a {
  color: white;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-section a:hover {
  opacity: 1;
}

.footer-bottom {
  max-width: 1180px;
  margin: 0 auto;
  padding-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>