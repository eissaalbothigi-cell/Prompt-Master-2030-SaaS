import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './libs/I18nRouting';
import { verifyToken } from './libs/Auth';

// ============================================================
// 🌐 1. تدويل (i18n) - next-intl
// ============================================================
const handleI18nRouting = createMiddleware(routing);

// ============================================================
// 🛡️ 2. تحديد المسارات المحمية والعامة
// ============================================================

/**
 * المسارات التي تتطلب مصادقة (تسجيل دخول)
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/:path*',
  '/onboarding',
  '/onboarding/:path*',
  '/user-profile',
  '/user-profile/:path*',
  '/organization-profile',
  '/organization-profile/:path*',
  '/generator',
  '/generator/:path*',
  '/prompts',
  '/prompts/:path*',
  '/settings',
  '/settings/:path*',
];

/**
 * المسارات العامة (لا تتطلب مصادقة)
 */
const PUBLIC_ROUTES = [
  '/sign-in',
  '/sign-in/:path*',
  '/sign-up',
  '/sign-up/:path*',
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/terms',
  '/privacy',
];

/**
 * التحقق مما إذا كان المسار محمياً
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => {
    const pattern = new RegExp(`^${route.replace(':path*', '.*')}$`);
    return pattern.test(pathname);
  });
}

/**
 * التحقق مما إذا كان المسار عاماً
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const pattern = new RegExp(`^${route.replace(':path*', '.*')}$`);
    return pattern.test(pathname);
  });
}

// ============================================================
// 🚀 3. Middleware الرئيسي
// ============================================================

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;

  // 🔤 استخراج اللغة من المسار (مثل `/ar/dashboard`)
  const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || 'ar';

  // 🔐 3.1 التحقق من المصادقة (بدلاً من Clerk)
  if (isProtectedRoute(pathname)) {
    // قراءة التوكن من الكوكيز
    const token = request.cookies.get('auth_token')?.value;

    // إذا لم يكن هناك توكن → إعادة التوجيه إلى تسجيل الدخول
    if (!token) {
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // التحقق من صحة التوكن
    const decoded = verifyToken(token);
    if (!decoded) {
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // ✅ التوكن صحيح، نسمح بالمرور
    // (يمكن إضافة بيانات المستخدم إلى الطلب إذا لزم الأمر)
  }

  // 🧭 3.2 إعادة التوجيه التلقائي من `/` إلى `/ar`
  if (pathname === '/') {
    const redirectUrl = new URL('/ar', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 🌍 3.3 التعامل مع التدويل (i18n)
  const response = handleI18nRouting(request);

  // ✅ إضافة رؤوس الأمان
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// ============================================================
// ⚙️ 4. إعدادات المطابقة (Matcher)
// ============================================================

export const config = {
  // 🎯 تطبيق الميدلوير على جميع المسارات باستثناء:
  // - _next, _vercel, monitoring (ملفات النظام)
  // - الملفات ذات الامتدادات (صور، CSS، JS)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};