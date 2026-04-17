<template>
  <section class="ui-card">
    <slot />
  </section>
</template>

<style scoped>
.ui-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  backdrop-filter: blur(var(--blur-md));
  box-shadow: var(--shadow-soft);
}
</style>
