import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/webapp-news-bot/',
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ce68-212-73-67-186.ngrok-free.app',
      '.ngrok-free.app', // Разрешить все поддомены ngrok-free.app
    ],
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@app', replacement: '/src/app' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@widgets', replacement: '/src/widgets' },
      { find: '@features', replacement: '/src/features' },
      { find: '@entities', replacement: '/src/entities' },
      { find: '@shared', replacement: '/src/shared' }
    ]
  }
})
