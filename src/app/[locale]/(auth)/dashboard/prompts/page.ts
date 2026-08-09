import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/libs/DB';
import { prompts, users } from '@/models/Schema';
import { count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { getI18nPath } from '@/utils/Helpers';
import { cookies } from 'next/headers';
import { verifyToken } from '@/libs/Auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: DashboardPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // التحقق من المصادقة
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    redirect(getI18nPath('/auth/signin', locale));
  }
  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    redirect(getI18nPath('/auth/signin', locale));
  }

  try {
    // جلب الإحصائيات الحقيقية
    const [totalUsers, totalPrompts, userPrompts] = await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(prompts),
      db.select({ value: count() }).from(prompts).where(sql`${prompts.authorId} = ${decoded.userId}`),
    ]);

    const userCount = totalUsers[0]?.value ?? 0;
    const promptCount = totalPrompts[0]?.value ?? 0;
    const myPromptCount = userPrompts[0]?.value ?? 0;

    // جلب آخر 3 برومبتات للمستخدم
    const recentPrompts = await db
      .select()
      .from(prompts)
      .where(sql`${prompts.authorId} = ${decoded.userId}`)
      .orderBy(sql`${prompts.createdAt} DESC`)
      .limit(3);

    return (
      <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* الهيدر */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('title') || 'لوحة التحكم'}
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {t('welcome') || 'نظرة عامة على نشاطك في Prompt Master 2030'}
              </p>
            </div>
            <Link href={getI18nPath('/dashboard/generator', locale)}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                ➕ {t('new_prompt') || 'برومبت جديد'}
              </Button>
            </Link>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('total_users') || '👥 إجمالي المستخدمين'}
                </h3>
                <span className="text-2xl opacity-50">👤</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {userCount.toLocaleString()}
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('total_prompts') || '📝 إجمالي البرومبتات'}
                </h3>
                <span className="text-2xl opacity-50">📄</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {promptCount.toLocaleString()}
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('my_prompts') || '📋 برومبتاتي'}
                </h3>
                <span className="text-2xl opacity-50">📌</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-white">
                {myPromptCount.toLocaleString()}
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t('status') || '⚡ الحالة'}
                </h3>
                <span className="text-2xl opacity-50">📈</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold text-green-600 dark:text-green-400">
                ✅ {t('online') || 'متصل'}
              </p>
            </div>
          </div>

          <Separator />

          {/* آخر البرومبتات */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t('recent_prompts') || 'آخر البرومبتات'}
            </h2>
            <Link href={getI18nPath('/dashboard/prompts', locale)}>
              <Button variant="outline" size="sm">{t('view_all') || 'عرض الكل'}</Button>
            </Link>
          </div>

          {recentPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/50 bg-white/80 p-12 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
              <p className="text-slate-500 dark:text-slate-400">
                {t('no_prompts_yet') || 'لم تقم بإنشاء أي برومبت بعد'}
              </p>
              <Link href={getI18nPath('/dashboard/generator', locale)} className="mt-4">
                <Button variant="outline">
                  🚀 {t('create_first_prompt') || 'أنشئ أول برومبت لك'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-2xl border border-slate-200/50 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {prompt.title || 'بدون عنوان'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {prompt.content?.slice(0, 100) || 'لا يوجد محتوى'}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>👁️ {prompt.views || 0}</span>
                    <span>❤️ {prompt.likes || 0}</span>
                    <span>{new Date(prompt.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div dir={dir} className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            {t('error_title') || 'حدث خطأ ما'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t('error_message') || 'لم نتمكن من تحميل بيانات لوحة التحكم'}
          </p>
          <Link
            href={getI18nPath('/', locale)}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {t('back_home') || 'العودة للرئيسية'}
          </Link>
        </div>
      </div>
    );
  }
}