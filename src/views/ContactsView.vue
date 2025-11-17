<template>
  <div class="contacts">
    <div class="container">
      <!-- Заголовок -->
      <div class="contacts-header">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами для консультации или посещения нашего бутика</p>
      </div>

      <!-- Контент -->
      <div class="contacts-content">
        <!-- Информация -->
        <div class="contact-info">
          <div class="contact-item">
            <h3>📞 Телефон</h3>
            <p>+7 (905) 735-35-80</p>
          </div>

          <div class="contact-item">
            <h3>✉️ Email</h3>
            <p>info@premiumcigars.ru</p>
          </div>

          <div class="contact-item">
            <h3>📍 Адрес</h3>
            <p>г. Москва, ул. Табачная, 15</p>
          </div>

          <div class="contact-item">
            <h3>🕒 Часы работы</h3>
            <p>Пн-Пт: 10:00 - 22:00</p>
            <p>Сб-Вс: 10:00 - 21:00</p>
          </div>
        </div>

        <!-- Форма -->
        <div class="contact-form">
          <h3>Напишите нам</h3>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Имя</label>
              <input type="text" id="name" v-model="form.name" required />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>

            <div class="form-group">
              <label for="message">Сообщение</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>

            <button type="submit" class="btn btn-gold">Отправить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
})

const submitForm = () => {
  alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
  form.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
:root {
  --gold-color: #d4af37;
  --gold-light: #f4d67c;
  --text-dark: #2c2c2c;
  --text-light: #666;
  --white: #ffffff;
  --border: #e0e0e0;
  --shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.contacts {
  padding: 4rem 0;
  background: #f8f5f2;
}

.contacts-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contacts-header h1 {
  font-size: 2.8rem;
  margin-bottom: 0.8rem;
  color: var(--text-dark);
  position: relative;
}

.contacts-header h1::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: var(--gold-color);
  margin: 10px auto 0;
  border-radius: 2px;
}

.contacts-header p {
  font-size: 1.15rem;
  color: var(--text-light);
}

.contacts-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* Информация */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.contact-item h3 {
  color: var(--gold-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  transition: 0.3s;
}

.contact-item h3:hover {
  text-shadow:
    0 0 5px var(--gold-light),
    0 0 10px var(--gold-color);
}

.contact-item p {
  margin: 0;
  color: var(--text-dark);
  font-weight: 500;
}

/* Форма */
.contact-form {
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.contact-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.contact-form h3 {
  margin-bottom: 1.5rem;
  color: var(--gold-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--gold-color);
  box-shadow: 0 0 8px var(--gold-light);
}

.btn-gold {
  background: var(--gold-color);
  color: #000;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gold:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .contacts-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-info { 
    gap: 1rem;
    padding: 1rem;
  }
}
</style>
