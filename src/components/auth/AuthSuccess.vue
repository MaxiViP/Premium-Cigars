<template>
  <div class="oauth-success">
    <div class="card">
      <!-- Анимированная галочка -->
      <div class="checkmark-circle">
        <div class="checkmark draw"></div>
      </div>

      <h1>Добро пожаловать!</h1>
      <p>Авторизация прошла успешно</p>

      <!-- Имитация "прогресса закрытия" -->
      <div class="progress">
        <div class="progress-bar"></div>
      </div>

      <small>Окно закроется автоматически...</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  const access = route.query.access as string
  const refresh = route.query.refresh as string

  if (window.opener) {
    if (access && refresh) {
      window.opener.postMessage(
        {
          type: 'oauth-success',
          access,
          refresh,
        },
        window.location.origin,
      )
    } else {
      window.opener.postMessage({ type: 'oauth-failed' }, window.location.origin)
    }
  }

  setTimeout(() => window.close(), 2300)
})
</script>

<style scoped>
.oauth-success {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', sans-serif;
}

.card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 380px;
  width: 90%;
}

/* Большая анимированная галочка */
.checkmark-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #b8975f;
  margin: 0 auto 30px;
  position: relative;
  animation: pulse 2s infinite;
}

.checkmark {
  width: 30px;
  height: 60px;
  border: solid white;
  border-width: 0 8px 8px 0;
  transform: rotate(45deg);
  position: absolute;
  left: 34px;
  top: 14px;
}

.checkmark.draw {
  animation: draw 0.6s ease-in-out 0.4s forwards;
  border-color: transparent;
}

@keyframes draw {
  to {
    border-color: white;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(184, 151, 95, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(184, 151, 95, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(184, 151, 95, 0);
  }
}

h1 {
  font-size: 28px;
  margin: 0 0 12px 0;
  font-weight: 600;
  background: linear-gradient(to right, #ffd700, #b8975f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p {
  font-size: 17px;
  opacity: 0.9;
  margin-bottom: 32px;
}

/* Прогресс-бар */
.progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
  margin: 30px 0;
}

.progress-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, #ffd700, #b8975f);
  border-radius: 2px;
  animation: progress 2.2s linear forwards;
}

@keyframes progress {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

small {
  opacity: 0.7;
  font-size: 14px;
}
</style>
