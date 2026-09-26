import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/** Порт, на котором работает Express-бэкенд. */
const SERVER_PORT = 3001

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
