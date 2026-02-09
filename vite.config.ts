import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sheraa/',   // استبدل sheraa باسم مستودع GitHub
  build: {
    outDir: 'dist',
  }
})