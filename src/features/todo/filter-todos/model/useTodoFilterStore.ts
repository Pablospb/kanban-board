import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TODO_FILTER, type TodoFilter } from '@/entities/todo'

export const useTodoFilterStore = defineStore('todoFilter', () => {
  const filter = ref<TodoFilter>(TODO_FILTER.all)

  const setFilter = (nextFilter: TodoFilter): void => {
    filter.value = nextFilter
  }

  return {
    filter,
    setFilter,
  }
})
