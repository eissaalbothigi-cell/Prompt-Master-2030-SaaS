'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type PromptDetailPageProps = {
  params: { locale: string; id: string };
};

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { locale, id } = params;
  const router = useRouter();
  const t = useTranslations('PromptsPage');

  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب البيانات
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error('فشل الجلب');
        const data = await res.json();
        setPrompt(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا البرومبت؟')) return;
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push(`/${locale}/dashboard/prompts`);
      } else {
        alert('فشل الحذف');
      }
    } catch {
      alert('حدث خطأ');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المشاركة!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
      </div>
    );
  }

  if (error || !prompt) {
    return <div className="p-6 text-red-600">{error || 'البرومبت غير موجود'}</div>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href={`/${locale}/dashboard/prompts`}>
          <Button variant="ghost" className="mb-4">← {t('back') || 'رجوع إلى المكتبة'}</Button>
        </Link>

        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {prompt.title || 'بدون عنوان'}
          </h1>
          <span className={`text-xs px-3 py-1 rounded-full ${prompt.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
            {prompt.status === 'published' ? (t('published') || 'منشور') : (t('draft') || 'مسودة')}
          </span>
        </div>

        <Separator />

        <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('content') || 'محتوى البرومبت'}</h3>
          <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{prompt.content || 'لا يوجد محتوى'}</pre>
        </div>

        {prompt.description && (
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t('description') || 'الوصف'}</h3>
            <p className="text-slate-700 dark:text-slate-300">{prompt.description}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <span>👁️ {prompt.views || 0} {t('views') || 'مشاهدة'}</span>
          <span>❤️ {prompt.likes || 0} {t('likes') || 'إعجاب'}</span>
          <span>📅 {new Date(prompt.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
        </div>

        {/* ===== الأزرار المحدثة ===== */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href={`/${locale}/dashboard/prompts/${id}/edit`}>
            <Button variant="outline">✏️ {t('edit') || 'تعديل'}</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>🗑️ {t('delete') || 'حذف'}</Button>
          <Button variant="default" onClick={() => navigator.clipboard.writeText(prompt.content || '')}>
            📋 {t('copy') || 'نسخ'}
          </Button>
          <Button variant="secondary" onClick={handleShare}>🔗 {t('share') || 'مشاركة'}</Button>
        </div>
      </div>
    </div>
  );
}