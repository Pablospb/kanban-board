<script setup lang="ts">
import { TODO_FILTER, type TodoFilter } from '@/entities/todo'
import { Button } from '@/shared/ui'
import { useTodoFilterStore } from '../model/useTodoFilterStore'

type FilterTab = {
  value: TodoFilter
  label: string
}

const FILTER_TABS: FilterTab[] = [
  { value: TODO_FILTER.all, label: 'Все' },
  { value: TODO_FILTER.active, label: 'Активные' },
  { value: TODO_FILTER.completed, label: 'Выполненные' },
]

const todoFilterStore = useTodoFilterStore()
</script>

<template>
  <div class="todo-filter-tabs" role="tablist" aria-label="Фильтрация задач">
    <Button
      v-for="tab in FILTER_TABS"
      :key="tab.value"
      variant="ghost"
      class="todo-filter-tabs__button"
      :class="{ 'todo-filter-tabs__button--active': todoFilterStore.filter === tab.value }"
      type="button"
      role="tab"
      @click="todoFilterStore.setFilter(tab.value)"
    >
      {{ tab.label }}
    </Button>
  </div>
</template>

<style scoped>
.todo-filter-tabs {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.todo-filter-tabs__button {
  border-radius: 999px;
  min-height: var(--control-height-sm);
  padding: 0 var(--space-md);
}

.todo-filter-tabs__button--active {
  background: color-mix(in srgb, var(--color-surface-soft) 85%, transparent);
  color: var(--color-text);
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent);
}
</style>
