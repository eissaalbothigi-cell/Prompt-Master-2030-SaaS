import { currentUser } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { db } from '@/libs/DB';
import { prompts, users } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import TitleBar from '@/features/dashboard/TitleBar';  // ✅ استيراد افتراضي (وليس مسمى)
import Link from 'next/link';

// ============================================================
// 1. جلب الإحصائيات (مع حماية كاملة ضد فشل قاعدة البيانات)
// ============================================================
async function getDashboardStats(userId: string) {
  try {
    const [promptsCount, userData, latestPrompts] = await Promise.all([
      db.select({ value: count() }).from(prompts).where(eq(prompts.authorId, userId)),
      db.select({ credits: users.credits }).from(users).where(eq(users.id, userId)).limit(1),
      db
        .select({
          id: prompts.id,
          title: prompts.title,
          status: prompts.status,
          createdAt: prompts.createdAt,
        })
        .from(prompts)
        .where(eq(prompts.authorId, userId))
        .orderBy(desc(prompts.createdAt))
        .limit(5),
    ]);

    return {
      totalPrompts: promptsCount[0]?.value ?? 0,
      credits: userData[0]?.credits ?? 5,
      latestPrompts: latestPrompts ?? [],
    };
  } catch (error) {
    console.error('❌ Dashboard Stats Error:', error);
    return { totalPrompts: 0, credits: 5, latestPrompts: [] };
  }
}

// ============================================================
// 2. تنسيق التاريخ (عربي)
// ============================================================
function formatDate(date: Date | string | null): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================
// 3. صفحة لوحة التحكم الرئيسية
// ============================================================
export default async function DashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const user = await currentUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const t = await getTranslations({ locale, namespace: 'DashboardPage' });
  const stats = await getDashboardStats(user.id);

  return (
    <>
      <TitleBar
        title={t('title_bar', { name: user.firstName || t('guest') })}
        description={t('title_bar_description')}
      />

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title={t('total_prompts')}
          value={stats.totalPrompts}
          icon="document"
          color="purple"
        />
        <StatCard
          title={t('credits')}
          value={stats.credits}
          icon="coins"
          color="indigo"
        />
        <StatusCard
          title={t('system_status')}
          status={t('online')}
        />
      </div>

      {/* قائمة آخر البرومبتات */}
      <RecentPromptsList
        prompts={stats.latestPrompts}
        emptyMessage={t('no_prompts_yet')}
        createLink={`/${locale}/builder`}
        createLabel={t('create_first_prompt')}
        viewAllLink={`/${locale}/dashboard/prompts`}
        viewAllLabel={t('view_all')}
        publishedLabel={t('published')}
        draftLabel={t('draft')}
        formatDate={formatDate}
      />
    </>
  );
}

// ============================================================
// 4. المكونات الداخلية (لتنظيم الكود)
// ============================================================

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: 'document' | 'coins'; color: 'purple' | 'indigo' }) {
  const iconMap = {
    document: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    coins: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  };

  const colorClasses = {
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1.5">{value.toLocaleString('ar-SA')}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{iconMap[icon]}</svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================

function StatusCard({ title, status }: { title: string; status: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">{status}</p>
          </div>
        </div>
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================

function RecentPromptsList({
  prompts,
  emptyMessage,
  createLink,
  createLabel,
  viewAllLink,
  viewAllLabel,
  publishedLabel,
  draftLabel,
  formatDate,
}: {
  prompts: any[];
  emptyMessage: string;
  createLink: string;
  createLabel: string;
  viewAllLink: string;
  viewAllLabel: string;
  publishedLabel: string;
  draftLabel: string;
  formatDate: (date: any) => string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">آخر البرومبتات</h3>
        <Link
          href={viewAllLink}
          className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200 inline-flex items-center gap-1"
        >
          {viewAllLabel} →
        </Link>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {prompts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
            <Link
              href={createLink}
              className="inline-block mt-3 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200"
            >
              {createLabel} →
            </Link>
          </div>
        ) : (
          prompts.map((prompt) => (
            <div key={prompt.id} className="px-6 py-4 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
              <div>
                <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{prompt.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(prompt.createdAt)}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  prompt.status === 'published'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {prompt.status === 'published' ? publishedLabel : draftLabel}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}