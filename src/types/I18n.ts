import type { routing } from '@/libs/I18nRouting';
import type messages from '@/messages/ar.json';

// ============================================================
// 🌍 I18n Types - Prompt Master 2030
// ============================================================
// This file defines types for internationalization (i18n).
// It extends the next-intl module and provides utilities for working with locales.
// ============================================================

// ============================================================
// 1️⃣ Extend next-intl (توسيع الأنواع)
// ============================================================

declare module 'next-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface AppConfig {
    /** اللغة المدعومة (من routing) */
    Locale: (typeof routing.locales)[number];
    /** رسائل الترجمة (من ملفات JSON) */
    Messages: typeof messages;
  }
}

// ============================================================
// 2️⃣ Types (أنواع أساسية)
// ============================================================

/** معرف اللغة (مثل 'ar', 'en', 'fr') */
export type LocaleCode = (typeof routing.locales)[number];

/** اللغة المدعومة (كائن يحتوي على id و name) */
export type AppLocale = {
  /** معرف اللغة (مثل 'ar', 'en') */
  id: LocaleCode;
  /** اسم اللغة المعروض (مثل 'العربية', 'English') */
  name: string;
};

/** خريطة اللغات (Locale -> AppLocale) */
export type LocaleMap = Record<LocaleCode, AppLocale>;

/** مفتاح الترجمة (من ملفات JSON) */
export type TranslationKey = keyof typeof messages;

/** خريطة الرسائل (Locale -> Messages) */
export type MessageMap = Record<LocaleCode, typeof messages>;

// ============================================================
// 3️⃣ Helpers (دوال مساعدة)
// ============================================================

/**
 * قائمة اللغات المدعومة
 */
export const SUPPORTED_LOCALES: LocaleCode[] = ['ar', 'en', 'fr'] as const;

/**
 * اللغة الافتراضية
 */
export const DEFAULT_LOCALE: LocaleCode = 'ar';

/**
 * خريطة اللغات مع أسمائها
 */
export const LOCALE_MAP: LocaleMap = {
  ar: { id: 'ar', name: 'العربية' },
  en: { id: 'en', name: 'English' },
  fr: { id: 'fr', name: 'Français' },
} as const;

/**
 * الحصول على اسم اللغة من المعرف
 * @param locale - معرف اللغة (مثل 'ar')
 * @returns اسم اللغة (مثل 'العربية') أو المعرف نفسه إذا لم يتم العثور عليه
 */
export const getLocaleName = (locale: LocaleCode): string => {
  return LOCALE_MAP[locale]?.name || locale;
};

/**
 * الحصول على كائن اللغة من المعرف
 * @param locale - معرف اللغة (مثل 'ar')
 * @returns كائن اللغة أو `undefined`
 */
export const getLocaleById = (locale: LocaleCode): AppLocale | undefined => {
  return LOCALE_MAP[locale];
};

/**
 * الحصول على اللغة الافتراضية
 * @returns معرف اللغة الافتراضية
 */
export const getDefaultLocale = (): LocaleCode => {
  return DEFAULT_LOCALE;
};

/**
 * التحقق مما إذا كانت اللغة مدعومة
 * @param locale - معرف اللغة (مثل 'ar')
 * @returns `true` إذا كانت اللغة مدعومة
 */
export const isLocaleSupported = (locale: string): boolean => {
  return SUPPORTED_LOCALES.includes(locale as LocaleCode);
};

/**
 * الحصول على قائمة اللغات المدعومة
 * @returns قائمة معرفات اللغات
 */
export const getSupportedLocales = (): LocaleCode[] => {
  return [...SUPPORTED_LOCALES];
};

/**
 * الحصول على قائمة اللغات مع أسمائها (للاستخدام في القوائم المنسدلة)
 * @returns قائمة كائنات اللغة
 */
export const getLocaleOptions = (): AppLocale[] => {
  return SUPPORTED_LOCALES.map((locale) => LOCALE_MAP[locale]);
};

// ============================================================
// 4️⃣ Types (أنواع متقدمة)
// ============================================================

/**
 * نوع رسائل الترجمة (يُستخدم في المكونات)
 */
export type TranslationMessages = typeof messages;

/**
 * نوع وظيفة الترجمة (للـ `t` من `useTranslations`)
 */
export type TranslationFunction = (key: TranslationKey) => string;

// ============================================================
// 🧪 أمثلة (Examples)
// ============================================================
/*
// استخدام الدوال المساعدة
const localeName = getLocaleName('ar'); // 'العربية'
const isSupported = isLocaleSupported('fr'); // true
const options = getLocaleOptions(); // [{ id: 'ar', name: 'العربية' }, ...]

// استخدام الأنواع
function greeting(locale: LocaleCode): string {
  return locale === 'ar' ? 'مرحباً' : 'Hello';
}
*/