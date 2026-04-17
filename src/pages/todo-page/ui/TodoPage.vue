<script setup lang="ts">
import { TodoBoard } from '@/widgets/todo-board'
</script>

<template>
  <main class="todo-page">
    <TodoBoard />
  </main>
</template>

<style scoped>
.todo-page {
  min-height: 100vh;
  padding: clamp(28px, 6vw, 56px) 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>
