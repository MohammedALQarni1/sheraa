import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // تم تحديث المسار ليطابق اسم المستودع الخاص بك كما يظهر في الرابط
  base: '/sheraa/', 
  build: {
    outDir: 'dist',
  }
})