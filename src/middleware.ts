import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { csrfProtection, setCsrfCookie } from "@/libs/csrf";
import { verifyTokenAsync } from "@/libs/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. التحقق من المصادقة للمسارات المحمية
  const token = request.cookies.get("auth_token")?.value;
  let isValid = false;
  if (token) {
    const payload = await verifyTokenAsync(token);
    isValid = !!payload;
  }
  
  const isPublicPath = path === "/login" || path === "/register" || path === "/";
  const isApiPublic = path.startsWith("/api/auth");
  
  // 2. إعادة التوجيه للمصادقة
  if (!isValid && !isPublicPath && !isApiPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isValid && (isPublicPath || path === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. إنشاء الرد الأساسي
  const response = NextResponse.next();

  // --- هيدرات الأمان (Helmet) ---
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com;"
  );

  // --- CORS (للـ API) ---
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"];
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-csrf-token");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // --- CSRF Protection للطلبات المعدلة ---
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfResult = csrfProtection(request);
    if (!csrfResult.valid) {
      return new NextResponse("Invalid CSRF token", { status: 403 });
    }
  }

  // --- تعيين كوكي CSRF لأول مرة ---
  return setCsrfCookie(response);
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/register", "/"],
};