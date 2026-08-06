import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

// ============================================================
// 🔥 1. إعدادات SEO والبيانات الوصفية
// ============================================================
type DashboardLayoutProps = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(props: DashboardLayoutProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'DashboardLayout' });

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
// 🏗️ 2. الـ Layout الرئيسي
// ============================================================
export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DashboardLayout' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // ✅ جلب بيانات المستخدم الحالي (للعرض في الـ Navbar)
  const { userId } = await auth();

  // ============================================================
  // 📌 2.1 تعريف روابط التنقل
  // ============================================================
  const navLinks = [
    {
      href: getI18nPath('/dashboard', locale),
      label: t('home'),
      icon: '🏠',
    },
    {
      href: getI18nPath('/dashboard/prompts', locale),
      label: t('prompts'),
      icon: '📚',
    },
    {
      href: getI18nPath('/dashboard/user-profile', locale),
      label: t('profile'),
      icon: '👤',
    },
    {
      href: getI18nPath('/dashboard/organization-profile', locale),
      label: t('organization'),
      icon: '🏢',
    },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ============================================================
          🧭 2.2 شريط التنقل (Navbar)
          ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          {/* 🔹 الشعار */}
          <Link href={getI18nPath('/dashboard', locale)} className="flex items-center gap-2">
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prompt Master 2030
            </span>
          </Link>

          {/* 🔹 الروابط (وسط) */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 🔹 أيقونات المستخدم والإعدادات */}
          <div className="flex items-center gap-3">
            {/* زر المستخدم (Clerk) */}
            {userId && (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-9 w-9 rounded-full border-2 border-blue-500/30',
                    userButtonTrigger: 'focus:outline-none',
                  },
                }}
                afterSignOutUrl={getI18nPath('/', locale)}
              />
            )}

            {/* 🟢 زر القائمة الجانبية (للهواتف) */}
            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 🔹 القائمة المنسدلة (للهواتف) */}
        <div className="block border-t border-slate-200/50 bg-white/80 px-4 py-2 dark:border-slate-800/50 dark:bg-slate-950/80 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ============================================================
          📄 2.3 محتوى الصفحة (يتم تمريره من الصفحات الفرعية)
          ============================================================ */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {props.children}
      </main>
    </div>
  );
}

// ============================================================
// ⚙️ 3. إعدادات الأداء (Dynamic Rendering)
// ============================================================
export const dynamic = 'force-dynamic';
