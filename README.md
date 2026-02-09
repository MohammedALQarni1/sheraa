# Sheraa Application

مشروع تطبيق إعلانات مبوبة مع نظام ولاء.

## خطوات النشر على GitHub Pages

لرفع التعديلات ونشر الموقع، اتبع الخطوات التالية في التيرمينال:

1. **تثبيت الحزم (مرة واحدة)**
   ```bash
   npm install
   ```

2. **بناء المشروع (Build)**
   يقوم هذا الأمر بإنشاء مجلد `dist` جاهز للنشر.
   ```bash
   npm run build
   ```

3. **النشر (Deploy)**
   *(ملاحظة: تأكد من تثبيت `gh-pages` أو استخدام GitHub Actions للنشر التلقائي)*
   ```bash
   npm run deploy
   ```

## إعدادات GitHub Repository

لضمان ظهور الموقع:
1. اذهب إلى **Settings** في مستودع GitHub.
2. اختر **Pages** من القائمة الجانبية.
3. تحت **Build and deployment**:
   - تأكد من اختيار الفرع: `gh-pages` (أو `main` إذا كنت تستخدم GitHub Actions).
   - المجلد: `root` (أو `/`).

## ملاحظات هامة
- تم ضبط `base` في `vite.config.ts` ليكون `/sheraa/`.
- جميع المسارات في الكود يجب أن تكون نسبية (مثل `./assets/image.png`).
