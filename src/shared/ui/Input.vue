<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  maxlength?: number
  placeholder?: string
  /** Текст для `aria-label` у поля ввода */
  ariaLabel?: string
}>()
</script>

<template>
  <input
    v-model="model"
    class="ui-input"
    type="text"
    autocomplete="off"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
  />
</template>

<style scoped>
.ui-input {
  font: inherit;
  width: 100%;
  min-height: var(--control-height-sm, 36px);
  padding: 0 var(--space-sm, 8px);
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.14));
  background: color-mix(in srgb, var(--color-surface, #18181b) 92%, transparent);
  color: var(--color-text, #fafafa);
  outline: none;
  transition:
    border-color var(--motion-base, 160ms) ease,
    box-shadow var(--motion-base, 160ms) ease;
}

.ui-input::placeholder {
  color: var(--color-text-muted, #a1a1aa);
}

.ui-input:focus-visible {
  border-color: color-mix(in srgb, var(--color-accent, #a855f7) 50%, var(--color-border, rgba(255, 255, 255, 0.14)));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent, #a855f7) 25%, transparent);
}
</style>
