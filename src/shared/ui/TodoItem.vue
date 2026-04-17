<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/entities/todo'
import Button from './Button.vue'
import Toggle from './Toggle.vue'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [todo: Todo]
  remove: [todo: Todo]
}>()

const checked = computed({
  get: () => props.todo.completed,
  set: () => emit('toggle', props.todo),
})
</script>

<template>
  <li class="todo-item">
    <div class="todo-item__main">
      <Toggle v-model="checked" ariaLabel="Изменить статус задачи" />
      <span class="todo-item__title" :class="{ 'todo-item__title--done': props.todo.completed }">
        {{ props.todo.title }}
      </span>
    </div>
    <Button variant="danger" @click="emit('remove', props.todo)">Удалить</Button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-surface-soft) 70%, transparent);
  padding: var(--space-sm) var(--space-md);
  animation: item-in var(--motion-base) ease;
}

.todo-item__main {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.todo-item__title {
  font-size: var(--font-size-sm);
  line-height: 1.45;
}

.todo-item__title--done {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

@keyframes item-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
