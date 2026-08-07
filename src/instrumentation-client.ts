// ============================================================
// 📡 Sentry Client Configuration - Prompt Master 2030
// ============================================================
// This file configures Sentry on the client side (browser).
// It captures errors, performance traces, and user sessions.
// 
// 🔗 Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
// ============================================================

import * as Sentry from '@sentry/nextjs';

// ❌ Skip Sentry initialization if disabled via environment variable
if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  Sentry.init({
    // 🎯 Sentry DSN (Data Source Name)
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 🔌 Integrations
    integrations: [
      // 🎥 Session Replay (captures user interactions)
      Sentry.replayIntegration({
        maskAllText: false, // Show text in replays (for debugging)
        maskAllInputs: false, // Show input values (for debugging)
        blockAllMedia: false, // Show images and videos (for debugging)
      }),

      // 📝 Log console messages to Sentry
      Sentry.consoleLoggingIntegration(),

      // 🔄 Browser performance tracing
      Sentry.browserTracingIntegration(),

      // 💡 Spotlight integration (local debugging)
      ...(process.env.NODE_ENV === 'development'
        ? [Sentry.spotlightBrowserIntegration()]
        : []),
    ],

    // 👤 Send request headers and IP for users (for better debugging)
    sendDefaultPii: true,

    // 📊 Traces Sample Rate (adjust in production)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // 🎥 Replay Session Sample Rate
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // 🎥 Replay on Error Sample Rate (always capture when an error occurs)
    replaysOnErrorSampleRate: 1.0,

    // 📝 Enable logs to be sent to Sentry
    enableLogs: true,

    // 🐞 Enable debug mode (set to false in production)
    debug: process.env.NODE_ENV !== 'production',
  });
}

// ============================================================
// 🚀 Router Transition Tracking
// ============================================================

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;