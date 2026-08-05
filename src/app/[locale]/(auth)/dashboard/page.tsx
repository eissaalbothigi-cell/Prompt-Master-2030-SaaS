import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/libs/DB';
import { prompts, users } from '@/models/Schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { getI18nPath } from '@/utils/Helpers';

// ============================================================
// 🔥 1. إعدادات SEO والبيانات الوصفية
// ============================================================
type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: DashboardPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `/${locale}/dashboard`,
      siteName: 'Prompt Master 2030',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}/dashboard`,
    },
  };
}

// ============================================================
// 📊 2. صفحة لوحة التحكم الرئيسية
// ============================================================
export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: DashboardPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // ============================================================
  // 📈 2.1 جلب الإحصائيات من قاعدة البيانات
  // ============================================================
  try {
    const [totalUsers, totalPrompts] = await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(prompts),
    ]);

    const userCount = totalUsers[0]?.value ?? 0;
    const promptCount = totalPrompts[0]?.value ?? 0;

    // ============================================================
    // 🎨 2.2 عرض الواجهة
    // ============================================================
    return (
      <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* ============================================================
              🏷️ 2.2.1 الهوية البصرية (الهيدر)
              ============================================================ */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {t('welcome')}
              </p>
            </div>
            <Link
              href={getI18nPath('/dashboard/prompts/new', locale)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <span>➕</span>
              {locale === 'ar' ? 'إنشاء برومبت جديد' : 'Create New Prompt'}
            </Link>
          </div>

          {/* ============================================================
              📊 2.2.2 بطاقات الإحصائيات
              ============================================================ */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 🔢 بطاقة إجمالي المستخدمين */}
            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? '👥 إجمالي المستخدمين' : '👥 Total Users'}
                </h3>
                <span className="text-2xl opacity-50">👤</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {userCount.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'منذ إطلاق المنصة' : 'Since platform launch'}
              </p>
            </div>

            {/* 🔢 بطاقة إجمالي البرومبتات */}
            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? '📝 إجمالي البرومبتات' : '📝 Total Prompts'}
                </h3>
                <span className="text-2xl opacity-50">📄</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {promptCount.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'قوالب ذكاء اصطناعي' : 'AI templates'}
              </p>
            </div>

            {/* 🔢 بطاقة نشاط اليوم (مثال) */}
            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? '⚡ نشاط اليوم' : '⚡ Today\'s Activity'}
                </h3>
                <span className="text-2xl opacity-50">📈</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {locale === 'ar' ? 'جديد' : 'New'}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'آخر 24 ساعة' : 'Last 24 hours'}
              </p>
            </div>
          </div>

          {/* ============================================================
              🚀 2.2.3 روابط سريعة للميزات الرئيسية
              ============================================================ */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href={getI18nPath('/dashboard/user-profile', locale)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80"
            >
              <span className="text-3xl">👤</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'الملف الشخصي' : 'User Profile'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'إدارة إعدادات حسابك' : 'Manage your account settings'}
                </p>
              </div>
              <span className="ml-auto text-xl opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </Link>

            <Link
              href={getI18nPath('/dashboard/organization-profile', locale)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80"
            >
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'المنظمة' : 'Organization'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'إدارة فريقك والأعضاء' : 'Manage your team and members'}
                </p>
              </div>
              <span className="ml-auto text-xl opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </Link>

            <Link
              href={getI18nPath('/dashboard/prompts', locale)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80"
            >
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'مكتبة البرومبتات' : 'Prompt Library'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'استعراض وإدارة القوالب' : 'Browse and manage templates'}
                </p>
              </div>
              <span className="ml-auto text-xl opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // ============================================================
    // ❌ 2.3 معالجة الأخطاء (عند فشل جلب البيانات)
    // ============================================================
    console.error('Dashboard error:', error);
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            {locale === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {locale === 'ar' ? 'لم نتمكن من تحميل بيانات لوحة التحكم' : 'Could not load dashboard data'}
          </p>
          <Link
            href={getI18nPath('/', locale)}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }
}