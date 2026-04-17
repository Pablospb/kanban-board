import type { z } from 'zod'
import { createTodoSchema, todoSchema } from './schema'
import { TODO_FILTER } from './constants'

export type Todo = z.infer<typeof todoSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>

export type TodoFilter = (typeof TODO_FILTER)[keyof typeof TODO_FILTER]
