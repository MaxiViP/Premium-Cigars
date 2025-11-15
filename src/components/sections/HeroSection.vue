<template>
  <section class="hero-section">
    <div class="hero-background">
      <!-- SVG сигары из ваших файлов -->
      <div class="floating-cigar cigar-1">
        <SvgCigar :type="1" :width="140" :height="50" />
      </div>
      <div class="floating-cigar cigar-2">
        <SvgCigar :type="2" :width="120" :height="45" />
      </div>
      <div class="floating-cigar cigar-3">
        <SvgCigar :type="3" :width="130" :height="48" />
      </div>
      <div class="floating-cigar cigar-4">
        <SvgCigar :type="4" :width="110" :height="42" />
      </div>
      <div class="floating-cigar cigar-5">
        <SvgCigar :type="5" :width="140" :height="50" />
      </div>
      <div class="floating-cigar cigar-6">
        <SvgCigar :type="6" :width="120" :height="45" />
      </div>
      <div class="floating-cigar cigar-7">
        <SvgCigar :type="7" :width="130" :height="48" />
      </div>
      <div class="floating-cigar cigar-8">
        <SvgCigar :type="8" :width="110" :height="42" />
      </div>
      <div class="floating-cigar cigar-9">
        <SvgCigar :type="9" :width="130" :height="48" />
      </div>
      <div class="floating-cigar cigar-10">
        <SvgCigar :type="10" :width="110" :height="42" />
      </div>

      <!-- Дым -->
      <div class="smoke smoke-1"></div>
      <div class="smoke smoke-2"></div>
      <div class="smoke smoke-3"></div>
      <div class="smoke smoke-4"></div>
      <div class="smoke smoke-5"></div>
      <div class="smoke smoke-6"></div>

      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Элитные сигары премиум-класса</h1>
          <p class="hero-subtitle">
            Откройте для себя мир изысканных вкусов и непревзойденного качества от лучших
            производителей Кубы и Доминиканы
          </p>
          <div class="hero-actions">
            <router-link to="/catalog" class="btn btn-primary">Смотреть каталог</router-link>
            <router-link to="/about" class="btn btn-secondary">О нас</router-link>
          </div>

          <div class="hero-features">
            <div class="feature">
              <SvgCigar :type="1" :width="30" :height="12" class="feature-icon" />
              <span class="feature-text">Премиальное качество</span>
            </div>
            <div class="feature">
              <SvgCigar :type="5" :width="30" :height="12" class="feature-icon" />
              <span class="feature-text">Прямые поставки</span>
            </div>
            <div class="feature">
              <SvgCigar :type="9" :width="30" :height="12" class="feature-icon" />
              <span class="feature-text">Экспертная консультация</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SvgCigar from '@/components/ui/SvgCigar.vue'
</script>

<style scoped>
.hero-section {
  height: 100vh;
  min-height: 700px;
  position: relative;
  overflow: hidden;
}

.hero-background {
  background: linear-gradient(
    135deg,
    #4cda4e 0%,
    #d71c1c 25%,
    #6487df 50%,
    #a325ec 75%,
    #1a1a1a 100%
  );
  background-size: 400% 400%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Парящие SVG сигары */
.floating-cigar {
  position: absolute;
  animation: float 8s ease-in-out infinite;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-cigar img {
  transition: all 0.3s ease;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.4));
}

.floating-cigar:hover img {
  transform: scale(1.15);
  filter: drop-shadow(0 6px 20px rgba(212, 175, 55, 0.6));
}

.cigar-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.cigar-2 {
  top: 65%;
  left: 82%;
  animation-delay: 2s;
}

.cigar-3 {
  top: 75%;
  left: 12%;
  animation-delay: 4s;
}

.cigar-4 {
  top: 25%;
  left: 88%;
  animation-delay: 6s;
}
.cigar-5 {
  top: 40%;
  left: 15%;
  animation-delay: 1s;
  animation-duration: 9s;
  transform: rotate(25deg);
}

.cigar-6 {
  top: 60%;
  left: 70%;
  animation-delay: 3s;
  animation-duration: 10s;
  transform: rotate(-15deg);
}

.cigar-7 {
  top: 30%;
  left: 75%;
  animation-delay: 5s;
  animation-duration: 8s;
  transform: rotate(10deg);
}

.cigar-8 {
  top: 50%;
  left: 25%;
  animation-delay: 7s;
  animation-duration: 11s;
  transform: rotate(-20deg);
}

.cigar-9 {
  top: 20%;
  left: 50%;
  animation-delay: 2s;
  animation-duration: 12s;
  transform: rotate(15deg);
  opacity: 0.8;
}

.cigar-10 {
  top: 70%;
  left: 35%;
  animation-delay: 4s;
  animation-duration: 9s;
  transform: rotate(-10deg);
  opacity: 0.8;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(var(--rotation, 0deg));
  }
  25% {
    transform: translateY(-15px) rotate(calc(var(--rotation, 0deg) + 3deg));
  }
  50% {
    transform: translateY(-25px) rotate(calc(var(--rotation, 0deg) - 2deg));
  }
  75% {
    transform: translateY(-10px) rotate(calc(var(--rotation, 0deg) + 1deg));
  }
}

/* Устанавливаем вращение для каждой сигары */
.cigar-1 {
  --rotation: 10deg;
}
.cigar-2 {
  --rotation: -15deg;
}
.cigar-3 {
  --rotation: 5deg;
}
.cigar-4 {
  --rotation: -20deg;
}
.cigar-5 {
  --rotation: 25deg;
}
.cigar-6 {
  --rotation: -15deg;
}
.cigar-7 {
  --rotation: 10deg;
}
.cigar-8 {
  --rotation: -20deg;
}
.cigar-9 {
  --rotation: 15deg;
}
.cigar-10 {
  --rotation: -10deg;
}

/* Улучшенный дым - более заметный */
.smoke {
  position: absolute;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 30%,
    rgba(255, 255, 255, 0.05) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 50%;
  animation: smokeAnimation 12s linear infinite;
  z-index: 0;
  pointer-events: none;
}

.smoke-1 {
  width: 150px;
  height: 150px;
  top: 5%;
  left: 10%;
  animation-delay: 0s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0) 100%
  );
}

.smoke-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  left: 80%;
  animation-delay: 3s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.smoke-3 {
  width: 120px;
  height: 120px;
  top: 80%;
  left: 30%;
  animation-delay: 6s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.12) 40%,
    rgba(255, 255, 255, 0.05) 70%,
    rgba(255, 255, 255, 0) 100%
  );
}
.smoke-4 {
  width: 130px;
  height: 130px;
  top: 35%;
  left: 20%;
  animation-delay: 2s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.12) 35%,
    rgba(255, 255, 255, 0.06) 65%,
    rgba(255, 255, 255, 0) 100%
  );
}

.smoke-5 {
  width: 170px;
  height: 170px;
  top: 55%;
  left: 65%;
  animation-delay: 5s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.14) 28%,
    rgba(255, 255, 255, 0.07) 62%,
    rgba(255, 255, 255, 0) 100%
  );
}

.smoke-6 {
  width: 110px;
  height: 110px;
  top: 25%;
  left: 60%;
  animation-delay: 7s;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0.04) 75%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes smokeAnimation {
  0% {
    transform: scale(0.2) translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
    filter: blur(5px);
  }
  20% {
    opacity: 0.6;
    filter: blur(8px);
  }
  40% {
    opacity: 0.4;
    transform: scale(0.8) translateY(-40px) translateX(10px) rotate(90deg);
    filter: blur(12px);
  }
  60% {
    opacity: 0.3;
    transform: scale(1.2) translateY(-80px) translateX(20px) rotate(180deg);
    filter: blur(15px);
  }
  80% {
    opacity: 0.1;
    transform: scale(1.5) translateY(-120px) translateX(30px) rotate(270deg);
    filter: blur(18px);
  }
  100% {
    transform: scale(2) translateY(-160px) translateX(40px) rotate(360deg);
    opacity: 0;
    filter: blur(20px);
  }
}

.hero-content {
  text-align: center;
  color: var(--white);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  line-height: 1.1;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  animation: titleAppear 1.5s ease-out;
  background: linear-gradient(45deg, #d4af37, #ffd700, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes titleAppear {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
  animation: subtitleAppear 1.5s ease-out 0.3s both;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

@keyframes subtitleAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 0.9;
    transform: translateY(0);
  }
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  animation: actionsAppear 1.5s ease-out 0.6s both;
}

@keyframes actionsAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: var(--secondary-color);
  color: var(--text-dark);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  background: transparent;
  border-color: var(--secondary-color);
  color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  background: transparent;
  border-color: var(--white);
  color: var(--white);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: var(--white);
  color: var(--text-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 3rem;
  animation: featuresAppear 1.5s ease-out 0.9s both;
}

@keyframes featuresAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  opacity: 0.9;
  transition: all 0.3s ease;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.feature:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.feature-icon {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.feature:hover .feature-icon {
  opacity: 1;
}

.feature-text {
  font-weight: 500;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
    text-align: center;
  }

  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }

  .floating-cigar {
    transform: scale(0.7);
  }

  /* На мобильных оставляем только 4 основные сигары */
  .cigar-5,
  .cigar-6,
  .cigar-7,
  .cigar-8,
  .cigar-9,
  .cigar-10 {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .floating-cigar {
    display: none;
  }
}
</style>
