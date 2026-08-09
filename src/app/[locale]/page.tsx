import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROMPT_FRAMEWORKS } from '@/libs/templates';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage(props: HomePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Landing' });
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const features = [
    { icon: '🧠', key: 'feature1' },
    { icon: '📚', key: 'feature2' },
    { icon: '🛠️', key: 'feature3' },
    { icon: '🤝', key: 'feature4' },
    { icon: '📊', key: 'feature5' },
    { icon: '🌍', key: 'feature6' },
  ];

  const plans = [
    { name: 'free', price: '0' },
    { name: 'pro', price: '19' },
    { name: 'enterprise', price: '49' },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🧠 Prompt Master</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2030</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link href={getI18nPath('/#features', locale)}>{t('nav_features')}</Link>
            <Link href={getI18nPath('/#frameworks', locale)}>{t('nav_frameworks')}</Link>
            <Link href={getI18nPath('/#pricing', locale)}>{t('nav_pricing')}</Link>
            <Link href={getI18nPath('/dashboard', locale)}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">{t('nav_dashboard')}</Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href={getI18nPath('/auth/signin', locale)}>
              <Button variant="ghost" size="sm">{t('nav_signin')}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="container mx-auto relative px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{t('hero_title')}</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400">{t('hero_description')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={getI18nPath('/auth/signup', locale)}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">🚀 {t('hero_cta')}</Button>
            </Link>
            <Link href={getI18nPath('/#features', locale)}>
              <Button size="lg" variant="outline" className="text-lg px-8">{t('hero_learn_more')}</Button>
            </Link>
          </div>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">{t('hero_free')}</div>
        </div>
      </section>

      <Separator />

      <section id="features" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('features_title')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('features_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-slate-800/50 dark:bg-slate-950/80">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t(`${f.key}_title`)}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t(`${f.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section id="frameworks" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('frameworks_title')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('frameworks_subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PROMPT_FRAMEWORKS.map((fw) => (
              <div key={fw.id} className="rounded-xl border border-slate-200/50 bg-white/80 p-4 text-center shadow-sm transition-all hover:shadow-md dark:border-slate-800/50 dark:bg-slate-950/80">
                <div className="text-2xl mb-1">{fw.name.split(' ')[0]}</div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{fw.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{fw.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section id="pricing" className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('pricing_title')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('pricing_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div key={idx} className={`rounded-2xl border p-6 shadow-lg backdrop-blur-sm ${idx === 1 ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950' : 'border-slate-200/50 bg-white/80 dark:border-slate-800/50 dark:bg-slate-950/80'}`}>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t(`plan_${plan.name}`)}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('plan_per_month')}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t(`plan_${plan.name}_desc`)}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-2">✅ {t(`plan_${plan.name}_feature${i}`)}</li>
                  ))}
                </ul>
                <Link href={getI18nPath('/auth/signup', locale)}>
                  <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">{t('plan_cta')}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('cta_title')}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{t('cta_description')}</p>
          <Link href={getI18nPath('/auth/signup', locale)}>
            <Button size="lg" className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">🚀 {t('cta_button')}</Button>
          </Link>
        </div>
      </section>

      <Separator />

      <footer className="bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">🧠 Prompt Master 2030</span>
              <span className="hidden md:inline">— {t('footer_tagline')}</span>
            </div>
            <div className="flex gap-6">
              <Link href={getI18nPath('/#', locale)} className="hover:text-slate-900 dark:hover:text-white transition">{t('footer_terms')}</Link>
              <Link href={getI18nPath('/#', locale)} className="hover:text-slate-900 dark:hover:text-white transition">{t('footer_privacy')}</Link>
              <Link href="mailto:support@promptmaster2030.com" className="hover:text-slate-900 dark:hover:text-white transition">{t('footer_contact')}</Link>
            </div>
            <div className="text-xs">© {new Date().getFullYear()} {t('footer_copyright')}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}