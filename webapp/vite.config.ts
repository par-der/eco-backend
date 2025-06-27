import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/webapp/',
  plugins: [react(), tailwindcss(),],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app'],
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000', // Порт вашего FastAPI
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // },
  },
})
