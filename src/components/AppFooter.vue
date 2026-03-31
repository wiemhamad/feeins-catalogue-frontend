<template>
<footer class="footer">
  <div>
    <h4>FEEINS</h4>
    <p>
      Former des designers et des étudiants ingénieurs en Santé Numérique.
    </p>
  </div>

  <div>
    <h4>Liens utiles</h4>
    <p>À propos</p>
    <p>Contact</p>
    <p>Mentions légales</p>
  </div>

  <div>
    <h4>Partenaires</h4>
    <p>UC • Unit • ISIS</p>
  </div>
</footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: #f2f6ff;
  border-top: 1px solid #dbe4f0;
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  color: #1f2d3f;
  font-size: 0.9rem;
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 10;
}
.footer h4 {
  margin: 0 0 8px;
  font-size: 0.95rem;
}
.footer p {
  margin: 0;
}
</style>