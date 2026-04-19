import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './app/App.vue'

import './style.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
})

createApp(App)
  .use(createPinia())
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')