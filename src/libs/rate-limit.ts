import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ----------------------------------------------
// 1. تهيئة عميل Redis (مع آلية احتياطية)
// ----------------------------------------------
let redis: Redis | null = null;
let useFallback = false;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    console.warn("[Rate-Limit] Upstash Redis credentials missing. Using in-memory fallback.");
    useFallback = true;
  }
} catch (_error) {
  console.warn("[Rate-Limit] Redis initialization failed. Using in-memory fallback.");
  useFallback = true;
}

// ----------------------------------------------
// 2. نظام التحديد في الذاكرة (آلية احتياطية)
// ----------------------------------------------
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

async function memoryRateLimit(identifier: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: new Date(now + windowMs) };
  }

  if (record.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, reset: new Date(record.resetAt) };
  }

  record.count += 1;
  memoryStore.set(identifier, record);
  return { success: true, limit: maxRequests, remaining: maxRequests - record.count, reset: new Date(record.resetAt) };
}

// ----------------------------------------------
// 3. المُحدِّد الرئيسي (يدعم Redis والاحتياطي)
// ----------------------------------------------
export interface RateLimitOptions {
  identifier: string;          // المعرف الفريد (مثل userId أو IP)
  maxRequests?: number;        // الحد الأقصى للطلبات (افتراضي: 60)
  windowMs?: number;           // النافذة الزمنية بالمللي ثانية (افتراضي: 60000 = دقيقة واحدة)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

/**
 * دالة تحديد معدل الطلبات
 * - تدعم Redis (Upstash) مع آلية احتياطية داخل الذاكرة.
 * - تعمل في بيئات Edge و Serverless و Node.js.
 * - لا ترمي أخطاء أبداً (ترجع false في حالة الفشل).
 */
export async function rateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, maxRequests = 60, windowMs = 60000 } = options;

  // التحقق من صحة المعرف
  if (!identifier || typeof identifier !== "string") {
    console.error("[Rate-Limit] Invalid identifier provided.");
    return { success: false, limit: maxRequests, remaining: 0, reset: new Date(Date.now() + windowMs) };
  }

  // ---- حالة استخدام Redis ----
  if (!useFallback && redis) {
    try {
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs}ms`),
        analytics: true,
        prefix: "prompt-master:ratelimit",
      });

      const result = await ratelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset),
      };
    } catch (error) {
      console.error("[Rate-Limit] Redis error, falling back to memory:", error);
      // ننتقل إلى الاحتياطي في حالة فشل Redis
    }
  }

  // ---- حالة استخدام الذاكرة (آلية احتياطية) ----
  return await memoryRateLimit(identifier, maxRequests, windowMs);
}

// ----------------------------------------------
// 4. دوال مساعدة لتسهيل الاستخدام
// ----------------------------------------------

/**
 * تحديد معدل الطلبات بناءً على معرف المستخدم (userId)
 * مناسب لحماية واجهات API الخاصة بالمستخدمين المسجلين
 */
export async function rateLimitUser(userId: string, maxRequests = 60, windowMs = 60000): Promise<RateLimitResult> {
  return rateLimit({ identifier: `user:${userId}`, maxRequests, windowMs });
}

/**
 * تحديد معدل الطلبات بناءً على عنوان IP
 * مناسب لحماية الواجهات العامة (مثل التسجيل، إعادة تعيين كلمة المرور)
 */
export async function rateLimitIP(ip: string, maxRequests = 30, windowMs = 60000): Promise<RateLimitResult> {
  return rateLimit({ identifier: `ip:${ip}`, maxRequests, windowMs });
}

/**
 * تحديد معدل الطلبات بشكل صارم للعمليات الحساسة (مثل تغيير كلمة المرور)
 */
export async function rateLimitStrict(identifier: string, maxRequests = 5, windowMs = 60000): Promise<RateLimitResult> {
  return rateLimit({ identifier: `strict:${identifier}`, maxRequests, windowMs });
}

// ----------------------------------------------
// 5. تصدير دالة افتراضية للاستخدام العام
// ----------------------------------------------
export default rateLimit;