import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // avoid clashing with your other project
    proxy: {
      '/api': {
        target: 'http://localhost:5090', // ShopSquare gateway
        changeOrigin: true
      }
    }
  }
})
