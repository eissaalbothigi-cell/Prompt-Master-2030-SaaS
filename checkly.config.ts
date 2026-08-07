import { defineConfig } from 'checkly';
import { EmailAlertChannel, Frequency } from 'checkly/constructs';

// ============================================================
// 🔔 إعدادات التنبيهات (Alert Channels)
// ============================================================
const sendDefaults = {
  sendFailure: true,
  sendRecovery: true,
  sendDegraded: true,
};

const emailChannel = new EmailAlertChannel('email-channel-1', {
  address: process.env.CHECKLY_EMAIL_ADDRESS ?? 'admin@promptmaster2030.com',
  ...sendDefaults,
});

// ============================================================
// 📦 إعدادات المشروع (Project Configuration)
// ============================================================
export const config = defineConfig({
  // 🏷️ هوية المشروع
  projectName: process.env.CHECKLY_PROJECT_NAME ?? 'Prompt Master 2030',
  logicalId: process.env.CHECKLY_LOGICAL_ID ?? 'prompt-master-2030',
  repoUrl: 'https://github.com/eissaalbothigi-cell/Prompt-Master-2030-SaaS',

  // ============================================================
  // ✅ إعدادات الفحوصات (Checks Configuration)
  // ============================================================
  checks: {
    // 📍 مواقع الاختبار
    locations: ['us-east-1', 'eu-central-1'],
    
    // 🏷️ العلامات (لتنظيم الفحوصات)
    tags: ['saas', 'prompt-master', 'nextjs'],

    // ⏱️ وقت التشغيل (Runtime)
    runtimeId: '2024.02',

    // ============================================================
    // 🌐 فحوصات المتصفح (Browser Checks - E2E)
    // ============================================================
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: '**/tests/e2e/**/*.check.e2e.ts',
      alertChannels: [emailChannel],
    },

    // ============================================================
    // ⚙️ إعدادات Playwright (لمحاكاة المتصفح)
    // ============================================================
    playwrightConfig: {
      use: {
        baseURL: process.env.ENVIRONMENT_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://prompt-master-2030.vercel.app',
        extraHTTPHeaders: {
          'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN ?? '',
        },
        // 👤 محاكاة مستخدم حقيقي
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      },
    },
  },

  // ============================================================
  // 🖥️ إعدادات واجهة الأوامر (CLI)
  // ============================================================
  cli: {
    runLocation: 'us-east-1', // موقع تنفيذ الاختبارات
    reporters: ['list'], // عرض النتائج في المحطة
  },
});

export default config;