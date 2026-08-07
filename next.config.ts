import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import './src/libs/Env';

// ============================================================
// 📦 Next.js Configuration - Prompt Master 2030
// ============================================================
// This file configures Next.js for the Prompt Master 2030 platform.
// It includes optimization, security, and internationalization settings.

// ============================================================
// 1️⃣ Base Configuration (الإعدادات الأساسية)
// ============================================================
const baseConfig: NextConfig = {
  // 🎨 إظهار مؤشرات التطوير في الزاوية اليمنى السفلية
  devIndicators: {
    position: 'bottom-right',
  },

  // 🚫 إزالة رأس `X-Powered-By` لتحسين الأمان
  poweredByHeader: false,

  // 🔒 تفعيل الوضع الصارم لـ React
  reactStrictMode: true,

  // ⚡ تفعيل React Compiler في الإنتاج فقط (تحسين الأداء)
  reactCompiler: process.env.NODE_ENV === 'production',

  // 📊 إعدادات التسجيل (Logging)
  logging: {
    browserToTerminal: process.env.BROWSER_TO_TERMINAL_DISABLED !== 'true',
  },

  // 🗄️ تضمين ملفات الهجرات في مسار الإنتاج
  outputFileTracingIncludes: {
    '/': ['./drizzle/migrations/**/*'],
  },

  // 🖼️ دعم الصور من مصادر خارجية
  images: {
    domains: [
      'localhost',
      'prompt-master-2030.vercel.app',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },

  // 🔐 إعدادات الأمان (Security Headers)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 🔄 إعادة التوجيهات (Redirects)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar',
        permanent: true,
      },
    ];
  },

  // 📦 إعدادات Webpack (تحسين الحزم)
  webpack: (config, { isServer, webpack }) => {
    // تحسين حجم الحزمة
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // تجاهل التحذيرات غير الضرورية
    config.ignoreWarnings = [
      { module: /node_modules\/@paralleldrive\/cuid2/ },
    ];

    return config;
  },
};

// ============================================================
// 2️⃣ Plugins Integration (دمج الإضافات)
// ============================================================

// 🔤 دعم التدويل (i18n) عبر next-intl
let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

// 📊 تحليل حجم الحزمة (اختياري، يُفعّل عند تعيين ANALYZE=true)
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

// ❌ تم إزالة Sentry نهائياً لأننا لا نستخدمه
// ❌ تم إزالة @sentry/nextjs من التبعيات

// ============================================================
// 3️⃣ Export (التصدير النهائي)
// ============================================================

const nextConfig = configWithPlugins;
export default nextConfig;