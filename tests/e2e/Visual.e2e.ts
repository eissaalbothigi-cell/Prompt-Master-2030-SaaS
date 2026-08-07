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

test.describe('🎨 Visual Testing', () => {
  // ============================================================
  // 📌 1. Static Pages (الصفحات الثابتة)
  // ============================================================
  test.describe('📄 Static Pages', () => {
    test('should take snapshot of the homepage in English', async ({ page }, testInfo) => {
      await page.goto('/');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText('The perfect SaaS template to build')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of the homepage in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('بروماستر 2030')).toBeVisible();
      await expect(page.getByText('قالب SaaS المثالي لبناء')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of the homepage in French', async ({ page }, testInfo) => {
      await page.goto('/fr');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText('Le parfait SaaS template pour construire')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 🔐 2. Authentication Pages (صفحات المصادقة)
  // ============================================================
  test.describe('🔐 Authentication Pages', () => {
    test('should take snapshot of sign-in page in English', async ({ page }, testInfo) => {
      await page.goto('/sign-in');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('Email address')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of sign-in page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/sign-in');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of sign-up page in English', async ({ page }, testInfo) => {
      await page.goto('/sign-up');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('Name (optional)')).toBeVisible();
      await expect(page.getByText('Email address')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of sign-up page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/sign-up');

      // ✅ التأكد من ظهور المحتوى قبل التقاط الصورة
      await expect(page.getByText('الاسم (اختياري)')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: 'إنشاء حساب' })).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 📊 3. Dashboard (لوحة التحكم) - بعد تسجيل الدخول
  // ============================================================
  test.describe('📊 Dashboard', () => {
    // ⚠️ هذا الاختبار يفترض وجود مستخدم مسجل مسبقاً
    // يمكن استخدام `test.beforeEach` لتسجيل الدخول تلقائياً
    test('should take snapshot of dashboard in English', async ({ page }, testInfo) => {
      // 🔐 تسجيل الدخول (يجب توفير بيانات صحيحة في البيئة)
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
      await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password123');
      await page.click('button[type="submit"]');

      // ✅ التأكد من ظهور لوحة التحكم
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('Welcome to Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of dashboard in Arabic', async ({ page }, testInfo) => {
      // 🔐 تسجيل الدخول بالعربية
      await page.goto('/ar/sign-in');
      await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
      await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'password123');
      await page.click('button[type="submit"]');

      // ✅ التأكد من ظهور لوحة التحكم بالعربية
      await expect(page.getByText('لوحة التحكم')).toBeVisible();
      await expect(page.getByText('مرحباً بك في Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 📱 4. Responsive Design (تصميم متجاوب)
  // ============================================================
  test.describe('📱 Responsive Design', () => {
    test('should take snapshot of homepage on mobile', async ({ page }, testInfo) => {
      // 📱 محاكاة شاشة الهاتف (iPhone 12)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of homepage on tablet', async ({ page }, testInfo) => {
      // 📱 محاكاة شاشة الجهاز اللوحي (iPad)
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of sign-in page on mobile', async ({ page }, testInfo) => {
      // 📱 محاكاة شاشة الهاتف
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/sign-in');

      await expect(page.getByText('Email address')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });

  // ============================================================
  // 🧭 5. Navigation & Redirects (التنقل وإعادة التوجيه)
  // ============================================================
  test.describe('🧭 Navigation & Redirects', () => {
    test('should take snapshot of 404 page', async ({ page }, testInfo) => {
      await page.goto('/unknown-route');

      // ✅ التأكد من ظهور صفحة 404
      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page not found')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take snapshot of 404 page in Arabic', async ({ page }, testInfo) => {
      await page.goto('/ar/unknown-route');

      // ✅ التأكد من ظهور صفحة 404 بالعربية
      await expect(page.getByText('٤٠٤')).toBeVisible();
      await expect(page.getByText('الصفحة غير موجودة')).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });
});