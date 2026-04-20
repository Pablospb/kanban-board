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
.landing {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--color-bg);
  color: var(--color-text);
}

.landing__glow {
  pointer-events: none;
  position: absolute;
  inset: -20% -10% auto;
  height: min(70vh, 520px);
  background: radial-gradient(
    ellipse 80% 60% at 50% 0%,
    color-mix(in srgb, var(--color-accent) 22%, transparent) 0%,
    transparent 65%
  );
  opacity: 0.85;
}

.landing__hero {
  position: relative;
  z-index: 1;
  max-width: 52rem;
  margin: 0 auto;
  padding: clamp(3.5rem, 12vw, 7rem) clamp(1.5rem, 5vw, 2rem) clamp(4rem, 10vw, 6rem);
  text-align: center;
}

.landing__eyebrow {
  display: inline-block;
  margin: 0 0 2rem;
  padding: 0.5rem 1rem;
  font-size: var(--font-size-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.landing__title {
  margin: 0 0 1.75rem;
  font-size: clamp(4.25rem, 14vw, 7.5rem);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.04em;
  background: linear-gradient(
    180deg,
    var(--color-text) 0%,
    color-mix(in srgb, var(--color-text) 72%, var(--color-text-muted)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.landing__lead {
  margin: 0 auto 2.75rem;
  max-width: 34rem;
  font-size: clamp(1.125rem, 2.8vw, 1.375rem);
  line-height: 1.65;
  color: var(--color-text-muted);
  font-weight: 400;
}

.landing__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 28rem;
  margin: 0 auto;
}

.landing__cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.75rem;
  padding: 1rem 2rem;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #fff;
  background: var(--color-accent);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 12%, transparent) inset,
    0 12px 40px color-mix(in srgb, var(--color-accent) 42%, transparent);
  transition: background var(--motion-base) ease, transform var(--motion-base) ease,
    box-shadow var(--motion-base) ease;
}

.landing__cta-primary:hover {
  background: var(--color-accent-hover);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 14%, transparent) inset,
    0 16px 48px color-mix(in srgb, var(--color-accent) 48%, transparent);
}

.landing__cta-primary:active {
  transform: scale(0.992);
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
  border-radius: 12px;
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
  line-height: 1.5;
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
  padding: clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 2rem) clamp(5rem, 12vw, 7rem);
  border-top: 1px solid var(--color-border);
  background: linear-gradient(180deg, var(--color-bg) 0%, color-mix(in srgb, var(--color-surface) 35%, var(--color-bg)) 100%);
}

.landing__features-inner {
  max-width: 72rem;
  margin: 0 auto;
}

.landing__features-title {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--color-text);
}

.landing__features-sub {
  margin: 0 auto 3rem;
  max-width: 36rem;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  text-align: center;
  color: var(--color-text-muted);
}

.landing__grid {
  display: grid;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .landing__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .landing__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

.landing__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.75rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  transition: border-color var(--motion-base) ease;
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
  margin-bottom: 1.25rem;
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 14%, transparent);
  border-radius: var(--radius-sm);
}

.landing__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.landing__card-title {
  margin: 0 0 0.625rem;
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--color-text);
}

.landing__card-text {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
