import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { App } from '@/app'
import '@/app/styles/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin)

app.mount('#app')
