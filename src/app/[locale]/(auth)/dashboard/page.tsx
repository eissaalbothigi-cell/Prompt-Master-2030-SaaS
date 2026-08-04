import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/libs/DB';
import { prompts, users } from '@/models/Schema';
import { eq, desc, count } from 'drizzle-orm';
import { TitleBar } from '@/features/dashboard/TitleBar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  const totalUsers = await db.select({ value: count() }).from(users);
  const totalPrompts = await db.select({ value: count() }).from(prompts);

  return (
    <div className="space-y-6">
      <TitleBar title={t('title')} description={t('welcome')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
          <h3 className="text-sm font-medium text-slate-500">المستخدمون</h3>
          <p className="text-3xl font-bold mt-2">{totalUsers[0]?.value ?? 0}</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
          <h3 className="text-sm font-medium text-slate-500">البرومبتات</h3>
          <p className="text-3xl font-bold mt-2">{totalPrompts[0]?.value ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/${locale}/dashboard/user-profile`}
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold mb-2">👤 الملف الشخصي</h3>
          <p className="text-slate-500 dark:text-slate-400">إدارة إعدادات حسابك</p>
        </Link>

        <Link
          href={`/${locale}/dashboard/organization-profile`}
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold mb-2">🏢 المنظمة</h3>
          <p className="text-slate-500 dark:text-slate-400">إدارة فريقك والأعضاء</p>
        </Link>
      </div>
    </div>
  );
}
