export const TODO_LIMITS = {
  titleMinLength: 3,
  titleMaxLength: 120,
} as const

export const TODO_FILTER = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const

export const TODO_STORAGE_KEY = 'todo-app.tasks.v1'
export const TODO_API_DELAY_MS = 120
