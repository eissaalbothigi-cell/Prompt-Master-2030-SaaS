import { describe, expect, it } from 'vitest';
import { routing } from '@/libs/I18nRouting';
import { getI18nPath } from './Helpers';

// ============================================================
// 🧪 Helpers Tests - Prompt Master 2030
// ============================================================
// This file tests the I18n helper functions.
// It ensures that paths are correctly prefixed with the appropriate locale.
// ============================================================

describe('🧪 Helpers', () => {
  describe('🌍 I18n Path Helper (getI18nPath)', () => {
    // ============================================================
    // 📌 1. اللغة الافتراضية
    // ============================================================
    describe('when locale is the default language', () => {
      it('should keep path unchanged for the default locale (ar)', () => {
        const url = '/random-url';
        const locale = routing.defaultLocale; // 'ar'

        expect(getI18nPath(url, locale)).toBe(url);
      });

      it('should keep path unchanged for root path', () => {
        const url = '/';
        const locale = routing.defaultLocale; // 'ar'

        expect(getI18nPath(url, locale)).toBe(url);
      });

      it('should keep path unchanged for path with query parameters', () => {
        const url = '/dashboard?tab=overview';
        const locale = routing.defaultLocale; // 'ar'

        expect(getI18nPath(url, locale)).toBe(url);
      });
    });

    // ============================================================
    // 📌 2. اللغة غير الافتراضية
    // ============================================================
    describe('when locale is not the default language', () => {
      it('should prefix path with locale (en)', () => {
        const url = '/random-url';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe(`/en${url}`);
      });

      it('should prefix root path with locale (en)', () => {
        const url = '/';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe('/en');
      });

      it('should prefix path with query parameters (en)', () => {
        const url = '/dashboard?tab=overview';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe('/en/dashboard?tab=overview');
      });

      it('should prefix path with locale (fr)', () => {
        const url = '/random-url';
        const locale = 'fr';

        expect(getI18nPath(url, locale)).toBe(`/fr${url}`);
      });
    });

    // ============================================================
    // 📌 3. حالات خاصة (Edge Cases)
    // ============================================================
    describe('edge cases', () => {
      it('should handle empty path correctly', () => {
        const url = '';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe('/en');
      });

      it('should handle path with trailing slash correctly', () => {
        const url = '/dashboard/';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe('/en/dashboard/');
      });

      it('should handle path with multiple slashes correctly', () => {
        const url = '//dashboard//overview';
        const locale = 'en';

        // على الرغم من أن هذا المسار غير طبيعي، يجب أن تتعامل الدالة معه بأمان
        expect(getI18nPath(url, locale)).toContain('/en');
      });

      it('should handle path with special characters correctly', () => {
        const url = '/dashboard/عربي/english';
        const locale = 'en';

        expect(getI18nPath(url, locale)).toBe('/en/dashboard/عربي/english');
      });
    });

    // ============================================================
    // 📌 4. اختبارات الأداء (Performance)
    // ============================================================
    describe('performance', () => {
      it('should handle long paths efficiently', () => {
        const longPath = '/a'.repeat(100);
        const locale = 'en';

        const start = performance.now();
        getI18nPath(longPath, locale);
        const end = performance.now();

        expect(end - start).toBeLessThan(10); // يجب أن تستغرق أقل من 10 مللي ثانية
      });
    });
  });
});