<template>
  <footer class="footer">
    <div class="footer-frame">
      <div class="footer-topline">
        <span class="footer-chip">FEEINS</span>
        <span class="footer-rule"></span>
        <span class="footer-note">Formation, ressources et parcours pedagogiques</span>
      </div>

      <div class="footer-container">
        <div class="footer-section brand">
          <div class="footer-brandline">
            <span class="footer-mark">F</span>
            <div>
              <h3>FEEINS</h3>
              <p class="brand-subtitle">Catalogue de ressources en sante numerique</p>
            </div>
          </div>
          <p>
            Plateforme dediee a la formation en sante numerique, pour apprendre,
            creer et partager des ressources pedagogiques dans un cadre structure.
          </p>
        </div>

        <div class="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/catalogue">Catalogue</a></li>
            <li><a href="/templates">Templates</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Cadre</h4>
          <ul>
            <li><a href="#">Mentions legales</a></li>
            <li><a href="#">Confidentialite</a></li>
            <li><a href="#">Conditions d'usage</a></li>
          </ul>
        </div>

        <div class="footer-section footer-partners">
          <h4>Partenaires</h4>
          <div class="partner-grid">
            <span>UC</span>
            <span>UNIT</span>
            <span>ISIS</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 FEEINS</p>
        <p>Tous droits reserves</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 34px 20px 30px;
  color: white;
  position: relative;
}

.footer-frame {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 26px 18px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 30px 30px 22px 22px;
  background:
    linear-gradient(180deg, rgba(15,18,46,0.9), rgba(8,11,29,0.88)),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 96px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 24px 50px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
}

.footer-frame::before {
  content: "";
  position: absolute;
  left: -40px;
  bottom: -50px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,255,0,0.16), transparent 70%);
}

.footer-frame::after {
  content: "";
  position: absolute;
  top: -30px;
  right: -20px;
  width: 240px;
  height: 140px;
  background: radial-gradient(circle, rgba(109,88,255,0.18), transparent 70%);
  filter: blur(18px);
}

.footer-topline {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.footer-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(212,255,0,0.14);
  border: 1px solid rgba(212,255,0,0.2);
  color: #d4ff00;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.footer-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.24), rgba(255,255,255,0.04));
}

.footer-note {
  color: rgba(255,255,255,0.54);
  font-size: 0.8rem;
}

.footer-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 0.8fr 0.9fr;
  gap: 34px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.footer-brandline {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.footer-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #d4ff00, #9ec400);
  color: #101828;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(212,255,0,0.16);
}

.brand h3 {
  font-size: 1.35rem;
  margin: 0 0 4px;
}

.brand-subtitle {
  margin: 0;
  color: rgba(255,255,255,0.56);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-section h4 {
  margin: 0 0 14px;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #8ce7ff;
}

.footer-section p {
  color: rgba(255,255,255,0.68);
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 0.25s ease, transform 0.25s ease;
  display: inline-flex;
}

.footer-section a:hover {
  color: white;
  transform: translateX(3px);
}

.partner-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.partner-grid span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  font-size: 0.88rem;
  font-weight: 700;
}

.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.45);
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .footer-frame {
    padding: 22px 18px 18px;
  }

  .footer-topline,
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-container {
    grid-template-columns: 1fr;
  }

  .partner-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
