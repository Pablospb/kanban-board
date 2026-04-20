import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

import { App } from '@/app'

import { router } from './router'

import { initPwaInstallPrompt } from '@/shared/lib/pwaInstallPrompt'

import './style.css'

const pinia = createPinia()
const queryClient = new QueryClient()

initPwaInstallPrompt()

createApp(App).use(pinia).use(router).use(VueQueryPlugin, { queryClient }).mount('#app')



// В dev не регистрируем SW — иначе кэш и перехват fetch ломают Vite (белый экран / старый бандл).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { type: 'classic', scope: '/' })
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('PWA: новая версия SW установлена, будет активна после перезагрузки')
            }
          })
        })
        console.log('PWA: service worker зарегистрирован:', reg.scope)
      })
      .catch((err) => console.error('PWA: ошибка регистрации SW:', err))
  })
}

