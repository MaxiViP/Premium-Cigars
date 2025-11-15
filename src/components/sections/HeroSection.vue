<template>
  <section class="hero-section">
    <div class="hero-background">

      <!-- Сигары (генерация через массив) -->
      <div
        v-for="(cigar, i) in cigars"
        :key="i"
        class="floating-cigar"
        :class="`cigar-${i+1}`"
        :style="{ top: cigar.top, left: cigar.left, '--rotation': cigar.rotation }"
      >
        <SvgCigar :type="cigar.type" :width="cigar.w" :height="cigar.h" />
      </div>

      <!-- Мягкий дым (генерация через массив) -->
      <div
        v-for="(item, i) in smoke"
        :key="i"
        class="smoke"
        :class="`smoke-${i+1}`"
        :style="{ top: item.top, left: item.left, width: item.size, height: item.size }"
      ></div>

      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Элитные сигары премиум-класса</h1>

          <p class="hero-subtitle">
            Откройте для себя мир изысканных вкусов и непревзойдённого качества от лучших производителей Кубы и Доминиканы
          </p>

          <div class="hero-actions">
            <router-link to="/catalog" class="btn btn-primary">Смотреть каталог</router-link>
            <router-link to="/about" class="btn btn-secondary">О нас</router-link>
          </div>

          <div class="hero-features">
            <div class="feature">
              <SvgCigar :type="1" :width="30" :height="12" class="feature-icon" />
              <span>Премиальное качество</span>
            </div>
            <div class="feature">
              <SvgCigar :type="5" :width="30" :height="12" class="feature-icon" />
              <span>Прямые поставки</span>
            </div>
            <div class="feature">
              <SvgCigar :type="9" :width="30" :height="12" class="feature-icon" />
              <span>Экспертная консультация</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SvgCigar from '@/components/ui/SvgCigar.vue'

const cigars = [
  { type: 1, top: '15%', left: '6%',  rotation: '8deg',  w: 140, h: 50 },
  { type: 2, top: '65%', left: '82%', rotation: '-10deg', w: 120, h: 45 },
  { type: 3, top: '75%', left: '14%', rotation: '5deg',  w: 130, h: 48 },
  { type: 4, top: '28%', left: '87%', rotation: '-18deg', w: 110, h: 42 },
  { type: 5, top: '42%', left: '20%', rotation: '20deg', w: 140, h: 50 },
  { type: 6, top: '58%', left: '70%', rotation: '-12deg', w: 120, h: 45 },
  { type: 7, top: '33%', left: '75%', rotation: '12deg', w: 130, h: 48 },
  { type: 8, top: '50%', left: '26%', rotation: '-16deg', w: 110, h: 42 },
  { type: 9, top: '22%', left: '50%', rotation: '14deg', w: 130, h: 48 },
  { type: 10, top: '70%', left: '36%', rotation: '-10deg', w: 110, h: 42 },
]

const smoke = [
  { top: '7%', left: '10%', size: '180px' },
  { top: '60%', left: '75%', size: '220px' },
  { top: '80%', left: '32%', size: '140px' },
  { top: '36%', left: '20%', size: '160px' },
  { top: '55%', left: '62%', size: '190px' },
  { top: '28%', left: '57%', size: '130px' },
]
</script>


<style scoped>
.hero-section {
  height: 100vh;
  min-height: 720px;
  position: relative;
  overflow: hidden;
}

/* Новый премиальный фон */
.hero-background {
  background: linear-gradient(145deg, #1a1a1a 0%, #3c3c3c 40%, #1a1a1a 85%);
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.hero-background::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 40%, rgba(212,175,55,0.25), transparent 70%);
  opacity: 0.6;
}

/* =======================================
   SIGARS
======================================= */
.floating-cigar {
  position: absolute;
  animation: float 9s ease-in-out infinite;
  z-index: 2;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(var(--rotation)); }
  50% { transform: translateY(-25px) rotate(calc(var(--rotation) + 4deg)); }
  100% { transform: translateY(0px) rotate(var(--rotation)); }
}

.floating-cigar:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 6px 18px rgba(212,175,55,0.55));
}

/* =======================================
   SMOKE
======================================= */
.smoke {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.32), rgba(255,255,255,0) 70%);
  animation: smoke 14s linear infinite;
  filter: blur(14px);
  z-index: 1;
}

@keyframes smoke {
  0%   { transform: translateY(0) scale(0.5); opacity: 0; }
  20%  { opacity: 0.6; }
  60%  { transform: translateY(-90px) scale(1.2); opacity: 0.35; }
  100% { transform: translateY(-180px) scale(1.8); opacity: 0; }
}

/* =======================================
   CONTENT
======================================= */
.hero-content {
  text-align: center;
  color: white;
  max-width: 850px;
  margin: 0 auto;
  z-index: 3;
  position: relative;
}

.hero-title {
  font-size: 3.8rem;
  margin-bottom: 1.4rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(92deg, #d4af37, #fff1a3, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s ease-in-out infinite;
}

@keyframes shine {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-subtitle {
  font-size: 1.4rem;
  opacity: 0.85;
  margin-bottom: 2.8rem;
}

/* =======================================
   BUTTONS
======================================= */
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.4rem;
  margin-bottom: 3.5rem;
}

.btn {
  padding: 1rem 2.6rem;
  border-radius: 40px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;
  font-size: 1.15rem;
}

.btn-primary {
  background: #d4af37;
  color: #1a1a1a;
  box-shadow: 0 4px 20px rgba(212,175,55,0.35);
}

.btn-primary:hover {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  transform: translateY(-3px);
}

.btn-secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: #111;
  transform: translateY(-3px);
}

/* =======================================
   FEATURES
======================================= */
.hero-features {
  display: flex;
  gap: 2.8rem;
  justify-content: center;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(255,255,255,0.12);
  padding: 0.7rem 1.3rem;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  transition: 0.3s;
}

.feature:hover {
  background: rgba(255,255,255,0.22);
  transform: translateY(-2px);
}

/* MOBILE */
@media (max-width: 768px) {
  .hero-title { font-size: 2.7rem; }
  .hero-features { flex-direction: column; gap: 1rem; }
  .floating-cigar { display: none; }
}
</style>

