import { NextResponse } from "next/server";
import { clearSessionResponse } from "@/lib/session";

// ----------------------------------------------
// POST: تسجيل الخروج (Logout)
// ----------------------------------------------
export async function POST() {
  try {
    // 1. إنشاء رد JSON بنجاح
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // 2. مسح كوكي الجلسة (auth_token)
    return clearSessionResponse(response);
  } catch (error) {
    console.error("[Logout] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------
// (اختياري) دعم GET للتسجيل الخروج عبر الرابط
// ----------------------------------------------
export async function GET() {
  return POST();
}