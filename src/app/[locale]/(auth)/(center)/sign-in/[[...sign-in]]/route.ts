import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { users } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, generateToken, setAuthCookie } from '@/libs/Auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // 1. البحث عن المستخدم في قاعدة البيانات
    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user[0]) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير مسجل' },
        { status: 404 }
      );
    }

    // 2. التحقق من كلمة المرور
    const isValid = await verifyPassword(password, user[0].password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // 3. إنشاء التوكن وتعيين الكوكيز
    const token = generateToken(user[0].id);
    setAuthCookie(token);

    // 4. إرجاع بيانات المستخدم (بدون كلمة المرور)
    return NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}