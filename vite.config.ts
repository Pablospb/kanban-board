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
   * PWA: `public/manifest.json` (иконки PNG: `/icons/icon-192.png`, `/icons/icon-512.png`), SW — `public/sw.js`.
   * В `index.html`: link manifest, theme-color, Apple touch icon.
   *
   * `build.manifest` — это карта чанков Vite (`dist/.vite/manifest.json`), не Web App Manifest.
   */
  build: {
    manifest: true,
  },
})
