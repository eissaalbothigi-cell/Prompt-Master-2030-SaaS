import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Env } from '@/libs/Env';
import { routing } from '@/libs/I18nRouting';

// ============================================================
// 🧩 Utilities - Prompt Master 2030
// ============================================================
// This file contains helper functions used across the application.
// ============================================================

// ============================================================
// 1️⃣ Class Name Utilities (دمج الكلاسات)
// ============================================================

/**
 * دمج كلاسات CSS باستخدام clsx و tailwind-merge
 * @param inputs - قائمة الكلاسات (strings, objects, arrays)
 * @returns كلاسات CSS مدمجة ومرتبة
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// 2️⃣ Base URL Utilities (رابط التطبيق الأساسي)
// ============================================================

/**
 * الحصول على رابط التطبيق الأساسي (للبيئة المحلية أو الإنتاج)
 * @returns رابط التطبيق الأساسي
 */
export const getBaseUrl = () => {
  if (Env.NEXT_PUBLIC_APP_URL) {
    return Env.NEXT_PUBLIC_APP_URL;
  }

  return 'http://localhost:3000';
};

// ============================================================
// 3️⃣ I18n Path Utilities (مسارات التدويل)
// ============================================================

/**
 * بناء مسار متوافق مع اللغة المدعومة
 * @param url - المسار النسبي (يبدأ بـ `/`)
 * @param locale - معرف اللغة (مثل `ar`, `en`)
 * @returns المسار مع بادئة اللغة إذا كانت غير افتراضية
 * 
 * @example
 * getI18nPath('/dashboard', 'en') // '/en/dashboard'
 * getI18nPath('/dashboard', 'ar') // '/dashboard' (لأن العربية هي اللغة الافتراضية)
 */
export const getI18nPath = (url: string, locale: string) => {
  // ✅ التحقق من صحة المدخلات
  if (!url || typeof url !== 'string') {
    console.warn('⚠️ getI18nPath: invalid URL provided, returning "/"');
    return '/';
  }

  if (!locale || typeof locale !== 'string') {
    console.warn('⚠️ getI18nPath: invalid locale provided, returning URL as-is');
    return url;
  }

  // 🧹 تنظيف المسار
  let cleanUrl = url.trim();

  // إذا كان المسار فارغاً أو مجرد `/`
  if (cleanUrl === '' || cleanUrl === '/') {
    return locale === routing.defaultLocale ? '/' : `/${locale}`;
  }

  // ✅ استخراج أجزاء المسار (استعلامات و #)
  const [pathname, searchAndHash] = cleanUrl.split(/(?=\?|#)/);

  // ✅ إذا كانت اللغة هي اللغة الافتراضية، نعيد المسار كما هو
  if (locale === routing.defaultLocale) {
    return cleanUrl;
  }

  // ✅ إزالة أي بادئة لغة موجودة مسبقاً
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, (match, p1) => {
    return p1 === '/' ? '/' : '';
  });

  // ✅ بناء المسار الجديد مع بادئة اللغة
  const newPath = `/${locale}${pathWithoutLocale}`;

  // ✅ إعادة إضافة الاستعلامات و `#` إذا كانت موجودة
  return searchAndHash ? `${newPath}${searchAndHash}` : newPath;
};

// ============================================================
// 4️⃣ Locale Extraction (استخراج اللغة من المسار)
// ============================================================

/**
 * استخراج اللغة من المسار
 * @param pathname - المسار الكامل (مثل `/ar/dashboard`)
 * @returns اللغة المستخرجة أو `null` إذا لم يتم العثور عليها
 */
export const getLocaleFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : null;
};

/**
 * إزالة بادئة اللغة من المسار
 * @param pathname - المسار الكامل (مثل `/ar/dashboard`)
 * @returns المسار بدون بادئة اللغة (مثل `/dashboard`)
 */
export const removeLocaleFromPath = (pathname: string): string => {
  return pathname.replace(/^\/[a-z]{2}/, '');
};

// ============================================================
// 5️⃣ Path Validation (التحقق من صحة المسارات)
// ============================================================

/**
 * التحقق مما إذا كان المسار داخلياً (يبدأ بـ `/`)
 * @param path - المسار المراد التحقق منه
 * @returns `true` إذا كان المسار داخلياً
 */
export const isInternalPath = (path: string): boolean => {
  return path.startsWith('/') || path === '';
};

/**
 * التحقق مما إذا كان المسار رابطاً خارجياً (يبدأ بـ `http` أو `https`)
 * @param path - المسار المراد التحقق منه
 * @returns `true` إذا كان المسار خارجياً
 */
export const isExternalPath = (path: string): boolean => {
  return /^https?:\/\//.test(path);
};