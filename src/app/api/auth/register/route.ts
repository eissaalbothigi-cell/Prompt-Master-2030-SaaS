import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/libs/DB";
import { users } from "@/models/Schema";
import { eq } from "drizzle-orm";
import { createSessionResponse } from "@/libs/session";
import { rateLimit } from "@/libs/rate-limit";
import { auditUserRegistered, auditLog } from "@/libs/audit";

// ----------------------------------------------
// 1. التحقق من صحة المدخلات (Zod Schema) - مستوى عالٍ من الدقة
// ----------------------------------------------
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "الاسم يجب أن يكون على الأقل حرفين")
      .max(50, "الاسم طويل جداً")
      .regex(/^[\u0600-\u06FFa-zA-Z\s'-]+$/, "الاسم يحتوي على أحرف غير مسموحة"),
    email: z
      .string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .min(5, "البريد الإلكتروني قصير جداً")
      .max(255, "البريد الإلكتروني طويل جداً"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .max(100, "كلمة المرور طويلة جداً")
      .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير (A-Z)")
      .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير (a-z)")
      .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم (0-9)")
      .regex(/[^a-zA-Z0-9]/, "يجب أن تحتوي كلمة المرور على رمز خاص (!@#$%^&*)"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

// ----------------------------------------------
// 2. POST: تسجيل مستخدم جديد
// ----------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 2.1 استخراج الـ IP و User-Agent للتدقيق
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 2.2 التحقق من Rate Limit (حماية من هجمات إنشاء الحسابات المتكررة)
    const rateLimitResult = await rateLimit({
      identifier: `register:${ipAddress}`,
      maxRequests: 5, // 5 محاولات فقط في الدقيقة
      windowMs: 60 * 1000,
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "محاولات تسجيل كثيرة جداً. الرجاء الانتظار دقيقة ثم المحاولة مرة أخرى.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2.3 قراءة وتحليل البيانات
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      // تسجيل محاولة فاشلة (للأمان)
      await auditLog({
        action: "auth.register.failed",
        userId: "system",
        metadata: {
          email: body.email || "unknown",
          errors: validation.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          ip: ipAddress,
        },
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        {
          error: "بيانات غير صحيحة",
          details: validation.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // 2.4 التحقق من أن البريد الإلكتروني غير مسجل مسبقاً
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        {
          error: "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.",
          code: "EMAIL_EXISTS",
        },
        { status: 409 }
      );
    }

    // 2.5 تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // 2.6 إدخال المستخدم الجديد في قاعدة البيانات
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user",
        credits: 10, // رصيد ابتدائي (حسب المنصة)
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        credits: users.credits,
      });

    // 2.7 تسجيل التدقيق (نجاح)
    await auditUserRegistered(newUser.id, newUser.email, ipAddress, userAgent);

    // 2.8 إنشاء جلسة (Session) وتسجيل الدخول التلقائي للمستخدم الجديد
    const sessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
      role: newUser.role,
    };

    // 2.9 إعادة الرد مع تعيين كوكي الجلسة (تسجيل الدخول التلقائي)
    return createSessionResponse(sessionPayload, {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("[Register] Unexpected error:", error);

    // محاولة تسجيل الخطأ في التدقيق (حتى لو فشلت، لا نوقف الطلب)
    try {
      await auditLog({
        action: "auth.register.error",
        userId: "system",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    } catch (_) {
      /* تجاهل فشل التدقيق */
    }

    return NextResponse.json(
      {
        error: "حدث خطأ داخلي. الرجاء المحاولة مرة أخرى لاحقاً.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
