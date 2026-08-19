import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/libs/DB";
import { users } from "@/models/Schema";
import { eq } from "drizzle-orm";
import { createSessionResponse } from "@/libs/session";
import { rateLimit } from "@/libs/rate-limit";
import { auditLoginSuccess, auditLoginFailed } from "@/libs/audit";

// ----------------------------------------------
// 1. التحقق من صحة المدخلات (Zod Schema)
// ----------------------------------------------
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// ----------------------------------------------
// 2. POST: تسجيل الدخول
// ----------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 2.1 استخراج الـ IP و User-Agent للتدقيق
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // 2.2 التحقق من Rate Limit (حماية من هجمات القوة العمياء)
    const rateLimitResult = await rateLimit({
      identifier: `login:${ipAddress}`,
      maxRequests: 10,
      windowMs: 60 * 1000, // 10 محاولات في الدقيقة
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // 2.3 قراءة وتحليل البيانات
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      await auditLoginFailed(body.email || "unknown", ipAddress, userAgent);
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 2.4 البحث عن المستخدم في قاعدة البيانات
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      await auditLoginFailed(email, ipAddress, userAgent);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2.5 التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await auditLoginFailed(email, ipAddress, userAgent);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2.6 التحقق من الحساب (إذا كان محظوراً أو غير مفعّل)
    if (user.isDeleted) {
      return NextResponse.json(
        { error: "Account is deactivated. Please contact support." },
        { status: 403 }
      );
    }

    // 2.7 إنشاء جلسة (Session) وتوليد التوكن
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };

    // 2.8 تسجيل التدقيق (نجاح)
    await auditLoginSuccess(user.id, ipAddress, userAgent);

    // 2.9 إنشاء الرد مع تعيين كوكي الجلسة
    return createSessionResponse(sessionPayload, {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("[Login] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
