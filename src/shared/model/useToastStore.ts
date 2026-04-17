import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastVariant = 'info' | 'success' | 'error'

export type ToastMessage = {
  id: string
  text: string
  variant: ToastVariant
}

const TOAST_TIMEOUT_MS = 2600

export const useToastStore = defineStore('toast', () => {
  const messages = ref<ToastMessage[]>([])

  const push = (text: string, variant: ToastVariant): void => {
    const id = crypto.randomUUID()

    messages.value = [...messages.value, { id, text, variant }]
    setTimeout(() => {
      messages.value = messages.value.filter((message) => message.id !== id)
    }, TOAST_TIMEOUT_MS)
  }

  const remove = (id: string): void => {
    messages.value = messages.value.filter((message) => message.id !== id)
  }

  return {
    messages,
    push,
    remove,
  }
})
