import type { Metadata } from 'next';
import { OrganizationProfile } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';

type OrganizationProfilePageProps = {
  params: Promise<{ locale: string }>;
};

// ============================================================
// 📝 1. بيانات SEO والوصف
// ============================================================
export async function generateMetadata(props: OrganizationProfilePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'OrganizationProfilePage' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `/${locale}/organization-profile`,
      siteName: 'Prompt Master 2030',
    },
    alternates: {
      canonical: `/${locale}/organization-profile`,
    },
  };
}

// ============================================================
// 🏢 2. صفحة الملف الشخصي للمؤسسات
// ============================================================
export default async function OrganizationProfilePage(props: OrganizationProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'OrganizationProfilePage' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* ============================================================
            🏷️ 2.1 الهوية البصرية (شعار المنصة)
            ============================================================ */}
        <div className="text-center">
          <Link href={getI18nPath('/', locale)}>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prompt Master 2030
            </h1>
          </Link>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {locale === 'ar'
              ? 'إدارة فرق العمل والمؤسسات'
              : 'Manage teams and organizations'
            }
          </p>
        </div>

        {/* ============================================================
            🏢 2.2 مكون Clerk Organization Profile
            ============================================================ */}
        <OrganizationProfile
          routing="path"
          path={getI18nPath('/organization-profile', locale)}
          afterLeaveOrganizationUrl={getI18nPath('/dashboard', locale)}
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: [
                'w-full',
                'flex',
                'shadow-2xl',
                'rounded-2xl',
                'border',
                'border-slate-200/50',
                'dark:border-slate-800/50',
                'bg-white/80',
                'dark:bg-slate-950/80',
                'backdrop-blur-sm',
                'transition-all',
                'duration-300',
              ].join(' '),
              card: [
                'w-full',
                'bg-transparent',
                'shadow-none',
              ].join(' '),
              headerTitle: [
                'text-2xl',
                'font-bold',
                'text-slate-900',
                'dark:text-white',
              ].join(' '),
              headerSubtitle: [
                'text-slate-600',
                'dark:text-slate-400',
              ].join(' '),
              formButtonPrimary: [
                'bg-gradient-to-r',
                'from-blue-600',
                'to-purple-600',
                'hover:from-blue-700',
                'hover:to-purple-700',
                'text-white',
                'font-semibold',
                'py-2',
                'px-6',
                'rounded-lg',
                'transition-all',
                'duration-200',
                'shadow-md',
                'hover:shadow-lg',
                'focus:ring-2',
                'focus:ring-blue-500',
                'focus:ring-offset-2',
                'dark:focus:ring-offset-slate-900',
              ].join(' '),
              // تخصيص الأزرار الجانبية (مثل "إنشاء مؤسسة" أو "مغادرة")
              navbarButton: [
                'text-slate-600',
                'dark:text-slate-400',
                'hover:text-blue-600',
                'dark:hover:text-blue-400',
                'transition-colors',
                'duration-200',
              ].join(' '),
              navbarButtonActive: [
                'text-blue-600',
                'dark:text-blue-400',
                'bg-blue-50/50',
                'dark:bg-blue-950/30',
                'rounded-lg',
              ].join(' '),
            },
          }}
        />
      </div>
    </div>
  );
}