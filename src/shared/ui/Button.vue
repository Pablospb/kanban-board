<script setup lang="ts">
type ButtonVariant = 'primary' | 'ghost' | 'danger'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button class="ui-button" :class="`ui-button--${variant}`" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  min-height: var(--control-height-md);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  padding: 0 var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition:
    transform var(--motion-fast) ease,
    box-shadow var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    border-color var(--motion-fast) ease;
  cursor: pointer;
}

.ui-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.ui-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ui-button--primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-strong));
  color: var(--color-text);
  box-shadow: var(--shadow-soft);
}

.ui-button--ghost {
  border-color: var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
}

.ui-button--danger {
  border-color: color-mix(in srgb, var(--color-danger) 45%, transparent);
  background: color-mix(in srgb, var(--color-danger) 14%, transparent);
  color: var(--color-danger);
}
</style>
