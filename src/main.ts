import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import './style.css'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.error('SW registration failed:', err))
  })
}
