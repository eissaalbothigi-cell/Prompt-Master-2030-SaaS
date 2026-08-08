import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { users } from '@/models/Schema';
import { verifyToken } from '@/libs/Auth';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

// GET: جلب بيانات المستخدم
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'رمز غير صالح' }, { status: 401 });
    }

    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    if (!user.length) {
      return NextResponse.json({ error: 'مستخدم غير موجود' }, { status: 404 });
    }

    const { password, ...safeUser } = user[0];
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

// PUT: تحديث الملف الشخصي
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'رمز غير صالح' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, bio, jobTitle } = body;

    await db.update(users)
      .set({
        firstName,
        lastName,
        bio,
        jobTitle,
        updatedAt: new Date(),
      })
      .where(eq(users.id, decoded.userId));

    return NextResponse.json({ success: true, message: 'تم التحديث' });
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}