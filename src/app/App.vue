<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ErrorBoundary, ToastViewport } from '@/shared/ui'
</script>

<template>
  <ErrorBoundary>
    <div class="app-shell">
      <header class="app-header" role="banner">
        <div class="app-header__inner">
          <p class="app-header__brand">Задачи</p>
          <nav class="app-nav" aria-label="Основная навигация">
            <RouterLink
              class="app-nav__link"
              active-class="app-nav__link--active"
              :to="{ name: 'kanban' }"
            >
              Канбан-доска
            </RouterLink>
            <RouterLink
              class="app-nav__link"
              active-class="app-nav__link--active"
              :to="{ name: 'todo' }"
            >
              Список To-Do
            </RouterLink>
          </nav>
        </div>
      </header>
      <main class="app-main">
        <RouterView />
      </main>
      <ToastViewport />
    </div>
  </ErrorBoundary>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 100%, transparent);
  background: color-mix(in srgb, var(--color-surface-elevated) 92%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.app-header__inner {
  display: flex;
  max-width: 72rem;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
}

.app-header__brand {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.app-nav {
  display: inline-flex;
  padding: 0.1875rem;
  gap: 0.125rem;
  border-radius: 0.625rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 100%, transparent);
  background: color-mix(in srgb, var(--color-surface-soft) 80%, transparent);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.app-nav__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.375rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
}

.app-nav__link:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
}

.app-nav__link--active {
  color: #fff;
  background: var(--color-accent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent),
    0 2px 12px color-mix(in srgb, var(--color-accent) 35%, transparent);
}

.app-nav__link:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-accent) 55%, transparent);
  outline-offset: 2px;
}

.app-main {
  flex: 1;
  width: 100%;
}

@media (max-width: 520px) {
  .app-header__inner {
    flex-direction: column;
    align-items: stretch;
    padding-inline: 1rem;
  }

  .app-nav {
    width: 100%;
    justify-content: stretch;
  }

  .app-nav__link {
    flex: 1;
    min-width: 0;
  }
}
</style>
