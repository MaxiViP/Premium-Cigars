<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Premium Cigars</h3>
          <p>Элитные сигары и аксессуары для истинных ценителей.</p>
        </div>

        <div class="footer-section">
          <h4>Категории</h4>
          <ul>
            <li><router-link to="/catalog?category=cigars">Сигары</router-link></li>
            <li><router-link to="/catalog?category=accessories">Аксессуары</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Контакты</h4>
          <p>Адрес: г.Москва ул. Табачная, 15</p>
          <p>Email: info@premiumcigars.ru</p>
          <p>Телефон: +7 (905) 735-35-80</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Premium Cigars. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-footer {
  background: var(--text-dark);
  color: var(--white);
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--white);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--secondary-color);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}
</style>
