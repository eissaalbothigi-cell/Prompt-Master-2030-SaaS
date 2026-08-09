'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/libs/I18nNavigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('ErrorPage');
  const pathname = usePathname();
  const isRtl = pathname.startsWith('/ar');

  // تسجيل الخطأ في خدمة مراقبة (أو وحدة التحكم)
  useEffect(() => {
    console.error('🔥 Unhandled error:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      path: pathname,
      timestamp: new Date().toISOString(),
    });
  }, [error, pathname]);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* الأيقونة */}
        <div className="text-6xl">🚨</div>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          {t('title') || 'حدث خطأ غير متوقع'}
        </h1>

        <p className="text-slate-600 dark:text-slate-400">
          {t('description') || 'نعتذر عن هذا الإزعاج. يبدو أن هناك خطأ ما في النظام.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800 text-left">
            <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-red-500 dark:text-red-400 mt-1">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            🔄 {t('retry') || 'إعادة المحاولة'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = `/${isRtl ? 'ar' : 'en'}/dashboard`}
          >
            🏠 {t('go_home') || 'الذهاب للرئيسية'}
          </Button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
          {t('support') || 'إذا استمرت المشكلة، يرجى الاتصال بالدعم الفني.'}
        </p>
      </div>
    </div>
  );
}