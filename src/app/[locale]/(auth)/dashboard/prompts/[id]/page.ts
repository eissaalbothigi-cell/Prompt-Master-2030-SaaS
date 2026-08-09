import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/libs/DB';
import { prompts } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/libs/Auth';
import { redirect } from 'next/navigation';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type PromptDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function PromptDetailPage(props: PromptDetailPageProps) {
  const { locale, id } = await props.params;
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

  // 2. جلب البرومبت المطلوب
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, id))
    .limit(1);

  // 3. التحقق من الصلاحية (يجب أن يكون المؤلف هو المستخدم الحالي)
  if (!prompt || prompt.authorId !== decoded.userId) {
    redirect(getI18nPath('/dashboard/prompts', locale));
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* زر العودة */}
        <Link href={getI18nPath('/dashboard/prompts', locale)}>
          <Button variant="ghost" className="mb-4">
            ← {t('back') || 'رجوع إلى المكتبة'}
          </Button>
        </Link>

        {/* العنوان والحالة */}
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {prompt.title || 'بدون عنوان'}
          </h1>
          <span className={`text-xs px-3 py-1 rounded-full ${
            prompt.status === 'published' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {prompt.status === 'published' ? (t('published') || 'منشور') : (t('draft') || 'مسودة')}
          </span>
        </div>

        <Separator />

        {/* المحتوى */}
        <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t('content') || 'محتوى البرومبت'}
          </h3>
          <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {prompt.content || 'لا يوجد محتوى'}
          </pre>
        </div>

        {/* الوصف (إن وجد) */}
        {prompt.description && (
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t('description') || 'الوصف'}
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              {prompt.description}
            </p>
          </div>
        )}

        {/* الإحصائيات */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <span>👁️ {prompt.views || 0} {t('views') || 'مشاهدة'}</span>
          <span>❤️ {prompt.likes || 0} {t('likes') || 'إعجاب'}</span>
          <span>📅 {new Date(prompt.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href={getI18nPath(`/dashboard/prompts/${prompt.id}/edit`, locale)}>
            <Button variant="outline">✏️ {t('edit') || 'تعديل'}</Button>
          </Link>
          <Button variant="destructive">🗑️ {t('delete') || 'حذف'}</Button>
          <Button 
            variant="default" 
            onClick={() => navigator.clipboard.writeText(prompt.content || '')}
          >
            📋 {t('copy') || 'نسخ'}
          </Button>
        </div>
      </div>
    </div>
  );
}