import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

// ============================================================
// 🎨 Visual Testing - Prompt Master 2030
// ============================================================
// This file contains visual regression tests using Chromatic.
// It captures snapshots of key pages to detect unintended UI changes.
// 
// 📌 Chromatic:
// - Automatically detects visual changes in UI components.
// - Runs on CI and provides a review interface for designers and developers.
// - Helps ensure UI consistency across different environments and devices.

test.describe('🎨 Visual Testing - Prompt Master 2030', () => {
  // ============================================================
  // 📌 1. Static Pages (الصفحات الثابتة)
  // ============================================================
  test.describe('📄 Static Pages', () => {
    test('should take snapshot of the homepage in English', async ({ page }, testInfo) => {
      await page.goto('/en');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText(/Master your prompts/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of the homepage in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar');

      await expect(page.getByText('بروماستر 2030')).toBeVisible();
      await expect(page.getByText(/أتقن برومبتاتك/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    // ✅ تم إزالة الفرنسية لأن المنصة لا تدعمها
  });

  // ============================================================
  // 🔐 2. Authentication Pages (صفحات المصادقة)
  // ============================================================
  test.describe('🔐 Authentication Pages', () => {
    test('should take snapshot of login page in English', async ({ page }, testInfo) => {
      await page.goto('/en/login');

      await expect(page.getByText('Sign In')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of login page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/login');

      await expect(page.getByText('تسجيل الدخول')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: /دخول/i })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of register page in English', async ({ page }, testInfo) => {
      await page.goto('/en/register');

      await expect(page.getByText('Create Account')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByText(/Confirm Password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Sign Up|Create Account/i })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of register page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/register');

      await expect(page.getByText('إنشاء حساب')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByText(/تأكيد كلمة المرور/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /تسجيل|إنشاء حساب/i })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 📊 3. Dashboard (لوحة التحكم) - بعد تسجيل الدخول
  // ============================================================
  test.describe('📊 Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // 🔐 تسجيل الدخول قبل كل اختبار Dashboard
      await page.goto('/en/login');
      await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
      await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
    });

    test('should take snapshot of dashboard in English', async ({ page }, testInfo) => {
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText(/Welcome|مرحباً/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of dashboard in Arabic', async ({ page }, testInfo) => {
      // التبديل إلى العربية عبر URL
      await page.goto('/ar/dashboard');
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('لوحة التحكم')).toBeVisible();
      await expect(page.getByText(/مرحباً|Welcome/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of prompts page', async ({ page }, testInfo) => {
      await page.goto('/en/dashboard/prompts');
      await page.waitForLoadState('networkidle');

      await expect(page.getByText(/Prompts|البرومبتات/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of projects page', async ({ page }, testInfo) => {
      await page.goto('/en/dashboard/projects');
      await page.waitForLoadState('networkidle');

      await expect(page.getByText(/Projects|المشاريع/i)).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 📱 4. Responsive Design (تصميم متجاوب)
  // ============================================================
  test.describe('📱 Responsive Design', () => {
    test('should take snapshot of homepage on mobile', async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/en');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of homepage on tablet', async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/en');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of login page on mobile', async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/en/login');

      await expect(page.getByText('Sign In')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of login page on mobile in Arabic', async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/ar/login');

      await expect(page.getByText('تسجيل الدخول')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 🧭 5. Error Pages (صفحات الأخطاء)
  // ============================================================
  test.describe('🧭 Error Pages', () => {
    test('should take snapshot of 404 page in English', async ({ page }, testInfo) => {
      await page.goto('/unknown-route-12345');

      await expect(page.getByText('404')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of 404 page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/unknown-route-12345');

      await expect(page.getByText('٤٠٤')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 🌙 6. Dark Mode (الوضع المظلم) - إذا كان مدعوماً
  // ============================================================
  test.describe('🌙 Dark Mode', () => {
    test('should take snapshot of homepage in dark mode', async ({ page }, testInfo) => {
      // محاولة تفعيل الوضع المظلم (إذا كان الزر موجوداً)
      await page.goto('/en');
      
      const darkModeToggle = page.locator('button[aria-label*="dark" i], button[aria-label*="theme" i]');
      if (await darkModeToggle.count() > 0) {
        await darkModeToggle.click();
        await page.waitForLoadState('networkidle');
        await takeSnapshot(page, testInfo);
      } else {
        // إذا لم يكن الزر موجوداً، يتم تخطي الاختبار
        test.skip(true, 'Dark mode toggle not found');
      }
    });

    test('should take snapshot of login page in dark mode', async ({ page }, testInfo) => {
      await page.goto('/en/login');
      
      const darkModeToggle = page.locator('button[aria-label*="dark" i], button[aria-label*="theme" i]');
      if (await darkModeToggle.count() > 0) {
        await darkModeToggle.click();
        await page.waitForLoadState('networkidle');
        await takeSnapshot(page, testInfo);
      } else {
        test.skip(true, 'Dark mode toggle not found');
      }
    });
  });
});