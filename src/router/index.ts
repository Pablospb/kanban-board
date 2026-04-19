import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'
import KanbanView from '@/views/KanbanView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Корень — сразу доска; лендинг с установкой PWA — /welcome
    { path: '/', redirect: '/kanban' },
    { path: '/welcome', name: 'landing', component: LandingView },
    { path: '/kanban', name: 'kanban', component: KanbanView },
  ],
})
