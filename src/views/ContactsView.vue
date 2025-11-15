<template>
  <div class="contacts">
    <div class="container">
      <div class="contacts-header">
        <h1>Контакты</h1>
        <p>Свяжитесь с нами для консультации или посещения нашего бутика</p>
      </div>

      <div class="contacts-content">
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
            <p> Адрес: г.Москва ул. Табачная, 15</p>
          </div>

          <div class="contact-item">
            <h3>🕒 Часы работы</h3>
            <p>Пн-Пт: 10:00 - 22:00</p>
            <p>Сб-Вс: 10:00 - 21:00</p>
          </div>
        </div>

        <div class="contact-form">
          <h3>Напишите нам</h3>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Имя</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>

            <div class="form-group">
              <label for="message">Сообщение</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>

            <button type="submit" class="btn">Отправить</button>
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
  message: ''
})

const submitForm = () => {
  // Здесь будет логика отправки формы
  alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
  form.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
.contacts {
  padding: 2rem 0;
}

.contacts-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contacts-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.contacts-header p {
  font-size: 1.1rem;
  color: var(--text-light);
}

.contacts-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-item h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.contact-item p {
  margin: 0;
  color: var(--text-light);
}

.contact-form {
  background: var(--white);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.contact-form h3 {
  margin-bottom: 1.5rem;
  color: var(--text-dark);
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
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .contacts-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
