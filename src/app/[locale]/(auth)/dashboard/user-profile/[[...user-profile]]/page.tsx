import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { users } from '@/models/Schema';
import { eq } from 'drizzle-orm';

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

  const t = await getTranslations({ locale, namespace: 'Profile' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // ✅ التحقق من المصادقة
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect(getI18nPath('/sign-in', locale));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect(getI18nPath('/sign-in', locale));
  }

  const user = await db.select().from(users).where(eq(users.id, decoded.userId));
  if (!user[0]) {
    redirect(getI18nPath('/sign-in', locale));
  }

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

        {/* ✅ صفحة البروفايل المخصصة (بدلاً من Clerk) */}
        <div className="w-full rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-950/80">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
              {user[0].name?.[0] || user[0].email[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user[0].name || 'مستخدم'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{user[0].email}</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {locale === 'ar' ? 'الدور: ' : 'Role: '}
                {user[0].role === 'admin' ? 'مدير' : user[0].role === 'user' ? 'مستخدم' : user[0].role}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {locale === 'ar' ? 'الرصيد: ' : 'Credits: '}
                {user[0].credits}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200/50 pt-6 dark:border-slate-800/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {locale === 'ar' ? 'معلومات الحساب' : 'Account Info'}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {new Date(user[0].createdAt).toLocaleDateString(locale === 'ar' ? 'ar' : 'en')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {new Date(user[0].updatedAt).toLocaleDateString(locale === 'ar' ? 'ar' : 'en')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}