<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    maxlength?: number
    ariaLabel: string
  }>(),
  {
    placeholder: '',
    maxlength: undefined,
  },
)
</script>

<template>
  <input
    v-model="modelValue"
    class="ui-input"
    type="text"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
  />
</template>

<style scoped>
.ui-input {
  width: 100%;
  min-height: var(--control-height-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-surface-soft) 88%, transparent);
  color: var(--color-text);
  padding: 0 var(--space-md);
  font-size: var(--font-size-sm);
  outline: none;
  transition:
    border-color var(--motion-fast) ease,
    box-shadow var(--motion-fast) ease;
}

.ui-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 28%, transparent);
}
</style>
