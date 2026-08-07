import type { UserConfig } from '@commitlint/types';

// ============================================================
// 📝 Commitlint Configuration - Prompt Master 2030
// ============================================================
// This file defines the rules for commit messages.
// It ensures consistency and readability across the project.

const Configuration: UserConfig = {
  // 📚 القاعدة الأساسية (Conventional Commits)
  extends: ['@commitlint/config-conventional'],

  // 🚫 تجاهل بعض الرسائل التلقائية (مثل Dependabot)
  ignores: [
    (message) =>
      message.startsWith('chore: bump') || // تحديثات Dependabot
      message.startsWith('Updating') || // تحديثات تلقائية
      message.startsWith('Merge') || // عمليات الدمج
      message.startsWith('Revert'), // عمليات التراجع
  ],

  // ============================================================
  // 📋 القواعد المخصصة (Custom Rules)
  // ============================================================
  rules: {
    // 1️⃣ نوع التغيير (Type)
    'type-enum': [
      2, // مستوى الخطأ: خطأ (2)
      'always', // دائماً
      [
        'feat', // ميزة جديدة
        'fix', // إصلاح خطأ
        'docs', // توثيق
        'style', // تنسيق (مسافات، فواصل)
        'refactor', // إعادة هيكلة (بدون تغيير في الوظيفة)
        'perf', // تحسين الأداء
        'test', // إضافة أو تعديل اختبارات
        'chore', // مهام روتينية (تحديث تبعيات، إلخ)
        'build', // تغييرات في نظام البناء
        'ci', // تغييرات في نظام CI
        'revert', // تراجع عن تغيير سابق
      ],
    ],

    // 2️⃣ حالة الموضوع (Subject Case)
    'subject-case': [
      2, // خطأ
      'always', // دائماً
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],

    // 3️⃣ الموضوع لا يمكن أن يكون فارغاً
    'subject-empty': [2, 'never'],

    // 4️⃣ النوع لا يمكن أن يكون فارغاً
    'type-empty': [2, 'never'],

    // 5️⃣ الحد الأقصى لطول الموضوع (72 حرفاً)
    'header-max-length': [2, 'always', 72],
  },

  // 📌 تحذير: تجاهل ملفات معينة عند التحقق (اختياري)
  // ignores: [(message) => message.includes('WIP')], // مثال: تجاهل رسائل "WIP"
};

export default Configuration;