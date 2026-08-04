import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

// ============================================================
// 🔥 1. هوية التطبيق (قم بتعديل القيم بين علامات التنصيص)
// ============================================================
const APP_NAME = "Prompt Master 2030";
const APP_DESCRIPTION = "منصتك الاحترافية لإدارة وبيع القوالب (برومبتات) الذكية بسهولة وأمان.";
const APP_URL = "https://prompt-master-2030-saas.vercel.app"; // 🔴 غيّر إلى رابطك الفعلي
const APP_IMAGE = "/og-image.png"; // 🖼️ تأكد من وجود هذه الصورة في مجلد public

// ============================================================
// 📝 2. بيانات SEO الرئيسية (متكاملة مع Open Graph و Twitter)
// ============================================================
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`, // سيظهر كـ "الصفحة | Prompt Master 2030"
  },
  description: APP_DESCRIPTION,
  keywords: ["قوالب ذكاء اصطناعي", "برومبتات", "SaaS", "إدارة قوالب", "AI Prompts"],
  authors: [{ name: "فريق Prompt Master" }],
  creator: "Prompt Master Team",
  publisher: "Prompt Master Team",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // أيقونات المتصفح
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'icon', url: '/favicon.ico' },
  ],

  // 🖼️ تحسين المشاركة في واتساب / فيسبوك / تويتر (Open Graph)
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [{ url: APP_IMAGE, width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [APP_IMAGE],
    // creator: '@yourTwitterHandle', // يمكنك إلغاء التعليق وإضافة حسابك
  },
};

// ============================================================
// 📱 3. إعدادات عرض الجوال (Viewport)
// ============================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
};

// ============================================================
// ⚙️ 4. دوال Next.js الأساسية (التدويل والمسارات الثابتة)
// ============================================================
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// ============================================================
// 🚀 5. المكون الرئيسي (الـ Root Layout العالمي)
// ============================================================
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // التأكد من أن اللغة المدعومة موجودة
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // تفعيل اللغة للخادم (ضروري لـ next-intl)
  setRequestLocale(locale);

  // 🔥 النقطة الأهم: جلب ملفات الترجمة (JSON) الخاصة باللغة الحالية
  const messages = await getMessages();

  // تحديد اتجاه الصفحة (RTL للعربية، LTR للغات الأخرى)
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        {/* تمرير messages إلى الـ Provider حتى تعمل الترجمات في جميع المكونات */}
        <NextIntlClientProvider messages={messages}>
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}