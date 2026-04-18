<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'

const showBoard = ref(false)

const openBoard = () => {
  showBoard.value = true
}

const closeBoard = () => {
  showBoard.value = false
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white overflow-hidden">
    <!-- Лендинг -->
    <div v-if="!showBoard">
      <!-- Hero -->
      <div class="relative h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 overflow-hidden">
        <div class="absolute inset-0 bg-black/30"></div>
        
        <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-2xl px-6 py-2.5 rounded-3xl text-sm mb-8 border border-white/20">
            ✨ Современный инструмент продуктивности
          </div>
          
          <h1 class="text-7xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
            Modern Todo
          </h1>
          <p class="text-2xl md:text-3xl text-white/90 mb-12 max-w-2xl mx-auto">
            Красивая канбан-доска нового поколения.<br>
            Просто. Быстро. Красиво.
          </p>
          
          <button 
            @click="openBoard"
            class="group px-12 py-5 bg-white text-zinc-900 font-semibold text-2xl rounded-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-violet-500/30">
            Открыть доску
            <span class="text-3xl group-hover:translate-x-3 transition-transform">→</span>
          </button>
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
            <div class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group">
              <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">↔️</div>
              <h3 class="text-3xl font-semibold mb-4">Drag &amp; Drop</h3>
              <p class="text-zinc-400 text-lg">Мгновенное перетаскивание задач между колонками</p>
            </div>
            <div class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group">
              <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">📌</div>
              <h3 class="text-3xl font-semibold mb-4">Подзадачи</h3>
              <p class="text-zinc-400 text-lg">Вложенная структура любой глубины</p>
            </div>
            <div class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group">
              <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">🔥</div>
              <h3 class="text-3xl font-semibold mb-4">Приоритеты</h3>
              <p class="text-zinc-400 text-lg">Метки, цвета, срочность и сортировка</p>
            </div>
            <div class="bg-zinc-800/80 border border-zinc-700 rounded-3xl p-10 hover:border-violet-400 hover:-translate-y-2 transition-all group">
              <div class="text-6xl mb-8 group-hover:scale-110 transition-transform">🌌</div>
              <h3 class="text-3xl font-semibold mb-4">Премиум дизайн</h3>
              <p class="text-zinc-400 text-lg">Тёмная тема, плавные анимации, идеальная типографика</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Канбан доска -->
    <KanbanBoard v-else @close="closeBoard" />
  </div>
</template>