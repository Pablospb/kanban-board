<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import {
  deferredInstallPrompt,
  clearDeferredInstallPrompt,
} from '@/shared/lib/pwaInstallPrompt'

const router = useRouter()
const installButtonRef = ref<HTMLButtonElement | null>(null)
const installAvailable = ref(false)
const isInstalled = ref(false)

const updateInstallStatus = () => {
  isInstalled.value = window.matchMedia('(display-mode: standalone)').matches
  if (isInstalled.value) {
    installAvailable.value = false
  }
}

const onPwaInstallReady = () => {
  updateInstallStatus()
  if (!isInstalled.value) {
    installAvailable.value = true
  }
}

const onPwaInstalled = () => {
  updateInstallStatus()
  installAvailable.value = false
}

onMounted(() => {
  updateInstallStatus()
  if (deferredInstallPrompt && !isInstalled.value) {
    installAvailable.value = true
  }

  window.addEventListener('pwa-install-ready', onPwaInstallReady)
  window.addEventListener('pwa-installed', onPwaInstalled)
  window.addEventListener('resize', updateInstallStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('pwa-install-ready', onPwaInstallReady)
  window.removeEventListener('pwa-installed', onPwaInstalled)
  window.removeEventListener('resize', updateInstallStatus)
})

watchEffect((onCleanup) => {
  const el = installButtonRef.value
  if (!el || !installAvailable.value) return

  const handler = () => {
    void handleInstallClick()
  }
  el.addEventListener('click', handler)
  onCleanup(() => el.removeEventListener('click', handler))
})

const handleInstallClick = async () => {
  const promptEvent = deferredInstallPrompt
  if (!promptEvent) {
    console.warn('PWA: нет сохранённого beforeinstallprompt')
    return
  }

  await promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  console.log('PWA: результат установки:', outcome)
  clearDeferredInstallPrompt()
  installAvailable.value = false
}

const goToKanban = () => router.push('/kanban')
</script>

<template>
  <div class="landing">
    <div class="landing__glow" aria-hidden="true" />

    <header class="landing__hero">
      <p class="landing__eyebrow">Канбан в браузере · без облака и регистрации</p>

      <h1 class="landing__title">Flow</h1>

      <p class="landing__lead">
        Канбан без шума — ясность и фокус.<br />
        Ваши задачи живут только в этом браузере: никакого облака, только ваше устройство.
      </p>

      <div class="landing__actions">
        <button type="button" class="landing__cta-primary" @click="goToKanban">
          Открыть Flow
        </button>

        <template v-if="!isInstalled">
          <button
            ref="installButtonRef"
            type="button"
            :hidden="!installAvailable"
            class="landing__cta-secondary"
          >
            Установить как приложение
          </button>
          <p v-if="installAvailable" class="landing__hint">
            Браузер может предложить добавить Flow на рабочий стол — данные по-прежнему только у вас.
          </p>
        </template>

        <template v-else>
          <p class="landing__installed">Приложение уже на рабочем столе</p>
          <button type="button" class="landing__cta-secondary" @click="goToKanban">
            Перейти к доске
          </button>
        </template>
      </div>
    </header>

    <section class="landing__features" aria-labelledby="landing-features-heading">
      <div class="landing__features-inner">
        <h2 id="landing-features-heading" class="landing__features-title">
          Всё рядом — и никуда не «улетает»
        </h2>
        <p class="landing__features-sub">
          Flow спроектирован так, чтобы структура задач оставалась под вашим контролем.
        </p>

        <ul class="landing__grid">
          <li class="landing__card">
            <div class="landing__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="landing__card-title">Локально в браузере</h3>
            <p class="landing__card-text">
              Задачи и настройки хранятся на вашем устройстве. Без серверов и аккаунтов — только вы и
              браузер.
            </p>
          </li>

          <li class="landing__card">
            <div class="landing__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 6h16v4H4V6zM4 14h10v4H4v-4z" stroke-linejoin="round" />
                <path d="M16 14v4h4v-4h-4z" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="landing__card-title">Канбан и приоритеты</h3>
            <p class="landing__card-text">
              Колонки, перетаскивание и метки срочности — привычная логика без перегруженного
              интерфейса.
            </p>
          </li>

          <li class="landing__card">
            <div class="landing__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round" />
                <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 class="landing__card-title">Подзадачи</h3>
            <p class="landing__card-text">
              Разбивайте крупное на шаги: вложенность сохраняется там же — в локальном хранилище
              браузера.
            </p>
          </li>

          <li class="landing__card">
            <div class="landing__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="landing__card-title">Спокойный ритм</h3>
            <p class="landing__card-text">
              Тёмная тема, ровная сетка и мягкие акценты — меньше отвлечений, больше ясности в
              работе.
            </p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes landing-fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.landing {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--color-bg);
  color: var(--color-text);
}

.landing__glow {
  pointer-events: none;
  position: absolute;
  z-index: 0;
  inset: -28% -15% auto;
  height: min(78vh, 580px);
  background:
    radial-gradient(
      ellipse 72% 55% at 50% -5%,
      color-mix(in srgb, var(--color-accent) 38%, transparent) 0%,
      transparent 58%
    ),
    radial-gradient(
      ellipse 110% 70% at 50% 12%,
      color-mix(in srgb, var(--color-accent) 18%, transparent) 0%,
      transparent 72%
    );
  opacity: 1;
  filter: blur(2px);
}

.landing__hero {
  position: relative;
  z-index: 1;
  max-width: 52rem;
  margin: 0 auto;
  padding: clamp(4rem, 11vw, 7.5rem) clamp(1.5rem, 5vw, 2.25rem) clamp(4.5rem, 11vw, 6.5rem);
  text-align: center;
}

.landing__eyebrow {
  display: inline-block;
  margin: 0 0 2.25rem;
  padding: 0.5rem 1.125rem;
  font-size: var(--font-size-xs);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  opacity: 0;
  animation: landing-fade-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.06s;
}

.landing__title {
  margin: 0 0 2rem;
  font-size: clamp(4.5rem, 14vw, 7.75rem);
  font-weight: 600;
  line-height: 0.94;
  letter-spacing: -0.042em;
  background: linear-gradient(
    180deg,
    var(--color-text) 0%,
    color-mix(in srgb, var(--color-text) 68%, var(--color-text-muted)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 28px color-mix(in srgb, var(--color-accent) 42%, transparent))
    drop-shadow(0 0 72px color-mix(in srgb, var(--color-accent) 28%, transparent))
    drop-shadow(0 0 120px color-mix(in srgb, var(--color-accent) 14%, transparent));
  opacity: 0;
  animation: landing-fade-up 0.68s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.13s;
}

.landing__lead {
  margin: 0 auto 3rem;
  max-width: 36rem;
  font-size: clamp(1.125rem, 2.6vw, 1.3125rem);
  line-height: 1.72;
  color: var(--color-text-muted);
  font-weight: 400;
  opacity: 0;
  animation: landing-fade-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.2s;
}

.landing__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  max-width: 28rem;
  margin: 0 auto;
  opacity: 0;
  animation: landing-fade-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.27s;
}

.landing__cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 4.125rem;
  padding: 1.125rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  color: #fff;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-accent) 100%, #fff 6%) 0%,
    var(--color-accent) 100%
  );
  border: 1px solid color-mix(in srgb, var(--color-accent) 55%, #fff 18%);
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 14%, transparent) inset,
    0 14px 44px color-mix(in srgb, var(--color-accent) 48%, transparent),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 22%, transparent);
  transition:
    background var(--motion-base) ease,
    border-color var(--motion-base) ease,
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.landing__cta-primary:hover {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-accent-hover) 100%, #fff 8%) 0%,
    var(--color-accent-hover) 100%
  );
  border-color: color-mix(in srgb, var(--color-accent) 40%, #fff 35%);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 18%, transparent) inset,
    0 20px 56px color-mix(in srgb, var(--color-accent) 58%, transparent),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent),
    0 0 48px color-mix(in srgb, var(--color-accent) 32%, transparent);
  transform: translateY(-2px);
}

.landing__cta-primary:active {
  transform: translateY(0) scale(0.988);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 10%, transparent) inset,
    0 10px 32px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.landing__cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color var(--motion-base) ease,
    background var(--motion-base) ease;
}

.landing__cta-secondary:hover {
  background: var(--color-surface-2);
  border-color: color-mix(in srgb, var(--color-border) 80%, var(--color-text-muted));
}

.landing__hint {
  margin: 0;
  max-width: 26rem;
  font-size: var(--font-size-xs);
  line-height: 1.55;
  color: var(--color-text-muted);
}

.landing__installed {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-success);
}

.landing__features {
  position: relative;
  z-index: 1;
  padding: clamp(3.5rem, 9vw, 5.5rem) clamp(1.5rem, 5vw, 2.25rem) clamp(5.5rem, 12vw, 7.5rem);
  border-top: 1px solid var(--color-border);
  background: linear-gradient(
    180deg,
    var(--color-bg) 0%,
    color-mix(in srgb, var(--color-surface) 35%, var(--color-bg)) 100%
  );
}

.landing__features-inner {
  max-width: 72rem;
  margin: 0 auto;
}

.landing__features-title {
  margin: 0 0 1.125rem;
  font-size: clamp(1.8125rem, 4vw, 2.375rem);
  font-weight: 600;
  letter-spacing: -0.022em;
  line-height: 1.2;
  text-align: center;
  color: var(--color-text);
  opacity: 0;
  animation: landing-fade-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.34s;
}

.landing__features-sub {
  margin: 0 auto 3.25rem;
  max-width: 38rem;
  font-size: var(--font-size-sm);
  line-height: 1.68;
  text-align: center;
  color: var(--color-text-muted);
  opacity: 0;
  animation: landing-fade-up 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.4s;
}

.landing__grid {
  display: grid;
  gap: 1.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .landing__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.625rem;
  }
}

@media (min-width: 1024px) {
  .landing__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.625rem;
  }
}

.landing__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.875rem 1.625rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  transition: border-color var(--motion-base) ease;
  opacity: 0;
  animation: landing-fade-up 0.58s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.landing__card:nth-child(1) {
  animation-delay: 0.46s;
}

.landing__card:nth-child(2) {
  animation-delay: 0.52s;
}

.landing__card:nth-child(3) {
  animation-delay: 0.58s;
}

.landing__card:nth-child(4) {
  animation-delay: 0.64s;
}

.landing__card:hover {
  border-color: color-mix(in srgb, var(--color-border) 70%, var(--color-accent));
}

.landing__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1.375rem;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  border-radius: var(--radius-sm);
}

.landing__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.landing__card-title {
  margin: 0 0 0.6875rem;
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.28;
  color: var(--color-text);
}

.landing__card-text {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.65;
  color: var(--color-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .landing__eyebrow,
  .landing__title,
  .landing__lead,
  .landing__actions,
  .landing__features-title,
  .landing__features-sub,
  .landing__card {
    opacity: 1;
    animation: none;
    transform: none;
  }

  .landing__cta-primary,
  .landing__cta-primary:hover,
  .landing__cta-primary:active {
    transform: none;
  }
}
</style>
