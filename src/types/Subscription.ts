import type { EnumValues } from './Enum';
import type { PLAN_NAME } from '@/utils/PricingPlans';

// ============================================================
// 💰 Subscription Types - Prompt Master 2030
// ============================================================
// This file defines types for subscription plans, billing, and payments.
// ============================================================

// ============================================================
// 1️⃣ Plan Types (أنواع الخطط)
// ============================================================

type PlanName = EnumValues<typeof PLAN_NAME>;

/**
 * خطة الاشتراك (Pricing Plan)
 */
export type PricingPlan = {
  /** معرف فريد للخطة (للقاعدة البيانات) */
  id: string;

  /** اسم الخطة (من `PLAN_NAME`) */
  name: PlanName;

  /** اسم الخطة المعروض (للواجهة) */
  displayName: string;

  /** وصف الخطة */
  description: string;

  /** السعر (بالعملة المحددة) */
  price: number;

  /** العملة (مثل 'USD', 'EUR', 'SAR') */
  currency: string;

  /** الفاصل الزمني (شهري، سنوي) */
  interval: 'month' | 'year';

  /** حدود الخطة */
  limits: {
    /** عدد أعضاء الفريق */
    teamMember: number;

    /** عدد المواقع/المشاريع */
    website: number;

    /** مساحة التخزين (بـ GB) */
    storage: number;

    /** حجم النقل/الزيارات (بـ GB) */
    transfer: number;

    /** عدد البرومبتات شهرياً */
    promptsPerMonth: number;

    /** عدد المشاريع */
    projects: number;
  };

  /** قائمة الميزات (للعرض) */
  features: string[];

  /** هل هذه الخطة هي الأكثر شهرة؟ */
  popular: boolean;
};

// ============================================================
// 2️⃣ Subscription Status (حالة الاشتراك)
// ============================================================

/**
 * حالة الاشتراك
 */
export type SubscriptionStatus =
  | 'active' // نشط
  | 'trialing' // فترة تجريبية
  | 'past_due' // تأخر في الدفع
  | 'canceled' // ملغي
  | 'incomplete' // غير مكتمل
  | 'incomplete_expired' // منتهي الصلاحية
  | 'unpaid'; // غير مدفوع

// ============================================================
// 3️⃣ Billing Info (معلومات الفوترة)
// ============================================================

/**
 * معلومات الفوترة للمستخدم
 */
export type BillingInfo = {
  /** معرف المستخدم */
  userId: string;

  /** البريد الإلكتروني للفوترة */
  billingEmail: string;

  /** عنوان الفوترة */
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };

  /** طريقة الدفع الافتراضية */
  defaultPaymentMethod: PaymentMethod;
};

// ============================================================
// 4️⃣ Payment Method (طريقة الدفع)
// ============================================================

/**
 * طريقة الدفع
 */
export type PaymentMethod = {
  /** نوع طريقة الدفع */
  type: 'card' | 'bank_transfer' | 'paypal' | 'crypto';

  /** آخر 4 أرقام (للبطاقات) */
  last4?: string;

  /** العلامة التجارية (مثل 'Visa', 'Mastercard') */
  brand?: string;

  /** تاريخ انتهاء الصلاحية */
  expiryMonth?: number;
  expiryYear?: number;

  /** اسم حامل البطاقة */
  holderName?: string;
};

// ============================================================
// 5️⃣ Subscription Record (سجل الاشتراك)
// ============================================================

/**
 * سجل الاشتراك (في قاعدة البيانات)
 */
export type SubscriptionRecord = {
  /** معرف الاشتراك */
  id: string;

  /** معرف المستخدم */
  userId: string;

  /** معرف الخطة */
  planId: string;

  /** حالة الاشتراك */
  status: SubscriptionStatus;

  /** تاريخ البدء */
  startDate: Date;

  /** تاريخ الانتهاء */
  endDate?: Date;

  /** تاريخ الإلغاء */
  canceledAt?: Date;

  /** تاريخ التجديد التالي */
  nextBillingDate?: Date;

  /** معرف Stripe/Checkout (لمعالجة الدفع) */
  stripeSubscriptionId?: string;

  /** تم إنشاؤه في */
  createdAt: Date;

  /** تم التحديث في */
  updatedAt: Date;
};

// ============================================================
// 6️⃣ Helper Types (أنواع مساعدة)
// ============================================================

/**
 * خطة اشتراك مع معلومات إضافية (للواجهة)
 */
export type PricingPlanWithFeatures = PricingPlan & {
  /** هل الخطة حالية؟ (للمستخدم) */
  isCurrent?: boolean;
};

/**
 * طلب تغيير الخطة
 */
export type ChangePlanRequest = {
  /** معرف الخطة الجديدة */
  planId: string;

  /** الفاصل الزمني الجديد (شهري/سنوي) */
  interval?: 'month' | 'year';
};

/**
 * نتيجة تغيير الخطة
 */
export type ChangePlanResult = {
  success: boolean;
  message?: string;
  newSubscription?: SubscriptionRecord;
};