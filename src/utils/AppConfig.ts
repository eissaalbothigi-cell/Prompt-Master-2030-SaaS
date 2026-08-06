import type { LocalizationResource } from '@clerk/shared/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '@/types/I18n';
import { enUS, arSA } from '@clerk/localizations';

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
] satisfies AppLocale[];

// ============================================================
// 🏷️ 2. الهوية الأساسية للمنصة (يجب تعديلها حسب احتياجاتك)
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

  /** معلومات الاتصال (يمكن تعديلها) */
  email: {
    support: 'support@promptmaster2030.com',
  },
} as const;

// ============================================================
// 🔐 3. ترجمات Clerk (لتوحيد واجهة المصادقة)
// ============================================================

/** ترجمات Clerk المدعومة */
const supportedLocales: Record<string, LocalizationResource> = {
  ar: arSA,
  en: enUS,
};

/** التصدير الافتراضي لترجمات Clerk */
export const ClerkLocalizations = {
  defaultLocale: enUS, // اللغة الاحتياطية في حال عدم وجود ترجمة
  supportedLocales,
};

/** قائمة بجميع رموز اللغات (للاستخدام في حلقات التكرار) */
export const AllLocales = AppConfig.i18n.locales.map(locale => locale.id);