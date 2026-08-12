"use client";

import { useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    // تسجيل الخطأ بأمان
    console.error("🔥 Application Error:", error);

    // كشف اتجاه اللغة
    const htmlDir = document.documentElement.getAttribute("dir");
    if (htmlDir === "rtl") setDir("rtl");
    else setDir("ltr");
  }, [error]);

  const handleReset = () => {
    try {
      reset();
    } catch {
      // إذا فشل الـ reset، نعيد تحميل الصفحة
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:border-red-800/30 dark:bg-gray-900/90">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl dark:bg-red-900/40">
          ⚠️
        </div>

        <h2 className="mb-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {dir === "rtl" ? "حدث عطل تقني" : "Something went wrong"}
        </h2>

        <p className="mb-6 text-center text-base text-gray-600 dark:text-gray-400">
          {dir === "rtl"
            ? "نأسف للإزعاج. الفريق يعمل على حل المشكلة. يمكنك المحاولة مرة أخرى."
            : "We apologize for the inconvenience. Please try again or contact support."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleReset}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/50 active:scale-95"
          >
            {dir === "rtl" ? "🔄 حاول مجدداً" : "🔄 Try Again"}
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `Error: ${error.message}\nDigest: ${error.digest || "N/A"}`
              );
              alert(dir === "rtl" ? "تم نسخ التقرير" : "Report copied");
            }}
            className="w-full rounded-xl border border-gray-300 bg-white/50 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {dir === "rtl" ? "📋 نسخ التقرير" : "📋 Copy Report"}
          </button>
        </div>
      </div>
    </div>
  );
}