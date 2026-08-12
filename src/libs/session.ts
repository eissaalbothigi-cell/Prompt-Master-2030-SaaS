import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// ----------------------------------------------
// 1. المفتاح السري (يُقرأ من البيئة)
// ----------------------------------------------
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"
);

// ----------------------------------------------
// 2. واجهات البيانات (Types)
// ----------------------------------------------
export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  role?: string;
}

export interface SessionResult {
  isValid: boolean;
  user?: SessionPayload;
  error?: string;
}

// ----------------------------------------------
// 3. إنشاء توكن جلسة جديد (يُستخدم في Auth)
// ----------------------------------------------
export async function createSessionToken(payload: SessionPayload, expiresIn = "7d"): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// ----------------------------------------------
// 4. التحقق من صحة التوكن وفك تشفيره
// ----------------------------------------------
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("[Session] Token verification failed:", error);
    return null;
  }
}

// ----------------------------------------------
// 5. استخراج الجلسة من طلب (Request) - الأهم للـ API
// ----------------------------------------------
export async function getSessionFromRequest(request: NextRequest): Promise<SessionResult> {
  try {
    // 5.1 جلب التوكن من الكوكيز (httpOnly)
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return { isValid: false, error: "No token provided" };
    }

    // 5.2 التحقق من التوكن
    const payload = await verifySessionToken(token);
    if (!payload) {
      return { isValid: false, error: "Invalid or expired token" };
    }

    // 5.3 إرجاع بيانات المستخدم
    return {
      isValid: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error("[Session] Error extracting session:", error);
    return { isValid: false, error: "Internal session error" };
  }
}

// ----------------------------------------------
// 6. دالة مساعدة لاستخراج المستخدم مباشرة (للـ API Routes)
// ----------------------------------------------
export async function getUserFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const result = await getSessionFromRequest(request);
  return result.isValid ? result.user! : null;
}

// ----------------------------------------------
// 7. إنشاء رد مع تعيين كوكي الجلسة (لـ Login/Register)
// ----------------------------------------------
export async function createSessionResponse(
  payload: SessionPayload,
  options?: { redirectTo?: string }
): Promise<NextResponse> {
  const token = await createSessionToken(payload);

  // إنشاء رد (إما JSON أو إعادة توجيه)
  const response = options?.redirectTo
    ? NextResponse.redirect(new URL(options.redirectTo, process.env.NEXT_PUBLIC_APP_URL))
    : NextResponse.json({ success: true, user: payload });

  // تعيين الكوكي (httpOnly, secure, sameSite)
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 أيام
  });

  return response;
}

// ----------------------------------------------
// 8. حذف الجلسة (تسجيل الخروج)
// ----------------------------------------------
export function clearSessionResponse(response?: NextResponse): NextResponse {
  const res = response || NextResponse.json({ success: true });
  res.cookies.delete("auth_token");
  return res;
}