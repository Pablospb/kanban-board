<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    /** Стиль: «призрачная» кнопка без заливки (вкладки, вторичные действия) */
    variant?: 'primary' | 'ghost'
  }>(),
  { type: 'button', variant: 'primary' },
)
</script>

<template>
  <button class="ui-button" :class="{ 'ui-button--ghost': variant === 'ghost' }" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  appearance: none;
  font: inherit;
  cursor: pointer;
  border-radius: var(--radius-sm, 8px);
  min-height: var(--control-height-sm, 36px);
  padding: 0 var(--space-md, 12px);
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.14));
  background: color-mix(in srgb, var(--color-surface-soft, #27272a) 90%, transparent);
  color: var(--color-text, #fafafa);
  transition:
    background var(--motion-base, 160ms) ease,
    border-color var(--motion-base, 160ms) ease,
    box-shadow var(--motion-base, 160ms) ease;
}

.ui-button:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--color-accent, #3d4248) 35%, var(--color-border, rgba(255, 255, 255, 0.14)));
}

.ui-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ui-button--ghost {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.ui-button--ghost:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-surface-soft, #27272a) 55%, transparent);
}
</style>
