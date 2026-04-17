import { describe, expect, it } from 'vitest'
import { createTodoSchema } from '@/entities/todo'

describe('createTodoSchema', () => {
  it('валидирует корректный заголовок', () => {
    const result = createTodoSchema.safeParse({ title: 'Подготовить релиз' })
    expect(result.success).toBe(true)
  })

  it('отклоняет слишком короткий заголовок', () => {
    const result = createTodoSchema.safeParse({ title: 'ok' })
    expect(result.success).toBe(false)
  })
})
