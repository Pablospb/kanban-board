import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  /**
   * PWA (установка из браузера):
   * - Web App Manifest: `public/manifest.json` (иконки SVG: `/icon.svg`, maskable `/icon-maskable.svg`).
   * - Подключение в `index.html`: link rel=manifest, meta theme-color, теги под Apple.
   *
   * Ниже — manifest **сборки Vite** (карта имён чанков → файлы с хэшами в `dist/.vite/manifest.json`).
   * Это не манифест PWA и не перезаписывает `/manifest.json` из public.
   */
  build: {
    manifest: true,
  },
})
