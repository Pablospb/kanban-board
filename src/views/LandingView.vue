<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

/** Событие Chromium до вызова `prompt()` (не в стандартных lib DOM). */
type BeforeInstallPromptEventLike = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const router = useRouter()

const isStandalone = ref(false)
const deferredPrompt = ref<BeforeInstallPromptEventLike | null>(null)

const base = import.meta.env.BASE_URL || '/'
const iconUrl = `${base.endsWith('/') ? base : `${base}/`}icon.svg`

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function onBeforeInstall(e: Event) {
  e.preventDefault()
  deferredPrompt.value = e as BeforeInstallPromptEventLike
}

function onAppInstalled() {
  deferredPrompt.value = null
}

onMounted(() => {
  isStandalone.value = detectStandalone()
  window.addEventListener('beforeinstallprompt', onBeforeInstall)
  window.addEventListener('appinstalled', onAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  window.removeEventListener('appinstalled', onAppInstalled)
})

async function handleInstallClick() {
  const ev = deferredPrompt.value
  if (!ev) {
    await router.push({ name: 'kanban' })
    return
  }
  await ev.prompt()
  await ev.userChoice
  deferredPrompt.value = null
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white overflow-hidden">
    <!-- Hero -->
    <div
      class="relative h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 overflow-hidden"
    >
      <div class="absolute inset-0 bg-black/30"></div>

      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-2xl px-6 py-2.5 rounded-3xl text-sm mb-8 border border-white/20"
        >
          ✨ Современный инструмент продуктивности
        </div>

        <h1 class="text-7xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">Modern Todo</h1>
        <p class="text-2xl md:text-3xl text-white/90 mb-12 max-w-2xl mx-auto">
          Красивая канбан-доска нового поколения.<br />
          Просто. Быстро. Красиво.
        </p>

        <!-- PWA: уже установлено -->
        <div v-if="isStandalone" class="flex flex-col items-center gap-5">
          <p class="text-xl md:text-2xl font-semibold text-white/95 tracking-tight">
            ✅ Уже добавлено на рабочий стол
          </p>
          <RouterLink
            :to="{ name: 'kanban' }"
            class="landing-cta group relative inline-flex min-h-[68px] items-center justify-center gap-3 overflow-hidden rounded-3xl px-10 md:px-12 py-4 text-lg md:text-xl font-semibold text-white shadow-2xl shadow-violet-900/40 ring-2 ring-white/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-violet-500/35 hover:ring-white/50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90"
          >
            <span
              class="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 opacity-95 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span
              class="absolute inset-0 translate-y-full bg-white/10 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span class="relative z-10 flex items-center gap-3">
              <img
                :src="iconUrl"
                alt=""
                width="40"
                height="40"
                class="h-10 w-10 rounded-xl shadow-md ring-1 ring-white/20"
              />
              <span>Открыть Канбан</span>
              <span
                class="text-xl transition-transform duration-300 group-hover:translate-x-2"
                aria-hidden="true"
              >→</span>
            </span>
          </RouterLink>
          <p class="text-sm text-white/65 max-w-md">
            Запуск из установленного приложения — быстрый доступ к доске без вкладки браузера.
          </p>
        </div>

        <!-- PWA: установка -->
        <div v-else class="flex flex-col items-center gap-4">
          <button
            type="button"
            class="landing-cta group relative mx-auto inline-flex min-h-[68px] w-full max-w-xl items-center justify-center gap-4 overflow-hidden rounded-3xl px-8 md:px-12 py-4 text-lg md:text-xl font-semibold text-white shadow-2xl shadow-violet-900/40 ring-2 ring-white/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-violet-500/35 hover:ring-white/50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/90"
            @click="handleInstallClick"
          >
            <span
              class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 opacity-95 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span
              class="absolute inset-0 translate-y-full bg-white/10 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span class="relative z-10 flex items-center gap-3">
              <img
                :src="iconUrl"
                alt=""
                width="40"
                height="40"
                class="h-10 w-10 rounded-xl shadow-md ring-1 ring-white/20"
              />
              <span>📌 Добавить мою доску на рабочий стол</span>
            </span>
          </button>
          <p class="text-sm text-white/70 max-w-lg leading-relaxed">
            Нажмите, чтобы браузер предложил установить приложение. После установки доска откроется как отдельное окно
            с иконкой на рабочем столе или в меню «Пуск».
          </p>
          <p v-if="!deferredPrompt" class="text-xs text-white/50 max-w-md">
            Если окно установки недоступно в этом браузере, откроется канбан во вкладке — вы всё равно сможете работать с
            доской.
          </p>
        </div>
      </div>

      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60">
        <span class="text-sm mb-3 tracking-widest">ПРОКРУТИТЬ ВНИЗ</span>
        <div class="w-6 h-10 border-2 border-white/60 rounded-full flex items-center justify-center">
          <div class="w-1.5 h-3 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-5xl font-bold text-center mb-6">Почему Modern Todo</h2>
        <p class="text-xl text-zinc-400 text-center mb-20 max-w-md mx-auto">
          Всё, что нужно для удобной работы с задачами
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group"
          >
            <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">↔️</div>
            <h3 class="text-3xl font-semibold mb-4">Drag &amp; Drop</h3>
            <p class="text-zinc-400 text-lg">Мгновенное перетаскивание задач между колонками</p>
          </div>
          <div
            class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group"
          >
            <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">📌</div>
            <h3 class="text-3xl font-semibold mb-4">Подзадачи</h3>
            <p class="text-zinc-400 text-lg">Вложенная структура любой глубины</p>
          </div>
          <div
            class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group"
          >
            <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">🔥</div>
            <h3 class="text-3xl font-semibold mb-4">Приоритеты</h3>
            <p class="text-zinc-400 text-lg">Метки, цвета, срочность и сортировка</p>
          </div>
          <div
            class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group"
          >
            <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">🌌</div>
            <h3 class="text-3xl font-semibold mb-4">Премиум дизайн</h3>
            <p class="text-zinc-400 text-lg">Тёмная тема, плавные анимации, идеальная типографика</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
