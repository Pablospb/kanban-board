<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useToastStore } from '@/shared/model/useToastStore'
import Button from './Button.vue'

const hasError = ref(false)
const toastStore = useToastStore()

onErrorCaptured((error) => {
  hasError.value = true
  toastStore.push('Произошла критическая ошибка интерфейса', 'error')
  console.error(error)
  return false
})

const reloadPage = (): void => {
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <h2 class="error-boundary__title">Что-то пошло не так</h2>
    <p class="error-boundary__text">Попробуй перезагрузить приложение</p>
    <Button @click="reloadPage">Перезагрузить</Button>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: var(--space-sm);
  text-align: center;
}

.error-boundary__title {
  margin: 0;
  font-size: var(--font-size-xl);
}

.error-boundary__text {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
