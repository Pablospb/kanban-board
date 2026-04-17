import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { todoApi, todoQueryKeys, type CreateTodoInput, type Todo } from '@/entities/todo'
import { useToastStore } from '@/shared/model/useToastStore'

export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  const toastStore = useToastStore()

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKeys.root })

      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKeys.root) ?? []
      const optimisticTodo: Todo = {
        id: `optimistic-${crypto.randomUUID()}`,
        title: input.title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Todo[]>(todoQueryKeys.root, [optimisticTodo, ...previousTodos])
      return { previousTodos }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(todoQueryKeys.root, context.previousTodos)
      }
      toastStore.push('Не удалось создать задачу', 'error')
    },
    onSuccess: () => {
      toastStore.push('Задача добавлена', 'success')
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKeys.root })
    },
  })
}
