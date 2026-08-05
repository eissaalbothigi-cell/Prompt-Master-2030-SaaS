import type { Metadata } from 'next';
import { UserProfile } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ProfilePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Profile' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `/${locale}/user-profile`,
      siteName: 'Prompt Master 2030',
    },
    alternates: {
      canonical: `/${locale}/user-profile`,
    },
  };
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div 
      dir={dir}
      className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="w-full max-w-4xl space-y-6">
        {/* الهيدر مع الشعار */}
        <div className="text-center">
          <Link href={getI18nPath('/', locale)}>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prompt Master 2030
            </h1>
          </Link>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {locale === 'ar' 
              ? 'إدارة حسابك الشخصي وبياناتك' 
              : 'Manage your personal account and data'
            }
          </p>
        </div>

        {/* مكون Clerk لعرض وتعديل البروفايل */}
        <UserProfile 
          path={getI18nPath('/user-profile', locale)}
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: [
                'w-full',
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
              headerTitle: [
                'text-2xl',
                'font-bold',
                'text-slate-900',
                'dark:text-white',
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
              ].join(' '),
            },
          }}
        />
      </div>
    </div>
  );
}