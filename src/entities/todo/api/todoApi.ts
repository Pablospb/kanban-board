import { createTodoSchema, todoListSchema } from '../model/schema'
import { TODO_API_DELAY_MS, TODO_STORAGE_KEY } from '../model/constants'
import type { CreateTodoInput, Todo } from '../model/types'

const createId = (): string => crypto.randomUUID()

const readTodos = (): Todo[] => {
  const rawValue = localStorage.getItem(TODO_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  const parsedValue = JSON.parse(rawValue) as unknown
  return todoListSchema.parse(parsedValue)
}

const writeTodos = (todos: Todo[]): void => {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
}

const resolveAsync = <T>(value: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), TODO_API_DELAY_MS)
  })

export const todoApi = {
  async getTodos(): Promise<Todo[]> {
    return resolveAsync(readTodos())
  },
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const payload = createTodoSchema.parse(input)
    const newTodo: Todo = {
      id: createId(),
      title: payload.title,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const nextTodos = [newTodo, ...readTodos()]
    writeTodos(nextTodos)

    return resolveAsync(newTodo)
  },
  async toggleTodo(todoId: string): Promise<void> {
    const nextTodos = readTodos().map((todo) => {
      if (todo.id !== todoId) {
        return todo
      }

      return { ...todo, completed: !todo.completed }
    })

    writeTodos(nextTodos)
    await resolveAsync(undefined)
  },
  async removeTodo(todoId: string): Promise<void> {
    const nextTodos = readTodos().filter((todo) => todo.id !== todoId)
    writeTodos(nextTodos)
    await resolveAsync(undefined)
  },
}
