'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROMPT_FRAMEWORKS, QUICK_TEMPLATES } from '@/libs/templates';

export default function GeneratorPage() {
  const t = useTranslations('GeneratorPage');
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('الرجاء إدخال وصف للبرومبت');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedPrompt('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء التوليد');
        setLoading(false);
        return;
      }

      if (data.output) {
        setGeneratedPrompt(data.output);
      } else {
        setError(data.error || 'فشل توليد البرومبت');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPrompt) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: description.slice(0, 100) || 'برومبت جديد',
          description: description,
          content: generatedPrompt,
          status: 'published',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل الحفظ');
        setSaving(false);
        return;
      }

      setSuccess('✅ تم حفظ البرومبت في مكتبتك بنجاح!');
      setDescription('');
      setGeneratedPrompt('');
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setSuccess('✅ تم نسخ البرومبت إلى الحافظة!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const loadTemplate = (template: string) => {
    setDescription(template);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧠 مولد البرومبتات الذكي
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          أدخل وصفاً للبرومبت الذي تريده، وسيقوم الذكاء الاصطناعي بتوليده لك.
        </p>

        {/* القوالب السريعة */}
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_TEMPLATES.slice(0, 5).map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.prompt.replace(/{[^}]+}/g, '...'))}
              className="rounded-full bg-slate-200/70 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {template.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* الجانب الأيسر: الإدخال */}
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">📝 وصف البرومبت</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: اكتب برومبت لمساعدتي في كتابة تغريدة تسويقية عن الذكاء الاصطناعي..."
              rows={8}
              className="mt-4 w-full rounded-lg border border-slate-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? '⏳ جاري التوليد...' : '🚀 توليد البرومبت'}
              </button>
              <button
                onClick={() => setDescription('')}
                className="rounded-lg bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                مسح
              </button>
            </div>
            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">❌ {error}</p>}
            {success && <p className="mt-4 text-sm text-green-600 dark:text-green-400">{success}</p>}
          </div>

          {/* الجانب الأيمن: النتيجة */}
          <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">🎯 البرومبت المُولّد</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!generatedPrompt}
                  className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  📋 نسخ
                </button>
                <button
                  onClick={handleSave}
                  disabled={!generatedPrompt || saving}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? '⏳' : '💾 حفظ'}
                </button>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="min-h-[200px] rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              {generatedPrompt ? (
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {generatedPrompt}
                </pre>
              ) : (
                <p className="text-slate-400 dark:text-slate-500">
                  انتظر حتى يتم توليد البرومبت...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}