import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        onboard: 'onboard.html',
        onboardV2: 'onboard-v2.html'
      }
    }
  }
})
