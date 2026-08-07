import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

// ============================================================
// 🧪 Vitest Configuration - Prompt Master 2030
// ============================================================
// This file configures Vitest for unit and UI testing.
// It supports both Node.js and browser environments (Playwright).

// ============================================================
// 1️⃣ Base Configuration (الإعدادات الأساسية)
// ============================================================

export default defineConfig({
  // ⚛️ دعم React (JSX, Hooks)
  plugins: [react()],

  // 📂 دعم مسارات TypeScript (مثل @/*)
  resolve: {
    tsconfigPaths: true,
  },

  // ============================================================
  // 2️⃣ Test Configuration (إعدادات الاختبارات)
  // ============================================================

  test: {
    // 📊 إعدادات تغطية الكود (Code Coverage)
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/*.e2e.{ts,tsx}',
        'src/**/*.integ.{ts,tsx}',
        'src/components/ui/**/*', // Shadcn/ui
        'src/libs/**/*', // مكتبات نظامية
        'src/types/**/*', // أنواع
        'src/utils/**/*', // دوال مساعدة (قد تكون مغطاة بشكل كاف)
      ],
      // ✅ تقرير التغطية في HTML و JSON
      reporter: ['text', 'json', 'html'],
    },

    // ============================================================
    // 📁 Projects (مشاريع اختبار منفصلة)
    // ============================================================

    projects: [
      // 🖥️ Unit Tests (اختبارات الوحدات - Node.js)
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{js,ts}'],
          exclude: [
            'src/hooks/**/*.test.ts',
            'src/**/*.ui.test.tsx',
          ],
          environment: 'node',
        },
      },

      // 🖥️ UI Tests (اختبارات واجهة المستخدم - Browser)
      {
        extends: true,
        test: {
          name: 'ui',
          include: [
            '**/*.test.tsx',
            'src/hooks/**/*.test.ts',
            'src/**/*.ui.test.tsx',
          ],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotDirectory: 'vitest-test-results',
            instances: [
              { browser: 'chromium' },
              // { browser: 'firefox' }, // اختياري
              // { browser: 'webkit' }, // اختياري (Safari)
            ],
          },
        },
      },
    ],

    // ============================================================
    // 🛠️ General Settings (إعدادات عامة)
    // ============================================================

    // ✅ تفعيل المتغيرات العالمية (مثل `describe`, `it`, `expect`)
    globals: true,

    // 📂 ملفات الإعداد المسبق (Setup Files)
    setupFiles: ['./vitest.setup.ts'],

    // ⏱️ مهلة الاختبارات (30 ثانية)
    testTimeout: 30_000,

    // 📊 التقارير (Reports)
    reporters: [
      'default',
      // في CI: استخدام تقرير GitHub Actions
      ...(process.env.CI ? ['github-actions'] : []),
    ],

    // 🌍 متغيرات البيئة (Environment Variables)
    env: {
      // ✅ كشف متغيرات البيئة المحددة فقط
      ...loadEnv('', process.cwd(), 'NEXT_PUBLIC_'),
      NODE_ENV: process.env.NODE_ENV || 'test',
    },
  },

  // ============================================================
  // 3️⃣ Define (تعريف المتغيرات العالمية)
  // ============================================================

  define: {
    // ✅ كشف المتغيرات المطلوبة فقط للمتصفح
    'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    ),
    'process.env.NEXT_PUBLIC_APP_NAME': JSON.stringify(
      process.env.NEXT_PUBLIC_APP_NAME || 'Prompt Master 2030',
    ),
  },

  // ============================================================
  // 🚀 Server Configuration (خادم التطوير)
  // ============================================================

  server: {
    // ✅ منع فتح المتصفح تلقائياً
    open: false,
  },
});