import type { KnipConfig } from 'knip';

// ============================================================
// 🔍 Knip Configuration - Prompt Master 2030
// ============================================================
// Knip is a tool for finding unused files, dependencies, and exports.
// This configuration tells Knip what to ignore and where to look.

const config: KnipConfig = {
  // ============================================================
  // 📁 Files to ignore (ملفات يتم تجاهلها من التحليل)
  // ============================================================
  ignore: [
    // 🧪 Checkly (مراقبة المواقع)
    'checkly.config.ts',

    // 🗄️ قاعدة البيانات والهجرات
    'drizzle/**/*',
    'drizzle.config.ts',

    // 🧩 مكونات Shadcn/ui (مستوردة من مكتبة خارجية)
    'src/components/ui/*',

    // 🗑️ مجلدات تم حذفها أو إعادة هيكلتها
    'src/features/**/*', // ✅ تم حذفها سابقاً
    'src/app/api/**/*', // ✅ APIs لا تحتاج تحليل استخدام

    // 🛠️ أدوات مساعدة (لا تحتاج تحليل)
    'src/libs/DB.ts',
    'src/libs/I18n.ts',
    'src/libs/Logger.ts',
    'src/types/Auth.ts',
    'src/utils/DBConnection.ts',

    // 🔐 نظام المصادقة (ملفات نظامية)
    'src/libs/Auth.ts', // ✅ دوال نظامية
    'src/middleware.ts', // ✅ إن وجد

    // 🧪 اختبارات
    'tests/**/*',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/*.e2e.ts',
    '**/*.integ.ts',

    // 📚 Storybook
    '.storybook/**/*',
    '**/*.stories.tsx',
    '**/*.stories.jsx',

    // 🔧 ملفات الإعدادات (Config)
    '*.config.ts',
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs',
    '*.config.json',

    // 🏗️ مخرجات البناء
    '.next/**/*',
    'out/**/*',
    'dist/**/*',
    'build/**/*',
    'storybook-static/**/*',
    'coverage/**/*',
    'vitest-test-results/**/*',
    'playwright-report/**/*',
    'test-results/**/*',

    // 📂 مجلدات النظام
    '.vercel/**/*',
    '.git/**/*',
    'node_modules/**/*',
  ],

  // ============================================================
  // 📦 Dependencies to ignore (تبعيات يتم تجاهلها)
  // ============================================================
  ignoreDependencies: [
    // ❌ تمت إزالتها نهائياً (Clerk)
    // '@clerk/shared',

    // ❌ تمت إزالتها نهائياً (LogTape)
    // '@logtape/logtape',

    // ✅ تجنب خطأ CI
    '@swc/helpers',

    // ✅ أدوات تطوير (لا تؤثر على الإنتاج)
    'eslint',
    'typescript',
    'tailwindcss',
    'postcss',
    'autoprefixer',
    'drizzle-kit',
    'vitest',
    'playwright',
    'storybook',
  ],

  // ============================================================
  // 🧪 Playwright tests (اختبارات E2E)
  // ============================================================
  playwright: {
    entry: ['tests/**/*.@(integ|e2e).ts', 'tests/e2e/**/*.ts'],
  },

  // ============================================================
  // 🖥️ Binaries to ignore (ثنائيات يتم تجاهلها)
  // ============================================================
  ignoreBinaries: [
    'production', // False positive raised with dotenv-cli
    'next', // Next.js CLI
    'node', // Node.js CLI
    'npm', // NPM CLI
  ],

  // ============================================================
  // 🛠️ Compilers (مترجمات مخصصة)
  // ============================================================
  compilers: {
    // استخراج @import من ملفات CSS لتحليل أفضل
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },

  // ============================================================
  // ⚙️ إعدادات إضافية
  // ============================================================
  treatConfigHintsAsErrors: true,

  // 🚀 تجنب تحليل الملفات غير الضرورية (تحسين الأداء)
  project: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'tests/**/*.ts',
    'tests/**/*.tsx',
  ],

  // 🎯 تحليل الأداء (Performance)
  performance: {
    // تجاهل الملفات الكبيرة
    ignore: ['**/*.d.ts', '**/*.map'],
  },
};

export default config;