import type { PricingPlan } from '@/types/Subscription';

// ============================================================
// 💰 Pricing Plans - Prompt Master 2030
// ============================================================
// This file defines the subscription plans for the platform.
// Each plan has a name, price, limits, and features.
// ============================================================

// ============================================================
// 1️⃣ Plan Names (أسماء الخطط)
// ============================================================

export const PLAN_NAME = {
  FREE: 'free',
  STARTER: 'starter',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export type PlanName = typeof PLAN_NAME[keyof typeof PLAN_NAME];

// ============================================================
// 2️⃣ Free Plan (الخطة المجانية)
// ============================================================

const FreePlan: PricingPlan = {
  id: 'plan_free',
  name: PLAN_NAME.FREE,
  displayName: 'مجاني',
  description: 'للمبتدئين والأفراد',
  price: 0,
  currency: 'USD',
  interval: 'month',
  limits: {
    teamMember: 2,
    website: 2,
    storage: 2, // GB
    transfer: 2, // GB
    promptsPerMonth: 50,
    projects: 3,
  },
  features: [
    '✅ 50 برومبت شهرياً',
    '✅ 3 مشاريع',
    '✅ 2 أعضاء في الفريق',
    '✅ دعم عبر البريد الإلكتروني',
  ],
  popular: false,
};

// ============================================================
// 3️⃣ Paid Plans (الخطط المدفوعة)
// ============================================================

const StarterPlan: PricingPlan = {
  id: 'plan_starter',
  name: PLAN_NAME.STARTER,
  displayName: 'مبتدئ',
  description: 'للمشاريع الصغيرة والفرق الناشئة',
  price: 29,
  currency: 'USD',
  interval: 'month',
  limits: {
    teamMember: 5,
    website: 10,
    storage: 10,
    transfer: 10,
    promptsPerMonth: 500,
    projects: 20,
  },
  features: [
    '✅ 500 برومبت شهرياً',
    '✅ 20 مشروع',
    '✅ 5 أعضاء في الفريق',
    '✅ دعم عبر البريد الإلكتروني والدردشة',
    '✅ تحليلات أساسية',
  ],
  popular: true,
};

const PremiumPlan: PricingPlan = {
  id: 'plan_premium',
  name: PLAN_NAME.PREMIUM,
  displayName: 'متقدم',
  description: 'للشركات والمشاريع الكبيرة',
  price: 79,
  currency: 'USD',
  interval: 'month',
  limits: {
    teamMember: 15,
    website: 50,
    storage: 50,
    transfer: 50,
    promptsPerMonth: 2000,
    projects: 100,
  },
  features: [
    '✅ 2000 برومبت شهرياً',
    '✅ 100 مشروع',
    '✅ 15 عضواً في الفريق',
    '✅ دعم عبر البريد الإلكتروني، الدردشة، والهاتف',
    '✅ تحليلات متقدمة',
    '✅ تكامل مع APIs الخارجية',
  ],
  popular: false,
};

const EnterprisePlan: PricingPlan = {
  id: 'plan_enterprise',
  name: PLAN_NAME.ENTERPRISE,
  displayName: 'مؤسسات',
  description: 'حلول مخصصة للشركات الكبرى',
  price: 199,
  currency: 'USD',
  interval: 'month',
  limits: {
    teamMember: 100,
    website: 500,
    storage: 500,
    transfer: 500,
    promptsPerMonth: 10000,
    projects: 500,
  },
  features: [
    '✅ 10000 برومبت شهرياً',
    '✅ 500 مشروع',
    '✅ 100 عضو في الفريق',
    '✅ دعم مخصص على مدار 24/7',
    '✅ تحليلات متقدمة مع تقارير مخصصة',
    '✅ تكامل مع جميع الأنظمة',
    '✅ خادم مخصص (Dedicated Server)',
  ],
  popular: false,
};

// ============================================================
// 4️⃣ All Plans (جميع الخطط)
// ============================================================

export const AllPlans: PricingPlan[] = [
  FreePlan,
  StarterPlan,
  PremiumPlan,
  EnterprisePlan,
];

// ============================================================
// 5️⃣ Helper Functions (دوال مساعدة)
// ============================================================

/**
 * الحصول على خطة حسب المعرف
 * @param id - معرف الخطة
 * @returns الخطة أو `undefined` إذا لم توجد
 */
export const getPlanById = (id: string): PricingPlan | undefined => {
  return AllPlans.find(plan => plan.id === id);
};

/**
 * الحصول على خطة حسب الاسم
 * @param name - اسم الخطة (من `PLAN_NAME`)
 * @returns الخطة أو `undefined` إذا لم توجد
 */
export const getPlanByName = (name: PlanName): PricingPlan | undefined => {
  return AllPlans.find(plan => plan.name === name);
};

/**
 * الحصول على الخطط المدفوعة فقط
 * @returns قائمة الخطط المدفوعة
 */
export const getPaidPlans = (): PricingPlan[] => {
  return AllPlans.filter(plan => plan.price > 0);
};

/**
 * الحصول على الخطة الأكثر شهرة (Popular)
 * @returns الخطة الأكثر شهرة أو `undefined`
 */
export const getPopularPlan = (): PricingPlan | undefined => {
  return AllPlans.find(plan => plan.popular);
};

/**
 * الحصول على الخطة المجانية
 * @returns الخطة المجانية
 */
export const getFreePlan = (): PricingPlan | undefined => {
  return AllPlans.find(plan => plan.price === 0);
};

// ============================================================
// 6️⃣ Constants (ثوابت إضافية)
// ============================================================

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  SAR: 'SAR', // الريال السعودي
} as const;

export const INTERVALS = {
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const DEFAULT_CURRENCY = CURRENCIES.USD;
export const DEFAULT_INTERVAL = INTERVALS.MONTH;