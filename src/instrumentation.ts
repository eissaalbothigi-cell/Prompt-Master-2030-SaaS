import * as Sentry from '@sentry/nextjs';

// ============================================================
// 📡 Sentry Configuration - Prompt Master 2030
// ============================================================
// This file configures Sentry for error monitoring and performance tracking.
// Sentry helps identify and fix issues in production.
// 
// 🔗 Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
// ============================================================

const sentryOptions: Sentry.NodeOptions | Sentry.EdgeOptions = {
  // 🎯 Sentry DSN (Data Source Name)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 💡 Enable Spotlight in development (local debugging)
  spotlight: process.env.NODE_ENV === 'development',

  // 🔌 Integrations
  integrations: [
    // Log console messages to Sentry
    Sentry.consoleLoggingIntegration(),
  ],

  // 👤 Send request headers and IP for users (for better debugging)
  sendDefaultPii: true,

  // 📊 Traces Sample Rate (adjust in production)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 📝 Enable logs to be sent to Sentry
  enableLogs: true,

  // 🐞 Enable debug mode (set to false in production)
  debug: process.env.NODE_ENV !== 'production',
};

// ============================================================
// 🚀 Register Function (runs on server startup)
// ============================================================

export function register() {
  // ❌ Skip Sentry initialization if disabled via environment variable
  if (process.env.NEXT_PUBLIC_SENTRY_DISABLED === 'true') {
    console.log('🔕 Sentry is disabled via NEXT_PUBLIC_SENTRY_DISABLED');
    return;
  }

  // ✅ Initialize Sentry for Node.js environment
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init(sentryOptions);
    console.log('📡 Sentry initialized for Node.js');
  }

  // ✅ Initialize Sentry for Edge environment
  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(sentryOptions);
    console.log('📡 Sentry initialized for Edge');
  }
}

// ============================================================
// 🛑 Error Handler (captures request errors)
// ============================================================

export const onRequestError = Sentry.captureRequestError;