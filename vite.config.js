import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        jobsDone: resolve(import.meta.dirname ?? process.cwd(), 'index.html'),
        mionoStudio: resolve(import.meta.dirname ?? process.cwd(), 'studio/index.html'),
      },
    },
  },
})
