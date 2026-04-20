<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
}

interface Column {
  id: string
  title: string
  color: string
  tasks: Task[]
}

const columns = reactive<Column[]>([
  { id: 'todo', title: 'To Do', color: 'bg-blue-500', tasks: [] },
  { id: 'progress', title: 'In Progress', color: 'bg-amber-500', tasks: [] },
  { id: 'done', title: 'Done', color: 'bg-emerald-500', tasks: [] }
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
    const parsed = JSON.parse(saved)
    columns.forEach(col => {
      const savedCol = parsed.find((c: any) => c.id === col.id)
      if (savedCol?.tasks) col.tasks = savedCol.tasks
    })
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

const getPriorityColor = (p: string) => {
  if (p === 'high') return 'bg-red-500'
  if (p === 'medium') return 'bg-yellow-500'
  return 'bg-emerald-500'
}

const getPriorityLabel = (p: string) => {
  if (p === 'high') return 'Высокий'
  if (p === 'medium') return 'Средний'
  return 'Низкий'
}

const emit = defineEmits(['close'])
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <div
      class="border-b border-zinc-800 bg-zinc-900 pb-5 pt-[max(1.25rem,env(safe-area-inset-top,0px))] sticky top-0 z-10"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div class="flex min-w-0 items-center gap-4">
          <span class="text-4xl shrink-0">📋</span>
          <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold truncate">Канбан Доска</h1>
            <p class="text-zinc-400 text-sm truncate">Modern Todo</p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors text-sm font-medium"
        >
          ← Вернуться на главную
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="column in columns" 
             :key="column.id"
             class="bg-zinc-900 rounded-3xl p-6 border border-zinc-800/80"
             @dragover="allowDrop"
             @drop="drop($event, column.id)">
          
          <div class="flex items-center justify-between gap-3 mb-6">
            <div class="flex min-w-0 items-center gap-3">
              <div :class="['w-4 h-4 shrink-0 rounded-full', column.color]"></div>
              <h2 class="text-xl sm:text-2xl font-semibold truncate">{{ column.title }}</h2>
            </div>
            <div class="shrink-0 bg-zinc-800 text-xs px-3 py-1 rounded-2xl font-mono tabular-nums">
              {{ column.tasks.length }}
            </div>
          </div>

          <!-- Поле добавления + кнопка -->
          <div class="flex gap-2 mb-4 min-w-0">
            <input
              v-model="newTaskTitle"
              @keyup.enter="addTask(column.id)"
              placeholder="Добавить задачу..."
              class="min-w-0 flex-1 bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-2xl px-5 py-3 text-sm outline-none"
            >
            <button
              type="button"
              @click="addTask(column.id)"
              class="shrink-0 w-12 h-12 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 rounded-2xl text-3xl flex items-center justify-center transition-all active:scale-90"
            >
              +
            </button>
          </div>

          <!-- Выбор приоритета (один раз на колонку) -->
          <div class="flex gap-1.5 mb-6 min-w-0 p-1 bg-zinc-950 rounded-2xl">
            <button
              v-for="p in ['high', 'medium', 'low']"
              :key="p"
              type="button"
              @click="newTaskPriority = p as any"
              :class="[
                'min-w-0 flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 text-[10px] sm:text-xs font-medium rounded-xl transition-all',
                newTaskPriority === p
                  ? 'bg-zinc-800 shadow-inner ring-1 ring-violet-400'
                  : 'hover:bg-zinc-900',
              ]"
            >
              <span :class="['w-3 h-3 shrink-0 rounded-full', getPriorityColor(p)]"></span>
              <span class="truncate">{{ getPriorityLabel(p) }}</span>
            </button>
          </div>

          <!-- Список задач -->
          <div class="space-y-3 min-h-[380px]">
            <div
              v-for="task in column.tasks"
              :key="task.id"
              draggable="true"
              @dragstart="startDrag(task, column.id)"
              class="group bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-2xl p-5 cursor-grab active:cursor-grabbing transition-all relative"
            >
              <button
                type="button"
                @click.stop="deleteTask(column.id, task.id)"
                class="absolute top-3 right-3 z-[1] text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all text-xl leading-none p-1"
              >
                ×
              </button>

              <div v-if="editingTaskId === task.id" class="min-w-0 pr-10">
                <input
                  v-model="editValue"
                  @keyup.enter="saveEdit(column.id, task.id)"
                  @blur="saveEdit(column.id, task.id)"
                  @keyup.escape="cancelEdit"
                  class="w-full min-w-0 bg-zinc-700 border border-violet-500 rounded-xl px-4 py-2.5 outline-none"
                  autofocus
                >
              </div>
              <div
                v-else
                @click="startEditing(task)"
                class="min-w-0 font-medium pr-10 break-words cursor-text hover:text-white transition-colors"
              >
                {{ task.title }}
              </div>

              <div class="mt-6 flex items-center justify-between">
                <span class="text-[10px] uppercase tracking-widest bg-black px-3 py-1 rounded-xl text-zinc-500">TASK</span>
                <div 
                  @click.stop="changePriority(task.id, column.id, 
                    task.priority === 'high' ? 'medium' : task.priority === 'medium' ? 'low' : 'high')"
                  :class="['w-5 h-5 rounded-2xl cursor-pointer ring-2 ring-offset-2 ring-offset-zinc-800 hover:ring-violet-400 transition-all', getPriorityColor(task.priority)]"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
