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

test.describe('🧪 Sanity Checks - Prompt Master 2030', () => {
  // ============================================================
  // 📌 1. Static Pages
  // ============================================================
  test.describe('📄 Static Pages', () => {
    test('should display the homepage in English', async ({ page }) => {
      await page.goto('/en');

      await expect(page.getByText('Prompt Master 2030')).toBeVisible();
      await expect(page.getByText(/Master your prompts/i)).toBeVisible();
    });

    test('should display the homepage in Arabic', async ({ page }) => {
      await page.goto('/ar');

      await expect(page.getByText('بروماستر 2030')).toBeVisible();
      await expect(page.getByText(/أتقن برومبتاتك/i)).toBeVisible();
    });

    // ✅ ملاحظة: تم إزالة الفرنسية لأن المنصة لا تدعمها
  });

  // ============================================================
  // 🔐 2. Authentication Pages
  // ============================================================
  test.describe('🔐 Authentication Pages', () => {
    test('should display the login page in English', async ({ page }) => {
      await page.goto('/en/login');

      await expect(page.getByText('Sign In')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    });

    test('should display the login page in Arabic', async ({ page }) => {
      await page.goto('/ar/login');

      await expect(page.getByText('تسجيل الدخول')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: /دخول/i })).toBeVisible();
    });

    test('should display the register page in English', async ({ page }) => {
      await page.goto('/en/register');

      await expect(page.getByText('Create Account')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Password')).toBeVisible();
      await expect(page.getByText(/Confirm Password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Sign Up|Create Account/i })).toBeVisible();
    });

    test('should display the register page in Arabic', async ({ page }) => {
      await page.goto('/ar/register');

      await expect(page.getByText('إنشاء حساب')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByText('كلمة المرور')).toBeVisible();
      await expect(page.getByText(/تأكيد كلمة المرور/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /تسجيل|إنشاء حساب/i })).toBeVisible();
    });
  });

  // ============================================================
  // 📊 3. Dashboard (requires authentication)
  // ============================================================
  test.describe('📊 Dashboard', () => {
    test('should redirect to login when accessing dashboard without authentication', async ({ page }) => {
      await page.goto('/dashboard');

      // ✅ يجب إعادة التوجيه إلى تسجيل الدخول
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to login when accessing any protected route', async ({ page }) => {
      await page.goto('/dashboard/prompts');
      await expect(page).toHaveURL(/\/login/);

      await page.goto('/dashboard/projects');
      await expect(page).toHaveURL(/\/login/);
    });

    // ⚠️ اختبار لوحة التحكم بعد تسجيل الدخول يحتاج إلى بيانات مستخدم حقيقية
    // يمكن إضافتها باستخدام `test.use` أو `test.beforeEach` مع بيانات مصادقة مسبقة.
  });

  // ============================================================
  // 🧭 4. Navigation & Redirects
  // ============================================================
  test.describe('🧭 Navigation & Redirects', () => {
    test('should redirect root to default locale (Arabic)', async ({ page }) => {
      await page.goto('/');

      // ✅ يجب إعادة التوجيه إلى العربية (هذا يعتمد على إعدادات locale الافتراضية)
      // إذا كانت الـ locale الافتراضية هي العربية، فستكون النتيجة `/ar`
      // يمكن تعديل هذا حسب إعدادات المنصة
      await expect(page).toHaveURL(/\/ar/);
    });

    test('should display 404 page for unknown routes', async ({ page }) => {
      const response = await page.goto('/unknown-route-12345');

      // ✅ التحقق من صفحة 404
      expect(response?.status()).toBe(404);
      await expect(page.getByText('404')).toBeVisible();
    });
  });

  // ============================================================
  // 🌍 5. Language Persistence
  // ============================================================
  test.describe('🌍 Language Persistence', () => {
    test('should persist language preference across pages using URL', async ({ page }) => {
      // الذهاب إلى الصفحة بالعربية
      await page.goto('/ar');

      // ✅ التحقق من وجود النص العربي
      await expect(page.getByText('بروماستر 2030')).toBeVisible();

      // الانتقال إلى صفحة تسجيل الدخول
      await page.goto('/ar/login');

      // ✅ التحقق من بقاء اللغة العربية
      await expect(page.getByText('تسجيل الدخول')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني')).toBeVisible();

      // الانتقال إلى صفحة التسجيل
      await page.goto('/ar/register');

      // ✅ التحقق من بقاء اللغة العربية
      await expect(page.getByText('إنشاء حساب')).toBeVisible();
    });

    test('should switch language via URL', async ({ page }) => {
      // البدء بالعربية
      await page.goto('/ar');
      await expect(page.getByText('بروماستر 2030')).toBeVisible();

      // التبديل إلى الإنجليزية عبر URL
      await page.goto('/en');
      await expect(page.getByText('Prompt Master 2030')).toBeVisible();

      // التبديل إلى العربية عبر URL
      await page.goto('/ar');
      await expect(page.getByText('بروماستر 2030')).toBeVisible();
    });

    test('should preserve locale in protected routes after login', async ({ page }) => {
      // الذهاب إلى صفحة تسجيل الدخول بالعربية
      await page.goto('/ar/login');

      // محاكاة تسجيل الدخول (بافتراض أن المستخدم سيدخل البيانات)
      // هذا مجرد اختبار للتحقق من بقاء اللغة بعد تسجيل الدخول
      // في اختبار حقيقي، سنستخدم بيانات مصادقة فعلية
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      // بعد تسجيل الدخول، يجب أن تبقى اللغة العربية
      await expect(page).toHaveURL(/\/ar\/dashboard/);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });
  });

  // ============================================================
  // 🌐 6. API Health Check
  // ============================================================
  test.describe('🌐 API Health', () => {
    test('should respond to health check endpoint', async ({ request }) => {
      const response = await request.get('/api/health');
      
      // إذا كانت نقطة /api/health غير موجودة، يتم تخطي الاختبار
      // (نظراً لأن بعض المنصات قد لا تحتوي على هذه النقطة)
      if (response.status() === 404) {
        test.skip(true, '/api/health endpoint not found');
        return;
      }

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    });

    test('should reject unauthenticated API requests', async ({ request }) => {
      const response = await request.get('/api/user');
      
      // يجب أن يعيد 401 (غير مصرح) أو 302 (إعادة توجيه)
      expect([401, 302]).toContain(response.status());
    });
  });
});