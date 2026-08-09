import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/libs/DB';
import { prompts, users } from '@/models/Schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { getI18nPath } from '@/utils/Helpers';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cookies } from 'next/headers';
import { verifyToken } from '@/libs/Auth';
import { redirect } from 'next/navigation';

type PromptsPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

export default async function PromptsPage(props: PromptsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'PromptsPage' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // 1. التحقق من المصادقة
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    redirect(getI18nPath('/auth/signin', locale));
  }
  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    redirect(getI18nPath('/auth/signin', locale));
  }

  // 2. جلب البرومبتات الخاصة بالمستخدم
  const userPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.authorId, decoded.userId))
    .orderBy(desc(prompts.createdAt));

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* الهيدر */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📚 {t('title') || 'مكتبة البرومبتات'}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {t('subtitle') || 'جميع البرومبتات التي أنشأتها'}
            </p>
          </div>
          <Link href={getI18nPath('/dashboard/generator', locale)}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              ➕ {t('new_prompt') || 'برومبت جديد'}
            </Button>
          </Link>
        </div>

        <Separator />

        {/* عرض البرومبتات */}
        {userPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/50 bg-white/80 p-12 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
            <p className="text-xl text-slate-500 dark:text-slate-400">
              {t('no_prompts') || 'لم تقم بإنشاء أي برومبت بعد'}
            </p>
            <Link href={getI18nPath('/dashboard/generator', locale)} className="mt-4">
              <Button variant="outline">
                {t('go_generate') || 'اذهب لإنشاء أول برومبت 🚀'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {prompt.title || 'بدون عنوان'}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    prompt.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {prompt.status === 'published' ? (t('published') || 'منشور') : (t('draft') || 'مسودة')}
                  </span>
                </div>
                
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {prompt.content?.slice(0, 150) || 'لا يوجد محتوى'}
                </p>
                
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>👁️ {prompt.views || 0}</span>
                  <span>❤️ {prompt.likes || 0}</span>
                  <span>{new Date(prompt.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={getI18nPath(`/dashboard/prompts/${prompt.id}`, locale)}>
                    <Button size="sm" variant="outline">{t('view') || 'عرض'}</Button>
                  </Link>
                  <Link href={getI18nPath(`/dashboard/prompts/${prompt.id}/edit`, locale)}>
                    <Button size="sm" variant="ghost">{t('edit') || 'تعديل'}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}