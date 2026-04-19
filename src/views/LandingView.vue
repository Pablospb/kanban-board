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

        <div class="flex flex-col items-center gap-4">
          <template v-if="!isInstalled">
            <button
              type="button"
              class="mx-auto inline-flex min-h-[56px] w-full max-w-xl items-center justify-center rounded-2xl border-2 border-white/80 bg-white/10 px-10 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.99]"
              @click="goToKanban"
            >
              Открыть канбан в браузере
            </button>

            <button
              ref="installButtonRef"
              type="button"
              :hidden="!installAvailable"
              class="landing-cta group relative mx-auto inline-flex min-h-[68px] w-full max-w-xl items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <span class="text-3xl">📌</span>
              <span>Добавить мою доску на рабочий стол</span>
            </button>

            <p v-if="installAvailable" class="text-sm text-gray-400 max-w-md text-center">
              Нажмите, чтобы браузер предложил установить приложение как отдельную программу
            </p>
          </template>

          <template v-else>
            <div class="text-center">
              <p class="text-green-400 text-xl mb-3">✅ Доска уже добавлена на рабочий стол</p>
              <button
                type="button"
                class="rounded-xl bg-white/10 px-8 py-4 text-white hover:bg-white/20 transition-colors"
                @click="goToKanban"
              >
                Открыть Канбан →
              </button>
            </div>
          </template>
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
