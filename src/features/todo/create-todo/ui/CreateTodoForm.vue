<script setup lang="ts">
import { computed, ref } from 'vue'
import { TODO_LIMITS, createTodoSchema } from '@/entities/todo'
import { Button, Input } from '@/shared/ui'
import { useCreateTodo } from '../model/useCreateTodo'

const title = ref('')
const createTodoMutation = useCreateTodo()

const validationMessage = computed(() => {
  const result = createTodoSchema.safeParse({ title: title.value })
  if (result.success) {
    return ''
  }

  return result.error.issues[0]?.message ?? 'Некорректный заголовок задачи'
})

const isSubmitDisabled = computed(
  () => Boolean(validationMessage.value) || createTodoMutation.isPending.value,
)

const handleSubmit = async (): Promise<void> => {
  if (isSubmitDisabled.value) {
    return
  }

  await createTodoMutation.mutateAsync({ title: title.value })
  title.value = ''
}
</script>

<template>
  <form class="todo-form" @submit.prevent="handleSubmit">
    <Input
      v-model="title"
      :maxlength="TODO_LIMITS.titleMaxLength"
      placeholder="Добавить задачу..."
      ariaLabel="Название задачи"
    />
    <Button type="submit" :disabled="isSubmitDisabled">Добавить</Button>
  </form>
  <p v-if="validationMessage" class="todo-form__error">{{ validationMessage }}</p>
</template>

<style scoped>
.todo-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-sm);
}

.todo-form__error {
  margin: var(--space-sm) 0 0;
  color: var(--color-danger);
  font-size: var(--font-size-xs);
}
</style>
