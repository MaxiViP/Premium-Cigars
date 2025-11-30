<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content" @click.stop>
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

      <!-- Email + Пароль -->
      <div v-if="activeTab === 'email'">
        <h2>{{ mode === 'login' ? 'Вход' : 'Регистрация' }}</h2>

        <form @submit.prevent="submitEmail">
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model.trim="email"
              required
              autocomplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div class="form-group">
            <label>Пароль</label>
            <input
              type="password"
              v-model="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </form>

        <p class="toggle-mode">
          <span @click="toggleMode">
            {{ mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
          </span>
        </p>
      </div>

      <!-- Телефон + OAuth -->
      <div v-if="activeTab === 'phone'" class="auth-card">
        <h2>Вход через телефон или соцсети</h2>

        <!-- Шаг 1: ввод номера -->
        <div v-if="phoneStep === 1">
          <div class="form-group">
            <label>Номер телефона</label>
            <input v-model="phone" placeholder="+7 (999) 123-45-67" type="tel" />
          </div>
          <button @click="sendCode" :disabled="loading || !phone" class="btn-submit">
            {{ loading ? 'Отправляем...' : 'Отправить код' }}
          </button>
        </div>

        <!-- Шаг 2: ввод кода -->
        <div v-else>
          <p class="info-text">Код отправлен на {{ phone }}</p>
          <div class="form-group">
            <label>Код из SMS</label>
            <input
              v-model="code"
              placeholder="123456"
              maxlength="6"
              type="text"
              inputmode="numeric"
            />
          </div>

          <button @click="verifyCode" :disabled="loading" class="btn-submit">Подтвердить</button>

          <button
            @click="
              () => {
                phoneStep = 1
                code = ''
              }
            "
            class="link"
          >
            Изменить номер
          </button>
        </div>

        <div class="divider">ИЛИ</div>
        <OAuthButtons />
      </div>

      <!-- Успешное сообщение -->
      <transition name="fade">
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import OAuthButtons from '@/components/auth/OAuthButtons.vue'
import axios from '@/plugins/axios'

const props = defineProps<{
  isOpen: boolean
  onClose: () => void
}>()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// Состояния
const activeTab = ref<'email' | 'phone'>('email')
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const phone = ref('')
const code = ref('')
const phoneStep = ref(1)
const loading = ref(false)
const successMessage = ref('')

// Вспомогательная функция для обработки ошибок
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: string } } }
    return axiosError.response?.data?.error || 'Ошибка сервера'
  }
  return 'Неизвестная ошибка'
}

// ========================
// АВТОМАТИЧЕСКОЕ ЗАКРЫТИЕ ПРИ УСПЕШНОЙ АВТОРИЗАЦИИ
// ========================

// Следим за состоянием авторизации
watch(
  () => auth.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated && props.isOpen) {
      console.log('User authenticated, closing modal...')
      success('Авторизация успешна!')
    }
  }
)

// Методы
const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
}

const submitEmail = async () => {
  loading.value = true
  try {
    let res
    if (mode.value === 'login') {
      res = await axios.post('/auth/login', { email: email.value, password: password.value })
    } else {
      await axios.post('/auth/register', { email: email.value, password: password.value })
      res = await axios.post('/auth/login', { email: email.value, password: password.value })
    }

    auth.setTokens(res.data.tokens)
    await auth.fetchMe()
    // Модальное окно закроется автоматически через watch
  } catch (error) {
    alert(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

const sendCode = async () => {
  loading.value = true
  try {
    await axios.post('/auth/phone/send', { phone: phone.value })
    phoneStep.value = 2
  } catch (error) {
    alert(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  loading.value = true
  try {
    const res = await axios.post('/auth/phone/verify', { phone: phone.value, code: code.value })
    auth.setTokens(res.data.tokens)
    await auth.fetchMe()
    // Модальное окно закроется автоматически через watch
  } catch (error) {
    alert(getErrorMessage(error))
  } finally {
    loading.value = false
  }
}

const success = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => {
    closeModal()
    router.push('/profile')
  }, 1200)
}

const closeModal = () => {
  // Сбрасываем все состояния
  email.value = ''
  password.value = ''
  phone.value = ''
  code.value = ''
  phoneStep.value = 1
  mode.value = 'login'
  activeTab.value = 'email'
  successMessage.value = ''
  loading.value = false

  // Закрываем модальное окно
  props.onClose()
}

const close = () => {
  closeModal()
}

// Обработка OAuth success редиректа
onMounted(() => {
  if (route.path === '/auth/success' && route.query.access) {
    const access = route.query.access as string
    const refresh = route.query.refresh as string

    auth.setTokens({ access, refresh })
    auth.fetchMe().then(() => {
      successMessage.value = 'Вход через Google/Yandex успешен!'
      setTimeout(() => {
        router.replace('/profile')
        closeModal()
      }, 1200)
    })
  }
})

// Следим за изменениями маршрута для OAuth
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/auth/success' && route.query.access && props.isOpen) {
      const access = route.query.access as string
      const refresh = route.query.refresh as string

      auth.setTokens({ access, refresh })
      auth.fetchMe().then(() => {
        successMessage.value = 'Вход через Google/Yandex успешен!'
        setTimeout(() => {
          router.replace('/profile')
          closeModal()
        }, 1200)
      })
    }
  }
)
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  position: relative;
  color: white;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;
}

.close-btn:hover {
  color: white;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.8rem;
  background: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.tabs button.active {
  background: #b8860b;
  color: black;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #222;
  color: white;
  font-size: 1rem;
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  background: #b8860b;
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #d4a017;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-mode {
  text-align: center;
  margin-top: 1rem;
  color: #aaa;
  font-size: 0.9rem;
}

.toggle-mode span {
  color: #b8860b;
  cursor: pointer;
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #aaa;
  font-weight: bold;
}

.link {
  background: none;
  border: none;
  color: #b8860b;
  cursor: pointer;
  margin-top: 0.8rem;
  text-decoration: underline;
  font-size: 0.9rem;
}

.info-text {
  margin: 0 0 1rem;
  color: #b8860b;
  font-size: 0.95rem;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #27ae60;
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
