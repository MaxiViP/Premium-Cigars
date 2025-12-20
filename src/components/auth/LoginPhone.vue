<!-- <template>
  <div class="auth-card">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import OAuthButtons from './OAuthButtons.vue'
import { useRouter } from 'vue-router'
import type { ApiError } from '@/types/errors'

const router = useRouter()
const auth = useAuthStore()

const phone = ref('')
const code = ref('')
const step = ref(1)
const loading = ref(false)

async function sendCode() {
  loading.value = true
  try {
    await axios.post('/auth/phone/send', { phone: phone.value })
    step.value = 2
  } catch (error) {
    const e = error as ApiError
    alert(e?.response?.data?.error || e.message)
  } finally {
    loading.value = false
  }
}

async function verifyCode() {
  loading.value = true
  try {
    const res = await axios.post('/auth/phone/verify', { phone: phone.value, code: code.value })
    auth.setToken(res.data.tokens.access)
    await auth.fetchMe()
    router.push('/profile')
  } catch (error) {
    const e = error as ApiError
    alert(e?.response?.data?.error || e.message)
  } finally {
    loading.value = false
  }
}
</script> -->
