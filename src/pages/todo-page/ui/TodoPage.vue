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
  color: var(--color-text, #fafafa);
  background: radial-gradient(
    ellipse 120% 80% at 50% -20%,
    color-mix(in srgb, var(--color-accent, #a855f7) 18%, transparent),
    transparent
  );
}
</style>
