import { createApp } from 'vue'

import App from './App.vue'

import { router } from './router'

import { initPwaInstallPrompt } from './shared/lib/pwaInstallPrompt'



import './style.css'



initPwaInstallPrompt()

createApp(App).use(router).mount('#app')



if ('serviceWorker' in navigator) {

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

