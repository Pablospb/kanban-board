import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { todoApi, todoQueryKeys, type Todo } from '@/entities/todo'
import { useToastStore } from '@/shared/model/useToastStore'

export const useToggleTodo = () => {
  const queryClient = useQueryClient()
  const toastStore = useToastStore()

  return useMutation({
    mutationFn: todoApi.toggleTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.root })
      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKeys.root) ?? []

      queryClient.setQueryData<Todo[]>(
        todoQueryKeys.root,
        previousTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ),
      )

      return { previousTodos }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(todoQueryKeys.root, context.previousTodos)
      }
      toastStore.push('Не удалось обновить задачу', 'error')
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.root })
    },
  })
}
