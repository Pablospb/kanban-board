<script setup lang="ts">
export interface TaskCardTask {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
}

const props = defineProps<{
  task: TaskCardTask
  isEditing: boolean
  editValue: string
}>()

const emit = defineEmits<{
  'update:editValue': [value: string]
  delete: []
  'start-edit': []
  'save-edit': []
  'cancel-edit': []
  'cycle-priority': []
  'drag-start': []
}>()

function railClass(p: TaskCardTask['priority']) {
  if (p === 'high') return 'task-card__rail--high'
  if (p === 'medium') return 'task-card__rail--medium'
  return 'task-card__rail--low'
}

function priorityLabel(p: TaskCardTask['priority']) {
  if (p === 'high') return 'Высокий приоритет'
  if (p === 'medium') return 'Средний приоритет'
  return 'Низкий приоритет'
}
</script>

<template>
  <article
    class="task-card"
    draggable="true"
    @dragstart="emit('drag-start')"
  >
    <div
      class="task-card__rail"
      :class="railClass(task.priority)"
      aria-hidden="true"
    />

    <div class="task-card__body">
      <button
        type="button"
        class="task-card__delete"
        aria-label="Удалить задачу"
        @click.stop="emit('delete')"
      >
        ×
      </button>

      <div v-if="props.isEditing" class="task-card__edit">
        <input
          class="task-card__input"
          :value="props.editValue"
          autofocus
          @input="emit('update:editValue', ($event.target as HTMLInputElement).value)"
          @keyup.enter="emit('save-edit')"
          @blur="emit('save-edit')"
          @keyup.escape="emit('cancel-edit')"
        >
      </div>
      <h3
        v-else
        class="task-card__title"
        @click="emit('start-edit')"
      >
        {{ task.title }}
      </h3>

      <p class="task-card__desc">
        {{ priorityLabel(task.priority) }}
      </p>

      <div class="task-card__footer">
        <button
          type="button"
          class="task-card__priority-hit"
          title="Сменить приоритет"
          @click.stop="emit('cycle-priority')"
        >
          <span class="task-card__priority-dot" :class="railClass(task.priority)" />
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  --task-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
  --task-card-shadow-hover: 0 10px 28px rgba(0, 0, 0, 0.38);

  display: flex;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface-2) 88%, var(--color-surface) 12%);
  box-shadow: var(--task-card-shadow);
  cursor: grab;
  transition:
    transform var(--motion-base) ease,
    box-shadow var(--motion-base) ease,
    border-color var(--motion-base) ease,
    background var(--motion-base) ease;
}

.task-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-accent) 22%, var(--color-border));
  box-shadow:
    var(--task-card-shadow-hover),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.task-card:active {
  cursor: grabbing;
  transform: translateY(-1px);
}

.task-card__rail {
  width: 4px;
  flex-shrink: 0;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  align-self: stretch;
  min-height: 100%;
}

.task-card__rail--high {
  background: var(--color-accent);
}

.task-card__rail--medium {
  background: color-mix(in srgb, var(--color-accent) 58%, var(--color-text-muted));
}

.task-card__rail--low {
  background: color-mix(in srgb, var(--color-accent) 32%, var(--color-text-muted));
}

.task-card__body {
  position: relative;
  flex: 1;
  min-width: 0;
  padding: var(--space-md) calc(var(--space-md) + var(--space-sm)) var(--space-sm)
    var(--space-md);
}

.task-card__delete {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 1;
  padding: var(--space-xs);
  border: none;
  background: transparent;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  opacity: 0;
  border-radius: var(--radius-sm);
  transition:
    color var(--motion-base) ease,
    opacity var(--motion-base) ease,
    background var(--motion-base) ease;
}

.task-card:hover .task-card__delete,
.task-card:focus-within .task-card__delete {
  opacity: 1;
}

.task-card__delete:hover {
  color: var(--color-danger);
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
}

.task-card__edit {
  min-width: 0;
  padding-right: 2rem;
}

.task-card__input {
  width: 100%;
  min-width: 0;
  border-radius: var(--radius-sm);
  border: 1px solid color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  background: color-mix(in srgb, var(--color-surface-2) 94%, transparent);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
  outline: none;
}

.task-card__input:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.task-card__title {
  margin: 0;
  padding-right: 2rem;
  min-width: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: var(--color-text);
  word-break: break-word;
  cursor: text;
  transition: color var(--motion-base) ease;
}

.task-card__title:hover {
  color: color-mix(in srgb, var(--color-text) 92%, var(--color-accent));
}

.task-card__desc {
  margin: var(--space-xs) 0 0;
  padding-right: 2rem;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  color: var(--color-text-muted);
}

.task-card__footer {
  margin-top: var(--space-sm);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.task-card__priority-hit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  transition: background var(--motion-base) ease;
}

.task-card__priority-hit:hover {
  background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
}

.task-card__priority-dot {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-border) 80%, transparent);
  transition: box-shadow var(--motion-base) ease;
}

.task-card__priority-hit:hover .task-card__priority-dot {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
}
</style>
