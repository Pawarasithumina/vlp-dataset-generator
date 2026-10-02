import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The frontend never computes physics: every /api call is proxied to FastAPI.
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 2000 },
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true } },
  },
})
