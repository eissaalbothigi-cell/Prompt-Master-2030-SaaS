import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { csrfProtection } from "@/lib/csrf";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers (Helmet-style)
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com;"
  );
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // CORS
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = [process.env.APP_URL || "http://localhost:3000"];
  
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // CSRF Protection for state-changing methods
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfResult = await csrfProtection(request);
    if (!csrfResult.valid) {
      return new NextResponse("Invalid CSRF token", { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
