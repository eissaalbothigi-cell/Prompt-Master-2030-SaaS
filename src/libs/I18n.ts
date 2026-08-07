import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './I18nRouting';

// ============================================================
// 🌍 I18n Configuration - Prompt Master 2030
// ============================================================
// This file configures internationalization (i18n) for the platform.
// It loads translation messages from the `locales/` folder based on the current locale.
//
// Supported locales: ar (Arabic), en (English)
// Default locale: ar (Arabic)
// ============================================================

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});