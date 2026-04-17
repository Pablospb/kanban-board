import { beforeEach, describe, expect, it } from 'vitest'
import { TODO_STORAGE_KEY, todoApi } from '@/entities/todo'

describe('todoApi', () => {
  beforeEach(() => {
    localStorage.removeItem(TODO_STORAGE_KEY)
  })

  it('создает и читает задачу', async () => {
    await todoApi.createTodo({ title: 'Протестировать API слой' })
    const todos = await todoApi.getTodos()

    expect(todos).toHaveLength(1)
    expect(todos[0]?.title).toBe('Протестировать API слой')
    expect(todos[0]?.completed).toBe(false)
  })
})
