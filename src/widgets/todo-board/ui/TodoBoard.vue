<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { TODO_FILTER, todoApi, todoQueryKeys, type Todo } from '@/entities/todo'
import { CreateTodoForm } from '@/features/todo/create-todo'
import {
  TodoFilterTabs,
  useTodoFilterStore,
} from '@/features/todo/filter-todos'
import { useDeleteTodo } from '@/features/todo/delete-todo'
import { useToggleTodo } from '@/features/todo/toggle-todo'
import { Button, Card } from '@/shared/ui'

const todoFilterStore = useTodoFilterStore()
const toggleMutation = useToggleTodo()
const deleteMutation = useDeleteTodo()

const { data: todos, isPending, isError } = useQuery({
  queryKey: todoQueryKeys.root,
  queryFn: () => todoApi.getTodos(),
})

const filteredTodos = computed((): Todo[] => {
  const list = todos.value ?? []
  switch (todoFilterStore.filter) {
    case TODO_FILTER.active:
      return list.filter((todo) => !todo.completed)
    case TODO_FILTER.completed:
      return list.filter((todo) => todo.completed)
    default:
      return list
  }
})
</script>

<template>
  <div class="todo-board">
    <header class="todo-board__header">
      <h1 class="todo-board__title">Задачи</h1>
      <p class="todo-board__subtitle">Локальное хранилище, без бэкенда</p>
    </header>

    <CreateTodoForm class="todo-board__form" />
    <TodoFilterTabs class="todo-board__filters" />

    <p v-if="isPending" class="todo-board__state">Загрузка…</p>
    <p v-else-if="isError" class="todo-board__state todo-board__state--error">Не удалось загрузить список</p>

    <ul v-else class="todo-board__list" aria-label="Список задач">
      <li v-for="todo in filteredTodos" :key="todo.id">
        <Card class="todo-board__card">
          <label class="todo-board__row">
            <input
              class="todo-board__checkbox"
              type="checkbox"
              :checked="todo.completed"
              :disabled="toggleMutation.isPending.value"
              @change="toggleMutation.mutate(todo.id)"
            />
            <span class="todo-board__label" :class="{ 'todo-board__label--done': todo.completed }">
              {{ todo.title }}
            </span>
            <Button
              type="button"
              variant="ghost"
              class="todo-board__delete"
              :disabled="deleteMutation.isPending.value"
              aria-label="Удалить задачу"
              @click.stop="deleteMutation.mutate(todo.id)"
            >
              ×
            </Button>
          </label>
        </Card>
      </li>
    </ul>

    <p v-if="!isPending && !isError && filteredTodos.length === 0" class="todo-board__state">
      Пока нет задач в этом разделе
    </p>
  </div>
</template>

<style scoped>
.todo-board {
  display: flex;
  flex-direction: column;
  gap: var(--space-md, 16px);
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-lg, 24px);
}

.todo-board__header {
  text-align: center;
}

.todo-board__title {
  margin: 0;
  font-size: var(--font-size-xl, 1.35rem);
}

.todo-board__subtitle {
  margin: var(--space-xs, 4px) 0 0;
  color: var(--color-text-muted, #a1a1aa);
  font-size: var(--font-size-xs, 0.85rem);
}

.todo-board__form {
  margin: 0;
}

.todo-board__filters {
  margin: 0;
}

.todo-board__state {
  margin: 0;
  text-align: center;
  color: var(--color-text-muted, #a1a1aa);
  font-size: var(--font-size-sm, 0.9rem);
}

.todo-board__state--error {
  color: var(--color-danger, #f87171);
}

.todo-board__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-sm, 8px);
}

.todo-board__card {
  padding: var(--space-sm, 8px) var(--space-md, 12px);
}

.todo-board__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-sm, 8px);
  cursor: pointer;
}

.todo-board__checkbox {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--color-accent, #3d4248);
}

.todo-board__label {
  line-height: 1.35;
  word-break: break-word;
}

.todo-board__label--done {
  text-decoration: line-through;
  color: var(--color-text-muted, #a1a1aa);
}

.todo-board__delete {
  min-height: auto;
  min-width: 2rem;
  padding: 0 0.25rem;
  font-size: 1.25rem;
  line-height: 1;
}
</style>
