import { expect, test } from '@playwright/test';

// ============================================================
// 🧪 Sanity & Monitoring Tests - Prompt Master 2030
// ============================================================
// This file contains sanity checks for the deployed environment.
// These tests run regularly to ensure that the platform is alive and responding correctly.
// 
// 📌 Checkly:
// - Checks ending with `.check.e2e.ts` are used for monitoring production.
// - They run at a configured frequency (e.g., every 24 hours).
// - If a test fails, Checkly sends alerts via email, Slack, etc.
// 
// 📌 E2E Tests (`.e2e.ts`):
// - Run before deployment to ensure the app is ready.
// - Can be run locally or on CI.

test.describe('🧪 Sanity Checks', () => {
  // ============================================================
  // 📌 1. Static Pages
  // ============================================================
  test.describe('📄 Static Pages', () => {
    test('should display the homepage in English', async ({ page }) => {
      await page.goto('/');

      // ✅ التحقق من وجود النص الإنجليزي
      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText('The perfect SaaS template to build')).toBeVisible();
    });

    test('should display the homepage in Arabic', async ({ page }) => {
      await page.goto('/ar');

      // ✅ التحقق من وجود النص العربي
      await expect(page.getByText('بروماستر 2030')).toBeVisible();
      await expect(page.getByText('قالب SaaS المثالي لبناء')).toBeVisible();
    });

    test('should display the homepage in French', async ({ page }) => {
      await page.goto('/fr');

      // ✅ التحقق من وجود النص الفرنسي
      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText('Le parfait SaaS template pour construire')).toBeVisible();
    });
  });

  // ============================================================
  // 🔐 2. Authentication Pages
  // ============================================================
  test.describe('🔐 Authentication Pages', () => {
    test('should display the sign-in page in English', async ({ page }) => {
      await page.goto('/sign-in');

      await expect(page.getByText('Email address')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should display the sign-in page in Arabic', async ({ page }) => {
      await page.goto('/ar/sign-in');

      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
    });

    test('should display the sign-up page in English', async ({ page }) => {
      await page.goto('/sign-up');

      await expect(page.getByText('Email address')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByText('Name (optional)')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    });

    test('should display the sign-up page in Arabic', async ({ page }) => {
      await page.goto('/ar/sign-up');

      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByText('الاسم (اختياري)')).toBeVisible();
      await expect(page.getByRole('button', { name: 'إنشاء حساب' })).toBeVisible();
    });
  });

  // ============================================================
  // 📊 3. Dashboard (requires authentication)
  // ============================================================
  test.describe('📊 Dashboard', () => {
    test('should redirect to sign-in when accessing dashboard without authentication', async ({ page }) => {
      await page.goto('/dashboard');

      // ✅ يجب إعادة التوجيه إلى تسجيل الدخول
      await expect(page).toHaveURL(/\/sign-in/);
    });

    // ⚠️ اختبار لوحة التحكم بعد تسجيل الدخول يحتاج إلى بيانات مستخدم حقيقية
    // يمكن إضافتها باستخدام `test.use` أو `test.beforeEach` مع بيانات مصادقة مسبقة.
  });

  // ============================================================
  // 🧭 4. Navigation & Redirects
  // ============================================================
  test.describe('🧭 Navigation & Redirects', () => {
    test('should redirect root to Arabic', async ({ page }) => {
      await page.goto('/');

      // ✅ يجب إعادة التوجيه إلى العربية
      await expect(page).toHaveURL(/\/ar/);
    });

    test('should display 404 page for unknown routes', async ({ page }) => {
      const response = await page.goto('/unknown-route');

      // ✅ التحقق من صفحة 404
      expect(response?.status()).toBe(404);
      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page not found')).toBeVisible();
    });
  });

  // ============================================================
  // 🌍 5. Language Persistence
  // ============================================================
  test.describe('🌍 Language Persistence', () => {
    test('should persist language preference across pages', async ({ page }) => {
      // 🔄 تغيير اللغة إلى العربية
      await page.goto('/');
      await page.getByRole('button', { name: 'Change language' }).click();
      await page.getByText('العربية').click();

      // ✅ التحقق من بقاء اللغة في الصفحة التالية
      await page.goto('/sign-in');
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
    });

    test('should persist language preference after page reload', async ({ page }) => {
      // 🔄 تغيير اللغة إلى العربية
      await page.goto('/');
      await page.getByRole('button', { name: 'Change language' }).click();
      await page.getByText('العربية').click();

      // 🔄 إعادة تحميل الصفحة
      await page.reload();

      // ✅ التحقق من بقاء اللغة بعد إعادة التحميل
      await expect(page.getByText('بروماستر 2030')).toBeVisible();
      await expect(page.getByText('قالب SaaS المثالي لبناء')).toBeVisible();
    });
  });
});