<script setup lang="ts">
const checked = defineModel<boolean>({ default: false })

defineProps<{
  ariaLabel: string
}>()
</script>

<template>
  <label class="ui-toggle">
    <input v-model="checked" class="ui-toggle__input" type="checkbox" :aria-label="ariaLabel" />
    <span class="ui-toggle__control" />
  </label>
</template>

<style scoped>
.ui-toggle {
  position: relative;
  display: inline-flex;
}

.ui-toggle__input {
  position: absolute;
  opacity: 0;
  inline-size: 1px;
  block-size: 1px;
}

.ui-toggle__control {
  width: 40px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: background-color var(--motion-fast) ease;
}

.ui-toggle__control::after {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition:
    transform var(--motion-fast) ease,
    background-color var(--motion-fast) ease;
}

.ui-toggle__input:checked + .ui-toggle__control {
  background: color-mix(in srgb, var(--color-accent) 35%, var(--color-surface-soft));
}

.ui-toggle__input:checked + .ui-toggle__control::after {
  transform: translateX(16px);
  background: var(--color-text);
}
</style>
