import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // -----------------------------------------------------------------------
  // هام: قم بتغيير 'REPO_NAME' في السطر التالي إلى اسم المستودع الخاص بك على GitHub
  // مثال: إذا كان رابط المشروع https://github.com/username/my-project
  // اجعل القيمة: '/my-project/'
  // -----------------------------------------------------------------------
  // إذا كان الموقع هو صفحة المستخدم الرئيسية (username.github.io)، اجعل القيمة '/'
  base: '/REPO_NAME/', 
  build: {
    outDir: 'dist',
  }
})