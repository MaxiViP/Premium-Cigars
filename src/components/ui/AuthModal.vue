<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>

      <!-- Вкладки -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'email' }" @click="activeTab = 'email'">
          Email / Пароль
        </button>
        <button :class="{ active: activeTab === 'phone' }" @click="activeTab = 'phone'">
          Телефон
        </button>
      </div>

      <!-- Email / Пароль -->
      <div v-if="activeTab === 'email'">
        <h2>{{ mode === 'login' ? 'Вход' : 'Регистрация' }}</h2>
        <form @submit.prevent="submitEmail">
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" v-model="password" required />
          </div>
          <button type="submit" class="btn-submit">
            {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </form>
        <p class="toggle-mode">
          <span @click="toggleMode">
            {{ mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
          </span>
        </p>
      </div>

      <!-- Телефон -->
      <div v-if="activeTab === 'phone'" class="auth-card">
        <h2>Вход / Регистрация по телефону</h2>
        <div v-if="step === 1">
          <label>Номер телефона</label>
          <input v-model="phone" placeholder="+7..." />
          <button @click="sendCode" :disabled="loading">Отправить код</button>
        </div>
        <div v-else>
          <label>Код из SMS</label>
          <input v-model="code" placeholder="123456" />
          <button @click="verifyCode" :disabled="loading">Подтвердить</button>
          <button @click="step = 1" class="link">Изменить номер</button>
        </div>
        <div class="divider">ИЛИ</div>
        <OAuthButtons />
      </div>

      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import OAuthButtons from '../auth/OAuthButtons.vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

const props = defineProps<{ isOpen: boolean; onClose: () => void }>()

const auth = useAuthStore()
const router = useRouter()

// Email / Пароль
const email = ref('')
const password = ref('')
const mode = ref<'login' | 'register'>('login')

// Телефон
const phone = ref('')
const code = ref('')
const step = ref(1)
const loading = ref(false)

// Вкладки
const activeTab = ref<'email' | 'phone'>('email')


// Email submit
const submitEmail = async () => {
  try {
    if (mode.value === 'login') {
      const res = await axios.post('/auth/login', { email: email.value, password: password.value })
      auth.setToken(res.data.accessToken)
    } else {
      await axios.post('/auth/register', { email: email.value, password: password.value })
      mode.value = 'login'
      await submitEmail()
      return
    }

    // Показываем сообщение об успешной авторизации
    successMessage.value = 'Авторизация успешна, перенаправление...'
    setTimeout(() => {
      props.onClose()
      router.push('/profile')
    }, 1000)
  } catch (e: any) {
    alert(e?.response?.data?.error || e.message)
  }
}

// Телефонная логика
const verifyCode = async () => {
  loading.value = true
  try {
    const res = await axios.post('/auth/phone/verify', { phone: phone.value, code: code.value })
    auth.setToken(res.data.tokens.access)
    await auth.fetchMe()

    successMessage.value = 'Авторизация успешна, перенаправление...'
    setTimeout(() => {
      props.onClose()
      router.push('/profile')
    }, 1000)
  } catch (e: any) {
    alert(e?.response?.data?.error || e.message)
  } finally {
    loading.value = false
  }
}

const successMessage = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
}

const close = () => props.onClose()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: var(--dark-bg);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  position: relative;
  color: #fff;
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--white);
}
.form-group {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.btn-submit {
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: none;
  background: var(--gold-color);
  color: #fff;
  cursor: pointer;
}
.toggle-mode {
  margin-top: 1rem;
  text-align: center;
  color: var(--white);
  cursor: pointer;
  font-size: 0.9rem;
}
.toggle-mode span:hover {
  text-decoration: underline;
}
.success-message {
  background: #27ae60;
  color: #fff;
  padding: 0.7rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}

/* Вкладки */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.tabs button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
}
.tabs button.active {
  background: var(--gold-color);
  color: #000;
}

/* Телефонная форма */
.auth-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.auth-card .divider {
  text-align: center;
  margin: 1rem 0;
  font-weight: bold;
}
.auth-card .link {
  background: none;
  border: none;
  color: var(--gold-color);
  cursor: pointer;
  margin-top: 0.5rem;
}
</style>
