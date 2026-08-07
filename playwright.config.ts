import { defineConfig, devices } from '@playwright/test';
import type { ChromaticConfig } from '@chromatic-com/playwright';

// ============================================================
// 🧪 Playwright Configuration - Prompt Master 2030
// ============================================================
// This file configures Playwright for end-to-end testing.
// It uses Next.js dev server and Neon database (PostgreSQL).

// ============================================================
// 1️⃣ Server Configuration (إعدادات الخادم)
// ============================================================

const PORT = process.env.PORT ?? '3008';
const baseURL = `http://localhost:${PORT}`;

const isCI = !!process.env.CI;
const isProduction = process.env.NODE_ENV === 'production';

// ============================================================
// 2️⃣ Playwright Config (الإعدادات الأساسية)
// ============================================================

export default defineConfig<ChromaticConfig>({
  // 📂 مسار الاختبارات
  testDir: './tests',

  // 🎯 ملفات الاختبار (E2E و Integration)
  testMatch: '*.@(integ|e2e).?(c|m)[jt]s?(x)',

  // ⏱️ المهلة لكل اختبار (30 ثانية)
  timeout: 30 * 1000,

  // 🚫 منع استخدام `test.only` في CI
  forbidOnly: isCI,

  // 📊 التقرير (GitHub Actions أو القائمة)
  reporter: isCI ? 'github' : 'list',

  // 🔍 توقعات (Expect)
  expect: {
    timeout: 15 * 1000,
  },

  // ============================================================
  // 🌐 خادم التطوير (Dev Server)
  // ============================================================

  webServer: {
    // 🚀 تشغيل Next.js في وضع التطوير (مع قاعدة بيانات حقيقية)
    command: isCI
      ? 'npm run build && npm run start' // في CI: بناء ثم تشغيل
      : 'npm run dev', // محلياً: تشغيل مباشر

    url: baseURL,
    timeout: 60 * 1000,
    reuseExistingServer: !isCI,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 2 * 1000 },

    // 🌍 متغيرات البيئة للخادم
    env: {
      BROWSER_TO_TERMINAL_DISABLED: 'true',
      NEXT_PUBLIC_APP_URL: baseURL,
      PORT,
      NODE_ENV: isProduction ? 'production' : 'development',
    },
  },

  // ============================================================
  // 🛠️ إعدادات الاستخدام (Use)
  // ============================================================

  use: {
    baseURL,
    trace: isCI ? 'on' : 'retain-on-failure',
    video: isCI ? 'retain-on-failure' : undefined,
    disableAutoSnapshot: true,
  },

  // ============================================================
  // 🌐 المتصفحات المدعومة (Browsers)
  // ============================================================

  projects: [
    // 🟢 Chromium (Chrome, Edge, Opera)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 🟠 Firefox (في CI فقط لتوفير الوقت)
    ...(isCI
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
        ]
      : []),

    // 📱 Mobile Safari (محاكاة الهواتف)
    // ...(isCI
    //   ? [
    //       {
    //         name: 'mobile-chrome',
    //         use: { ...devices['Pixel 5'] },
    //       },
    //     ]
    //   : []),
  ],

  // ============================================================
  // 📌 ملاحظات إضافية
  // ============================================================
  // 1️⃣ تأكد من تشغيل قاعدة البيانات (Neon) قبل الاختبارات
  // 2️⃣ استخدم `npm run test:e2e` لتشغيل الاختبارات
  // 3️⃣ لتصحيح الأخطاء: `npx playwright test --debug`
});