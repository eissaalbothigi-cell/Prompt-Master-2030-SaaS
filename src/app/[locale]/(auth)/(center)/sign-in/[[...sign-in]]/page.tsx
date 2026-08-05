import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SignUpPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'SignUp' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `/${locale}/sign-up`,
      siteName: 'Prompt Master 2030',
    },
    alternates: {
      canonical: `/${locale}/sign-up`,
    },
  };
}

export default async function SignUpPage(props: SignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-8">
        <Link href={getI18nPath('/', locale)} className="block text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Prompt Master 2030
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {locale === 'ar' ? 'انضم إلى مجتمع البرومبتات الذكية' : 'Join the smart prompts community'}
          </p>
        </Link>

        <SignUp
          path={getI18nPath('/sign-up', locale)}
          routing="path"
          signInUrl={getI18nPath('/sign-in', locale)}
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-2xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm',
              headerTitle: 'text-2xl font-bold text-slate-900 dark:text-white',
              headerSubtitle: 'text-slate-600 dark:text-slate-400',
              formButtonPrimary:
                'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
              socialButtonsBlockButton:
                'border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors',
              footerActionLink: 'text-blue-600 dark:text-blue-400 hover:underline font-medium',
            },
          }}
        />
      </div>
    </div>
  );
}