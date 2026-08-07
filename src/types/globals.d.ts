import type { OrgPermission, OrgRole } from './Organization';

// ============================================================
// 🔐 Auth Types - Prompt Master 2030
// ============================================================
// This file defines types for authentication, users, sessions, and tokens.
// It supports JWT-based authentication and role-based access control (RBAC).
// ============================================================

// ============================================================
// 1️⃣ User Types (أنواع المستخدم)
// ============================================================

/**
 * دور المستخدم في النظام
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * المستخدم (بيانات أساسية)
 */
export type User = {
  /** معرف المستخدم */
  id: string;

  /** البريد الإلكتروني */
  email: string;

  /** الاسم */
  name: string;

  /** دور المستخدم */
  role: UserRole;

  /** صورة الملف الشخصي (اختياري) */
  avatarUrl?: string;

  /** عدد الرصيد (البرومبتات المتاحة) */
  credits: number;

  /** تم إنشاؤه في */
  createdAt: Date;

  /** تم التحديث في */
  updatedAt: Date;
};

/**
 * المستخدم مع معلومات المؤسسة
 */
export type UserWithOrganization = User & {
  /** دور المستخدم في المؤسسة الحالية */
  orgRole: OrgRole;

  /** صلاحيات المستخدم في المؤسسة الحالية */
  orgPermissions: OrgPermission[];
};

// ============================================================
// 2️⃣ Session Types (أنواع الجلسات)
// ============================================================

/**
 * جلسة المستخدم
 */
export type Session = {
  /** معرف الجلسة */
  id: string;

  /** معرف المستخدم */
  userId: string;

  /** التوكن (JWT) */
  token: string;

  /** تاريخ الانتهاء */
  expiresAt: Date;

  /** تم إنشاؤه في */
  createdAt: Date;

  /** عنوان IP (اختياري) */
  ipAddress?: string;

  /** وكيل المستخدم (المتصفح) (اختياري) */
  userAgent?: string;
};

// ============================================================
// 3️⃣ Token Types (أنواع التوكنات)
// ============================================================

/**
 * حمولة توكن JWT (Payload)
 */
export type JwtPayload = {
  /** معرف المستخدم */
  userId: string;

  /** دور المستخدم */
  role: UserRole;

  /** تاريخ الإصدار */
  iat?: number;

  /** تاريخ الانتهاء */
  exp?: number;
};

/**
 * توكن المصادقة (Access Token)
 */
export type AuthToken = {
  /** التوكن نفسه */
  token: string;

  /** تاريخ الانتهاء */
  expiresAt: Date;
};

/**
 * توكن التحديث (Refresh Token)
 */
export type RefreshToken = {
  /** التوكن نفسه */
  token: string;

  /** تاريخ الانتهاء */
  expiresAt: Date;
};

// ============================================================
// 4️⃣ Auth Request/Response (طلبات واستجابات المصادقة)
// ============================================================

/**
 * طلب تسجيل الدخول
 */
export type LoginRequest = {
  /** البريد الإلكتروني */
  email: string;

  /** كلمة المرور */
  password: string;

  /** تذكرني (اختياري) */
  rememberMe?: boolean;
};

/**
 * استجابة تسجيل الدخول
 */
export type LoginResponse = {
  /** نجاح العملية */
  success: boolean;

  /** المستخدم */
  user?: User;

  /** توكن المصادقة */
  accessToken?: AuthToken;

  /** توكن التحديث */
  refreshToken?: RefreshToken;

  /** رسالة الخطأ (في حالة الفشل) */
  error?: string;
};

/**
 * طلب إنشاء حساب
 */
export type RegisterRequest = {
  /** البريد الإلكتروني */
  email: string;

  /** كلمة المرور */
  password: string;

  /** الاسم (اختياري) */
  name?: string;
};

/**
 * استجابة إنشاء حساب
 */
export type RegisterResponse = LoginResponse;

/**
 * طلب تحديث التوكن (Refresh Token)
 */
export type RefreshTokenRequest = {
  /** توكن التحديث */
  refreshToken: string;
};

/**
 * استجابة تحديث التوكن
 */
export type RefreshTokenResponse = {
  /** نجاح العملية */
  success: boolean;

  /** توكن المصادقة الجديد */
  accessToken?: AuthToken;

  /** توكن التحديث الجديد (اختياري) */
  refreshToken?: RefreshToken;

  /** رسالة الخطأ (في حالة الفشل) */
  error?: string;
};

// ============================================================
// 5️⃣ Extended Types (أنواع موسعة)
// ============================================================

/**
 * توسيع الطلب (Request) ليشمل بيانات المستخدم
 */
export type AuthenticatedRequest = Request & {
  user?: User;
  session?: Session;
};

/**
 * توسيع الكوكيز (Cookies) ليشمل توكن المصادقة
 */
export type AuthCookies = {
  /** توكن المصادقة (httpOnly) */
  auth_token?: string;

  /** توكن التحديث (httpOnly) */
  refresh_token?: string;
};

// ============================================================
// 6️⃣ Helper Types (أنواع مساعدة)
// ============================================================

/**
 * حالة المصادقة
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * سياق المصادقة (للاستخدام في React Context)
 */
export type AuthContext = {
  /** المستخدم الحالي */
  user: User | null;

  /** حالة المصادقة */
  status: AuthStatus;

  /** تسجيل الدخول */
  login: (email: string, password: string) => Promise<void>;

  /** تسجيل الخروج */
  logout: () => Promise<void>;

  /** إنشاء حساب */
  register: (email: string, password: string, name?: string) => Promise<void>;
};