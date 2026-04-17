import { z } from 'zod'
import { TODO_LIMITS } from './constants'

export const todoIdSchema = z.uuid()

export const todoSchema = z.object({
  id: todoIdSchema,
  title: z
    .string()
    .trim()
    .min(TODO_LIMITS.titleMinLength)
    .max(TODO_LIMITS.titleMaxLength),
  completed: z.boolean(),
  createdAt: z.iso.datetime(),
})

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(TODO_LIMITS.titleMinLength)
    .max(TODO_LIMITS.titleMaxLength),
})

export const todoListSchema = z.array(todoSchema)
