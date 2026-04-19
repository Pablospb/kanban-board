/** Сохранённое событие установки PWA (заполняется в main.ts при beforeinstallprompt). */
export let deferredInstallPrompt: BeforeInstallPromptEvent | null = null

export function clearDeferredInstallPrompt(): void {
  deferredInstallPrompt = null
}

export function initPwaInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredInstallPrompt = e as BeforeInstallPromptEvent
    window.dispatchEvent(new CustomEvent('pwa-install-ready'))
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    window.dispatchEvent(new CustomEvent('pwa-installed'))
  })
}
