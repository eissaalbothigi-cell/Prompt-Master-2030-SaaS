'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

type EditPromptPageProps = {
  params: { locale: string; id: string };
};

export default function EditPromptPage({ params }: EditPromptPageProps) {
  const { locale, id } = params;
  const router = useRouter();
  const t = useTranslations('PromptsPage');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب بيانات البرومبت عند تحميل الصفحة
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) throw new Error('فشل جلب البيانات');
        const data = await res.json();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setContent(data.content || '');
        setStatus(data.status || 'draft');
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, content, status }),
      });

      if (!res.ok) throw new Error('فشل التحديث');
      
      setSuccess('✅ تم تحديث البرومبت بنجاح!');
      setTimeout(() => {
        router.push(`/${locale}/dashboard/prompts/${id}`);
      }, 1500);
    } catch (err) {
      setError('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* زر العودة */}
        <Link href={`/${locale}/dashboard/prompts/${id}`}>
          <Button variant="ghost" className="mb-4">
            ← {t('back') || 'رجوع إلى التفاصيل'}
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✏️ {t('edit_prompt') || 'تعديل البرومبت'}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {t('edit_subtitle') || 'قم بتحديث محتوى البرومبت وإعداداته'}
          </p>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t('title') || 'العنوان'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder={t('title_placeholder') || 'أدخل عنواناً للبرومبت'}
              required
            />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t('description') || 'الوصف'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder={t('description_placeholder') || 'وصف مختصر للبرومبت (اختياري)'}
            />
          </div>

          {/* المحتوى */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t('content') || 'محتوى البرومبت'}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder={t('content_placeholder') || 'أدخل محتوى البرومبت هنا...'}
              required
            />
          </div>

          {/* الحالة */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t('status') || 'الحالة'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="draft">{t('draft') || 'مسودة'}</option>
              <option value="published">{t('published') || 'منشور'}</option>
              <option value="archived">{t('archived') || 'مؤرشف'}</option>
            </select>
          </div>

          {/* رسائل النجاح والخطأ */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {success}
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {saving ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
            </Button>
            <Link href={`/${locale}/dashboard/prompts/${id}`}>
              <Button variant="outline" type="button">
                {t('cancel') || 'إلغاء'}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}