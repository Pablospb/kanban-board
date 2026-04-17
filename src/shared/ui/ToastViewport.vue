<script setup lang="ts">
import { useToastStore } from '@/shared/model/useToastStore'

const toastStore = useToastStore()
</script>

<template>
  <teleport to="body">
    <aside class="toast-viewport" aria-live="polite" aria-atomic="true">
      <div
        v-for="message in toastStore.messages"
        :key="message.id"
        class="toast-viewport__item"
        :class="`toast-viewport__item--${message.variant}`"
      >
        <span>{{ message.text }}</span>
        <button class="toast-viewport__close" type="button" @click="toastStore.remove(message.id)">
          ×
        </button>
      </div>
    </aside>
  </teleport>
</template>

<style scoped>
.toast-viewport {
  position: fixed;
  right: var(--space-lg);
  bottom: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
  z-index: 50;
}

.toast-viewport__item {
  min-width: 260px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 86%, transparent);
  color: var(--color-text);
  box-shadow: var(--shadow-soft);
  padding: var(--space-sm) var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
  animation: toast-in var(--motion-base) ease;
}

.toast-viewport__item--success {
  border-color: color-mix(in srgb, var(--color-success) 40%, var(--color-border));
}

.toast-viewport__item--error {
  border-color: color-mix(in srgb, var(--color-danger) 40%, var(--color-border));
}

.toast-viewport__close {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
