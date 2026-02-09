import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // لأن رابطك: https://mohammedalqarni1.github.io/sheraa/
  base: '/sheraa/',
  build: {
    outDir: 'dist',
  }
})