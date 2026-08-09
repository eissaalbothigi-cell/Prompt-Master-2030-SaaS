import { NextResponse } from 'next/server';

// ============================================================
// 📌 أنواع الأخطاء المعروفة (Structured Error Classes)
// ============================================================

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'غير مصرح') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'المورد') {
    super(`${resource} غير موجود`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = 'خطأ في قاعدة البيانات') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// ============================================================
// 🛡️ معالج الأخطاء المركزي (Centralized Error Handler)
// ============================================================

export function handleApiError(error: unknown): NextResponse {
  // تسجيل الخطأ في وحدة التحكم (للمطورين)
  console.error('🔥 API Error:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  // إذا كان الخطأ من نوع ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code || 'API_ERROR',
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // إذا كان الخطأ من نوع Error (عام)
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ داخلي',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
      { status: 500 }
    );
  }

  // أي خطأ آخر غير معروف
  return NextResponse.json(
    {
      success: false,
      error: 'حدث خطأ غير متوقع',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    },
    { status: 500 }
  );
}

// ============================================================
// 📦 دوال مساعدة سريعة لردود API (Utility Helpers)
// ============================================================

export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function apiMessage(message: string, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
    },
    { status }
  );
}