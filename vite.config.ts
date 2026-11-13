import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4001,
    watch: {
      // Polling allows HMR to detect changes through a Docker bind mount.
      usePolling: true
    },
    proxy: {
      // Browser requests stay on localhost:4000 while Vite forwards them internally.
      '/api': {
        target: 'http://host.docker.internal:3000',
        changeOrigin: false
      },
      '/health': {
        target: 'http://host.docker.internal:3000',
        changeOrigin: false
      }
    }
  }
})
