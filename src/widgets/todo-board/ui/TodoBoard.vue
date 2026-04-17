<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { TODO_FILTER, todoApi, todoQueryKeys, type Todo } from '@/entities/todo'
import { CreateTodoForm } from '@/features/todo/create-todo'
import { TodoFilterTabs, useTodoFilterStore } from '@/features/todo/filter-todos'
import { useDeleteTodo } from '@/features/todo/delete-todo'
import { useToggleTodo } from '@/features/todo/toggle-todo'
import { Card, TodoItem } from '@/shared/ui'

const filterStore = useTodoFilterStore()
const toggleTodoMutation = useToggleTodo()
const deleteTodoMutation = useDeleteTodo()

const todoQuery = useQuery({
  queryKey: todoQueryKeys.root,
  queryFn: todoApi.getTodos,
})

const filteredTodos = computed(() => {
  const todos = todoQuery.data.value ?? []
  const filter = filterStore.filter

  if (filter === TODO_FILTER.active) {
    return todos.filter((todo) => !todo.completed)
  }

  if (filter === TODO_FILTER.completed) {
    return todos.filter((todo) => todo.completed)
  }

  return todos
})

const completedCount = computed(
  () => (todoQuery.data.value ?? []).filter((todo) => todo.completed).length,
)
const totalCount = computed(() => todoQuery.data.value?.length ?? 0)

const handleToggle = async (todo: Todo): Promise<void> => {
  await toggleTodoMutation.mutateAsync(todo.id)
}

const handleDelete = async (todo: Todo): Promise<void> => {
  await deleteTodoMutation.mutateAsync(todo.id)
}
</script>

<template>
  <Card class="todo-board">
    <header class="todo-board__header">
      <h1 class="todo-board__title">TODO Focus</h1>
      <p class="todo-board__subtitle">
        Выполнено {{ completedCount }} из {{ totalCount }}
      </p>
    </header>

    <CreateTodoForm />
    <TodoFilterTabs />

    <p v-if="todoQuery.isLoading.value" class="todo-board__status">Загрузка задач...</p>
    <p v-else-if="todoQuery.isError.value" class="todo-board__status todo-board__status--error">
      Не удалось загрузить список задач
    </p>
    <ul v-else-if="filteredTodos.length" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @remove="handleDelete"
      />
    </ul>
    <p v-else class="todo-board__status">Список задач пуст</p>
  </Card>
</template>

<style scoped>
.todo-board {
  width: min(760px, 100%);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  display: grid;
  gap: var(--space-lg);
  animation: board-enter var(--motion-base) ease;
}

.todo-board__header {
  display: grid;
  gap: var(--space-2xs);
}

.todo-board__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.todo-board__subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.todo-board__status {
  margin: 0;
  color: var(--color-text-muted);
  padding: var(--space-sm) 0;
}

.todo-board__status--error {
  color: var(--color-danger);
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-sm);
}

@keyframes board-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
