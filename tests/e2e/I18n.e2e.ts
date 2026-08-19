import { expect, test } from '@playwright/test';

test.describe('I18n - Language Switching', () => {
  test('should switch language from Arabic to English using dropdown on the homepage', async ({ page }) => {
    await page.goto('/');

    // التحقق من اللغة الافتراضية (العربية)
    await expect(page.getByText('Prompt Master 2030')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // تبديل اللغة إلى الإنجليزية
    await page.getByRole('button', { name: /تبديل اللغة|Switch language/i }).click();
    await page.getByText('English').click();

    // التحقق من تغيير اللغة
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page).toHaveURL(/\/en/);
  });

  test('should switch language from English to Arabic using URL on the login page', async ({ page }) => {
    // الذهاب إلى صفحة تسجيل الدخول بالإنجليزية
    await page.goto('/en/login');
    await expect(page.getByText('Sign In')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();

    // التبديل إلى العربية عبر URL
    await page.goto('/ar/login');
    await expect(page.getByText('تسجيل الدخول')).toBeVisible();
    await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
  });

  test('should display correct translations on the register page', async ({ page }) => {
    // صفحة التسجيل بالعربية
    await page.goto('/ar/register');
    await expect(page.getByText('إنشاء حساب')).toBeVisible();
    await expect(page.getByText('الاسم')).toBeVisible();
    await expect(page.getByText('البريد الإلكتروني')).toBeVisible();
    await expect(page.getByText('كلمة المرور')).toBeVisible();

    // صفحة التسجيل بالإنجليزية
    await page.goto('/en/register');
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Password')).toBeVisible();
  });

  test('should persist language preference after navigation', async ({ page }) => {
    // بدء بالعربية
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // التنقل إلى صفحة تسجيل الدخول
    await page.goto('/ar/login');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByText('تسجيل الدخول')).toBeVisible();

    // التنقل إلى لوحة التحكم (محاكاة تسجيل الدخول)
    await page.goto('/ar/dashboard');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});