import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { todoApi, todoQueryKeys, type Todo } from '@/entities/todo'
import { useToastStore } from '@/shared/model/useToastStore'

export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  const toastStore = useToastStore()

  return useMutation({
    mutationFn: todoApi.removeTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.root })
      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKeys.root) ?? []

      queryClient.setQueryData<Todo[]>(
        todoQueryKeys.root,
        previousTodos.filter((todo) => todo.id !== todoId),
      )

      return { previousTodos }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(todoQueryKeys.root, context.previousTodos)
      }
      toastStore.push('Не удалось удалить задачу', 'error')
    },
    onSuccess: () => {
      toastStore.push('Задача удалена', 'info')
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.root })
    },
  })
}
