import { defineConfig } from 'drizzle-kit';

// ============================================================
// 🗄️ Drizzle ORM Configuration - Prompt Master 2030
// ============================================================
// This file configures Drizzle Kit for generating and running migrations.
// It connects to your PostgreSQL database using DATABASE_URL from .env.

export default defineConfig({
  // 📂 مسار ملفات الهجرات (Migrations)
  out: './drizzle/migrations',

  // 📄 مسار ملف الـ Schema (تعريف الجداول)
  schema: './src/models/Schema.ts',

  // 🗄️ نوع قاعدة البيانات
  dialect: 'postgresql',

  // 🔐 بيانات الاتصال بقاعدة البيانات
  dbCredentials: {
    // قراءة الرابط من متغيرات البيئة
    url: process.env.DATABASE_URL ?? '',
  },

  // 🐞 إعدادات التصحيح
  verbose: true,   // عرض تفاصيل إضافية أثناء التشغيل
  strict: true,    // التحقق من صحة الهيكل بدقة

  // ⚙️ خيارات إضافية
  breakpoints: false, // منع أخطاء التصحيح غير الضرورية

  // 📌 جدول الهجرات في قاعدة البيانات (اختياري)
  // migrations: {
  //   table: 'drizzle_migrations',
  //   schema: 'public',
  // },
});

// ============================================================
// 📌 ملاحظات:
// 1. تأكد من وجود متغير DATABASE_URL في ملف .env
// 2. لتوليد هجرة جديدة: npm run db:generate
// 3. لتطبيق الهجرات: npm run db:migrate
// 4. لفتح Drizzle Studio: npm run db:studio
// ============================================================