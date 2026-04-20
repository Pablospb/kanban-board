<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import TaskCard from '@/components/TaskCard.vue'

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
}

interface Column {
  id: string
  title: string
  dotVariant: 'todo' | 'progress' | 'done'
  tasks: Task[]
}

const NEW_TASK_PRIORITY_OPTIONS = ['high', 'medium', 'low'] as const

function isTaskPriority(value: unknown): value is Task['priority'] {
  return value === 'low' || value === 'medium' || value === 'high'
}

function parseStoredTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) {
    return []
  }
  const tasks: Task[] = []
  for (const item of raw) {
    if (item === null || typeof item !== 'object') {
      continue
    }
    const rec = item as Record<string, unknown>
    const id = rec.id
    const title = rec.title
    const priority = rec.priority
    if (typeof id !== 'string' || typeof title !== 'string' || !isTaskPriority(priority)) {
      continue
    }
    tasks.push({ id, title, priority })
  }
  return tasks
}

function isStoredColumnRow(entry: unknown, columnId: string): entry is { id: string; tasks?: unknown } {
  if (entry === null || typeof entry !== 'object' || !('id' in entry)) {
    return false
  }
  const id = (entry as { id: unknown }).id
  return typeof id === 'string' && id === columnId
}

const columns = reactive<Column[]>([
  { id: 'todo', title: 'To Do', dotVariant: 'todo', tasks: [] },
  { id: 'progress', title: 'In Progress', dotVariant: 'progress', tasks: [] },
  { id: 'done', title: 'Done', dotVariant: 'done', tasks: [] }
])

const newTaskTitle = ref('')
const newTaskPriority = ref<'low' | 'medium' | 'high'>('medium')

const draggedTask = ref<Task | null>(null)
const draggedFromColumn = ref<string | null>(null)
const editingTaskId = ref<string | null>(null)
const editValue = ref('')

const loadFromStorage = () => {
  const saved = localStorage.getItem('modernTodo')
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved)
      if (!Array.isArray(parsed)) {
        return
      }
      columns.forEach((col) => {
        const savedCol = parsed.find((entry) => isStoredColumnRow(entry, col.id))
        if (savedCol?.tasks !== undefined) {
          col.tasks = parseStoredTasks(savedCol.tasks)
        }
      })
    } catch {
      /* некорректный JSON — оставляем текущее состояние колонок */
    }
  } else {
    columns[0].tasks = [
      { id: '1', title: 'Изучить новый дизайн системы', priority: 'high' },
      { id: '2', title: 'Подготовить презентацию', priority: 'medium' }
    ]
    columns[1].tasks = [
      { id: '3', title: 'Реализовать канбан-доску', priority: 'high' }
    ]
    columns[2].tasks = [
      { id: '4', title: 'Настроить Vite + Vue проект', priority: 'low' },
      { id: '5', title: 'Сделать красивый лендинг', priority: 'medium' }
    ]
    saveToStorage()
  }
}

const saveToStorage = () => {
  localStorage.setItem('modernTodo', JSON.stringify(columns))
}

onMounted(loadFromStorage)
watch(columns, saveToStorage, { deep: true })

const addTask = (columnId: string) => {
  const trimmed = newTaskTitle.value.trim()
  if (!trimmed) return

  const column = columns.find(c => c.id === columnId)
  if (column) {
    column.tasks.unshift({
      id: 'task-' + Date.now(),
      title: trimmed,
      priority: newTaskPriority.value
    })
    newTaskTitle.value = ''
    // newTaskPriority.value = 'medium' // можно раскомментировать, если хочешь сброс
  }
}

const changePriority = (taskId: string, columnId: string, newPriority: 'low' | 'medium' | 'high') => {
  const column = columns.find(c => c.id === columnId)
  const task = column?.tasks.find(t => t.id === taskId)
  if (task) task.priority = newPriority
}

const startEditing = (task: Task) => {
  editingTaskId.value = task.id
  editValue.value = task.title
}

const saveEdit = (columnId: string, taskId: string) => {
  if (editValue.value.trim()) {
    const column = columns.find(c => c.id === columnId)
    const task = column?.tasks.find(t => t.id === taskId)
    if (task) task.title = editValue.value.trim()
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingTaskId.value = null
  editValue.value = ''
}

const deleteTask = (columnId: string, taskId: string) => {
  const column = columns.find(c => c.id === columnId)
  if (column) column.tasks = column.tasks.filter(t => t.id !== taskId)
}

const startDrag = (task: Task, columnId: string) => {
  draggedTask.value = { ...task }
  draggedFromColumn.value = columnId
}

const allowDrop = (e: DragEvent) => e.preventDefault()

const drop = (e: DragEvent, targetColumnId: string) => {
  e.preventDefault()
  if (!draggedTask.value || !draggedFromColumn.value) return

  const fromColumn = columns.find(c => c.id === draggedFromColumn.value)
  const toColumn = columns.find(c => c.id === targetColumnId)

  if (fromColumn && toColumn && fromColumn.id !== toColumn.id) {
    const index = fromColumn.tasks.findIndex(t => t.id === draggedTask.value!.id)
    if (index !== -1) {
      const [movedTask] = fromColumn.tasks.splice(index, 1)
      toColumn.tasks.unshift(movedTask)
    }
  }
  draggedTask.value = null
  draggedFromColumn.value = null
}

const getPriorityClass = (p: Task['priority']) => {
  if (p === 'high') return 'kanban-board__priority-ind--high'
  if (p === 'medium') return 'kanban-board__priority-ind--medium'
  return 'kanban-board__priority-ind--low'
}

const getPriorityLabel = (p: Task['priority']) => {
  if (p === 'high') return 'Высокий'
  if (p === 'medium') return 'Средний'
  return 'Низкий'
}
</script>

<template>
  <div class="kanban-board">
    <header class="kanban-board__toolbar">
      <div class="kanban-board__toolbar-text">
        <h1 class="kanban-board__title">Канбан-доска</h1>
        <p class="kanban-board__subtitle">Задачи сохраняются локально в этом браузере</p>
      </div>
      <RouterLink class="kanban-board__link-landing" :to="{ name: 'landing' }">
        Лендинг и установка PWA
      </RouterLink>
    </header>

    <div class="kanban-board__grid">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-board__column"
        @dragover="allowDrop"
        @drop="drop($event, column.id)"
      >
        <div class="kanban-board__column-head">
          <div class="kanban-board__column-title-wrap">
            <div
              :class="['kanban-board__column-dot', `kanban-board__column-dot--${column.dotVariant}`]"
            ></div>
            <h2 class="kanban-board__column-title">{{ column.title }}</h2>
          </div>
          <div class="kanban-board__column-count">
            {{ column.tasks.length }}
          </div>
        </div>

        <div class="kanban-board__add-row">
          <input
            v-model="newTaskTitle"
            class="kanban-board__input"
            placeholder="Добавить задачу..."
            @keyup.enter="addTask(column.id)"
          >
          <button type="button" class="kanban-board__add-btn" @click="addTask(column.id)">
            +
          </button>
        </div>

        <div class="kanban-board__priority-row">
          <button
            v-for="p in NEW_TASK_PRIORITY_OPTIONS"
            :key="p"
            type="button"
            class="kanban-board__priority-btn"
            :class="{ 'kanban-board__priority-btn--active': newTaskPriority === p }"
            @click="newTaskPriority = p"
          >
            <span :class="['kanban-board__priority-dot', getPriorityClass(p)]"></span>
            <span class="kanban-board__priority-label">{{ getPriorityLabel(p) }}</span>
          </button>
        </div>

        <div class="kanban-board__tasks">
          <TaskCard
            v-for="task in column.tasks"
            :key="task.id"
            :task="task"
            :is-editing="editingTaskId === task.id"
            :edit-value="editValue"
            @update:edit-value="editValue = $event"
            @drag-start="startDrag(task, column.id)"
            @delete="deleteTask(column.id, task.id)"
            @start-edit="startEditing(task)"
            @save-edit="saveEdit(column.id, task.id)"
            @cancel-edit="cancelEdit"
            @cycle-priority="
              changePriority(
                task.id,
                column.id,
                task.priority === 'high'
                  ? 'medium'
                  : task.priority === 'medium'
                    ? 'low'
                    : 'high',
              )
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  color: var(--color-text);
}

@media (min-width: 640px) {
  .kanban-board {
    padding-inline: 2rem;
  }
}

.kanban-board__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.kanban-board__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

@media (min-width: 640px) {
  .kanban-board__title {
    font-size: 1.875rem;
  }
}

.kanban-board__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.kanban-board__link-landing {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 100%, transparent);
  background: color-mix(in srgb, var(--color-surface-soft) 90%, transparent);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    background var(--motion-base) ease,
    border-color var(--motion-base) ease,
    color var(--motion-base) ease;
}

.kanban-board__link-landing:hover {
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-surface-soft) 55%, transparent);
}

.kanban-board__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .kanban-board__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.kanban-board__column {
  border-radius: 1.5rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 100%, transparent);
  background: color-mix(in srgb, var(--color-surface-2) 100%, transparent);
  padding: 1.5rem;
}

.kanban-board__column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.kanban-board__column-title-wrap {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
}

.kanban-board__column-dot {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 9999px;
}

.kanban-board__column-dot--todo {
  background: var(--color-accent);
}

.kanban-board__column-dot--progress {
  background: color-mix(in srgb, var(--color-accent) 72%, var(--color-text-muted));
}

.kanban-board__column-dot--done {
  background: color-mix(in srgb, var(--color-success) 75%, var(--color-accent) 25%);
}

.kanban-board__column-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .kanban-board__column-title {
    font-size: 1.5rem;
  }
}

.kanban-board__column-count {
  flex-shrink: 0;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-surface-soft) 100%, transparent);
  padding: 0.25rem 0.75rem;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.kanban-board__add-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-width: 0;
}

.kanban-board__input {
  min-width: 0;
  flex: 1;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 100%, transparent);
  background: color-mix(in srgb, var(--color-surface-soft) 92%, transparent);
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: var(--color-text);
  outline: none;
  transition: border-color var(--motion-base) ease;
}

.kanban-board__input::placeholder {
  color: var(--color-text-muted);
}

.kanban-board__input:focus {
  border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-border));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 22%, transparent);
}

.kanban-board__add-btn {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 1rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background var(--motion-base) ease,
    transform 0.1s ease;
}

.kanban-board__add-btn:hover {
  background: var(--color-accent-hover);
}

.kanban-board__add-btn:active {
  transform: scale(0.94);
}

.kanban-board__priority-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  min-width: 0;
  padding: 0.35rem;
  border-radius: 1rem;
  background: var(--color-surface-soft);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
}

.kanban-board__priority-btn {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.2rem;
  border: none;
  border-radius: 0.75rem;
  background: transparent;
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  cursor: pointer;
  transition: background var(--motion-base) ease;
}

@media (min-width: 640px) {
  .kanban-board__priority-btn {
    font-size: 0.8125rem;
    padding-inline: 0.35rem;
  }
}

.kanban-board__priority-btn:hover {
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
}

.kanban-board__priority-btn--active {
  background: color-mix(in srgb, var(--color-surface) 100%, transparent);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
  outline: 1px solid color-mix(in srgb, var(--color-accent) 45%, transparent);
}

.kanban-board__priority-dot {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  border-radius: 9999px;
}

.kanban-board__priority-ind--high {
  background: var(--color-accent);
}

.kanban-board__priority-ind--medium {
  background: color-mix(in srgb, var(--color-accent) 58%, var(--color-text-muted));
}

.kanban-board__priority-ind--low {
  background: color-mix(in srgb, var(--color-accent) 32%, var(--color-surface-2));
}

.kanban-board__priority-label {
  max-width: 100%;
  text-align: center;
  line-height: 1.2;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.kanban-board__tasks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 380px;
}

</style>
