import antfu from '@antfu/eslint-config';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import playwright from 'eslint-plugin-playwright';
import storybook from 'eslint-plugin-storybook';

// ============================================================
// 📝 ESLint Configuration - Prompt Master 2030
// ============================================================
// This file uses ESLint 9+ Flat Config format.
// It includes rules for React, Next.js, TypeScript, Tailwind, E2E, and Storybook.

export default antfu(
  {
    // ============================================================
    // 🧩 الأساسيات (React, Next.js, TypeScript)
    // ============================================================
    react: true,
    nextjs: true,
    typescript: true,

    // ⚙️ تفضيلات الإعدادات
    lessOpinionated: true,
    isInEditor: false,

    // 🎨 إعدادات الأسلوب (Style)
    stylistic: {
      semi: true,
      quotes: 'single',
      indent: 2,
    },

    // 🖌️ إعدادات التنسيق (Formatters)
    formatters: {
      css: true, // تنسيق ملفات CSS عبر Prettier
    },

    // 📁 المسارات المتجاهلة (Ignored Paths)
    ignores: [
      // 🏗️ مخرجات البناء
      '.next/**/*',
      'out/**/*',
      'dist/**/*',
      'build/**/*',

      // 🗄️ قاعدة البيانات
      'drizzle/migrations/**/*',
      'drizzle/meta/**/*',

      // 📦 التبعيات
      'node_modules/**/*',

      // 🧪 الاختبارات
      'coverage/**/*',
      'vitest-test-results/**/*',
      'playwright-report/**/*',
      'test-results/**/*',

      // 📂 مجلدات النظام
      '.vercel/**/*',
      '.git/**/*',

      // 🛠️ أدوات مساعدة
      '.alchemy/**/*',
      '.claude/**/*',
      '.cursor/**/*',
    ],
  },

  // ============================================================
  // 🎨 Tailwind CSS Rules
  // ============================================================
  eslintPluginBetterTailwindcss.configs.recommended,
  {
    settings: {
      'better-tailwindcss': {
        // مسار ملف Tailwind الرئيسي
        entryPoint: 'src/styles/global.css',
      },
    },
  },

  // ============================================================
  // 🧪 E2E Testing Rules (Playwright)
  // ============================================================
  {
    files: ['**/*.integ.ts', '**/*.e2e.ts', '**/tests/e2e/**/*.ts'],
    ...playwright.configs['flat/recommended'],
  },

  // ============================================================
  // 📚 Storybook Rules
  // ============================================================
  ...storybook.configs['flat/recommended'],

  // ============================================================
  // ⚙️ Custom Rule Overrides (تجاوز القواعد)
  // ============================================================
  {
    rules: {
      // 🔧 السماح بـ await في المستوى الأعلى
      'antfu/no-top-level-await': 'off',

      // 🎨 أسلوب الأقواس
      'style/brace-style': ['error', '1tbs'],

      // 📝 استخدام `type` بدلاً من `interface`
      'ts/consistent-type-definitions': ['error', 'type'],

      // ⚛️ React
      'react/purity': 'off',
      'react/prefer-destructuring-assignment': 'off',
      'react/exhaustive-deps': 'off',

      // 🖥️ Node.js
      'node/prefer-global/process': 'off',

      // 🧪 اختبارات
      'test/padding-around-all': 'error',
      'test/prefer-lowercase-title': 'off',

      // 📚 JSDoc (اختياري)
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-returns': 'off',

      // 🚫 قواعد مخففة لتجنب تعطل البناء
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'import/no-unresolved': 'off', // يعتمد على TypeScript
    },
  },
);