import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '@/types/I18n';

// ============================================================
// 🌍 1. إعدادات التدويل (i18n)
// ============================================================

/** استراتيجية بادئة المسار: "as-needed" تعني أن المسارات ستكون بدون بادئة للغة الافتراضية. */
const localePrefix: LocalePrefixMode = 'as-needed';

/** قائمة اللغات المدعومة في المنصة */
const locales = [
  {
    id: 'ar',
    name: 'العربية',
  },
  {
    id: 'en',
    name: 'English',
  },
  // يمكن إضافة لغات أخرى مستقبلاً:
  // {
  //   id: 'fr',
  //   name: 'Français',
  // },
] satisfies AppLocale[];

// ============================================================
// 🏷️ 2. الهوية الأساسية للمنصة
// ============================================================

/** التكوين المركزي للتطبيق */
export const AppConfig = {
  /** اسم المنصة (يظهر في العناوين ووسائل التواصل) */
  name: 'Prompt Master 2030',

  /** إعدادات التدويل */
  i18n: {
    locales,
    /** اللغة الافتراضية (العربية) */
    defaultLocale: 'ar',
    localePrefix,
  },

  /** معلومات الاتصال */
  email: {
    support: 'support@promptmaster2030.com',
    sales: 'sales@promptmaster2030.com',
  },

  /** روابط وسائل التواصل الاجتماعي (اختياري) */
  social: {
    github: 'https://github.com/eissaalbothigi-cell/Prompt-Master-2030-SaaS',
    twitter: 'https://twitter.com/promptmaster2030',
    linkedin: 'https://linkedin.com/company/promptmaster2030',
  },

  /** إعدادات المدونة (اختياري) */
  blog: {
    enabled: true,
    postsPerPage: 10,
  },
} as const;

// ============================================================
// 📌 3. دوال مساعدة (Helper Functions)
// ============================================================

/** قائمة بجميع رموز اللغات (للاستخدام في حلقات التكرار) */
export const AllLocales = AppConfig.i18n.locales.map(locale => locale.id);

/** التحقق مما إذا كانت اللغة مدعومة */
export function isLocaleSupported(locale: string): boolean {
  return AllLocales.includes(locale);
}

/** الحصول على اللغة الافتراضية */
export function getDefaultLocale(): string {
  return AppConfig.i18n.defaultLocale;
}

// ============================================================
// ❌ تم إزالة Clerk بالكامل
// ============================================================
// تم حذف:
// - ClerkLocalizations
// - supportedLocales
// - arSA, enUS من Clerk
// لأننا نستخدم نظام مصادقة داخلي (In-House)