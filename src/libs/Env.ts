import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

// ============================================================
// 🔥 1. تعريف مخطط المتغيرات (Schema) - "قانون المنصة"
// ============================================================

export const Env = createEnv({
  /**
   * متغيرات الخادم (Server Variables):
   * - لا يمكن للمتصفح رؤيتها.
   * - تُستخدم في API Routes, Server Components, وأدوات Drizzle.
   */
  server: {
    // 🔐 المصادقة (Clerk)
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY مطلوب'),

    // 🗄️ قاعدة البيانات (Neon / PostgreSQL)
    DATABASE_URL: z.string().min(1, 'DATABASE_URL مطلوب'),

    // 🤖 الذكاء الاصطناعي (OpenRouter)
    OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY مطلوب'),
  },

  /**
   * متغيرات العميل (Client Variables):
   * - تبدأ بـ NEXT_PUBLIC_ وتُرسل إلى المتصفح.
   * - تُستخدم في واجهة المستخدم (مثل روابط Clerk).
   */
  client: {
    // 🔗 رابط التطبيق (ضروري لـ Clerk و SEO)
    NEXT_PUBLIC_APP_URL: z.string().url('يجب أن يكون رابطاً صحيحاً').optional(),

    // 🔐 مفاتيح Clerk العامة
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'مفتاح Clerk العام مطلوب'),

    // 🧭 مسارات Clerk (تستخدمها مكونات Clerk في المتصفح)
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard'),
  },

  /**
   * المتغيرات المشتركة (Shared):
   * - بيئة التشغيل (تحدد سلوك Next.js).
   */
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).default('development'),
  },

  /**
   * الربط الفعلي مع process.env
   * - هذه هي القيم الحقيقية التي ستُقرأ من البيئة.
   * - تأكد من أن كل مفتاح موجود في هذه القائمة.
   */
  runtimeEnv: {
    // Server
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,

    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,

    // Shared
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * خيارات إضافية:
   * - تفعيل التحقق من صحة المتغيرات في بيئة الإنتاج حتى لو لم تكن موجودة (يمنع الأعطال المفاجئة).
   */
  emptyStringAsUndefined: true,
});