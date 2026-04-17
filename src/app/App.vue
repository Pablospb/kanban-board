<script setup lang="ts">
import { TodoPage } from '@/pages/todo-page'
import { ErrorBoundary, ToastViewport } from '@/shared/ui'
</script>

<template>
  <ErrorBoundary>
    <TodoPage />
    <ToastViewport />
  </ErrorBoundary>
</template>
