'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('🔥 Global error caught:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50 dark:bg-slate-950">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="text-6xl">💥</div>
            <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-400">
              حدث عطل جذري في المنصة
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              نواجه مشكلة تقنية كبيرة. الفريق يعمل على حلها الآن.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800 text-left">
                <p className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
                  {error.message}
                </p>
              </div>
            )}
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              🔄 إعادة المحاولة
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}