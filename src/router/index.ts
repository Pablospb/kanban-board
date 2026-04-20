import { createRouter, createWebHistory } from 'vue-router'
import { TodoPage } from '@/pages/todo-page'
import LandingView from '@/views/LandingView.vue'
import KanbanView from '@/views/KanbanView.vue'
import RootRedirectView from '@/views/RootRedirectView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Корень — сразу доска; лендинг с установкой PWA — /welcome
    { path: '/', name: 'root', component: RootRedirectView },
    { path: '/welcome', name: 'landing', component: LandingView },
    { path: '/kanban', name: 'kanban', component: KanbanView },
    { path: '/todo', name: 'todo', component: TodoPage },
  ],
})
