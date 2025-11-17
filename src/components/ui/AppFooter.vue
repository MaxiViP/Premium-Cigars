<template>
  <footer class="app-footer">
    <div class="container">
      <!-- Верхние разделы -->
      <div class="footer-content">
        <!-- О компании -->
        <div class="footer-section">
          <h3>Premium Cigars</h3>
          <div class="line"></div>
          <p>
            Элитные сигары и аксессуары, созданные для истинных ценителей роскоши, стиля и высокого
            качества.
          </p>
        </div>

        <!-- Категории -->
        <div class="footer-section">
          <h4>Категории</h4>
          <div class="line"></div>
          <ul>
            <li><router-link to="/catalog?category=cigars">Сигары</router-link></li>
            <li><router-link to="/catalog?category=accessories">Аксессуары</router-link></li>
          </ul>
        </div>

        <!-- Контакты -->
        <div class="footer-section">
          <h4>Контакты</h4>
          <div class="line"></div>
          <p>г. Москва, ул. Табачная, 15</p>
          <p>Email: info@premiumcigars.ru</p>
          <p>+7 (905) 735-35-80</p>
        </div>

        <!-- Соцсети -->
        <div class="footer-section">
          <h4>Мы в соцсетях</h4>
          <div class="line"></div>

          <div class="social-icons">
            <!-- Telegram -->
            <a href="https://t.me/PremiumCigarsBot" target="_blank" aria-label="Telegram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path
                  d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12C24 5.373 18.628 0 12 0zm5.056 8.304l-1.87 8.807c-.142.66-.51.82-1.03.51l-2.845-2.097-1.372 1.321c-.152.152-.28.28-.574.28l.206-2.918 5.313-4.802c.232-.206-.05-.32-.36-.114l-6.565 4.13-2.823-.883c-.61-.19-.622-.61.128-.902l10.99-4.234c.51-.19.954.122.792.883z"
                />
              </svg>
            </a>

            <!-- VK -->
            <a href="#" target="_blank" aria-label="VK">
              <svg viewBox="0 0 24 24">
                <path d="M12.77 17.93C7.3 17.93...Z" />
              </svg>
            </a>

            <!-- Max -->
            <a href="#" target="_blank" aria-label="Max">
              <svg viewBox="0 0 24 24">
                <path d="M18.36 3H21L14.44...Z" />
              </svg>
            </a>
          </div>
        </div>
        <div class="footer-section_img"></div>
        <div class="footer-section_img2"></div>
      </div>

      <!-- Нижняя полоса -->
      <div class="footer-bottom">
        <p>&copy; 2025 Premium Cigars. Все права защищены.</p>
        <span>Сделано с уважением к искусству курения</span>
      </div>

      <!-- Кнопка "наверх" -->
      <button class="scroll-top" @click="scrollToTop">↑</button>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Футер */
.app-footer {
  /* background:  url('/images/background/1.jpg') ;
  background-size: auto 100%; */
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 4rem 0 2rem;
  position: relative;
  font-family: 'Georgia', serif;
  border-radius: 25px 25px 0 0;
}

/* Верхняя сетка футера */
.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
  margin-left: 3rem;
}

/* Заголовки секций */
.footer-section h3,
.footer-section h4 {
  color: var(--gold-color);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.line {
  width: 40px;
  height: 2px;
  background: var(--gold-color);
  margin-bottom: 1.2rem;
}

/* Основной текст */
.footer-section p {
  line-height: 1.6;
  color: var(--gold-color);
  opacity: 0.85;
  margin-bottom: 0.5rem;
}

/* Ссылки */
.footer-section a {
  color: var(--gold-color);
  opacity: 0.9;
  text-decoration: none;
  transition:
    0.3s ease,
    color 0.3s ease;
}

.footer-section a:hover {
  color: var(--gold-color);
  opacity: 1;
}

/* Списки */
.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.7rem;
}

.footer-section_img {
  background: url('/images/background/1.jpg');
  background-size: 50%;
  margin: -15px;
}
.footer-section_img2 {
  background: url('/images/background/tabak_list.jpg');
  background-size: 55%;
  margin: -15px;
}

/* Соцсети */
.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: 0.3s ease;
}

.social-icons svg {
  fill: var(--gold-color);
  width: 20px;
  height: 20px;
  transition: fill 0.3s ease;
}

.social-icons a:hover {
  background: var(--gold-color);
  border-color: var(--gold-color);
}

.social-icons a:hover svg {
  fill: #000;
}

/* Нижнее меню */
.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text-light);
}

.footer-bottom span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.6;
  color: var(--gold-color);
}

/* Кнопка "наверх" */
.scroll-top {
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: var(--gold-color);
  border: none;
  color: #000;
  padding: 0.45rem 0.65rem;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
}

.scroll-top:hover {
  background: var(--gold-color);
}

@media (max-width: 930px) {
  .footer-section_img {
    display: none;
  }
  .footer-section_img2 {
    display: none;
  }
}
</style>
