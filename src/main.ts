import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import './style.css'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.error('Service Worker registration failed:', err))
  })
}
