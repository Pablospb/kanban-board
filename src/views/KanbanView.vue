<script setup lang="ts">
import { useRouter } from 'vue-router'
import KanbanBoard from '@/components/KanbanBoard.vue'

const router = useRouter()

const goHome = (): void => {
  router.push({ name: 'landing' })
}
</script>

<template>
  <KanbanBoard @close="goHome" />
</template>
