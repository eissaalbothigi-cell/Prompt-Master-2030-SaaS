// ============================================================
// 🧪 Vitest Setup - Prompt Master 2030
// ============================================================
// This file runs before all tests.
// It configures the testing environment.

import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// ✅ إضافة matchers من Testing Library
expect.extend(matchers);

// ✅ محاكاة `next/navigation`
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// ✅ محاكاة `next/headers`
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => new Headers(),
}));

// ✅ محاكاة `process.env` (لضمان وجود المتغيرات)
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_APP_NAME = 'Prompt Master 2030';