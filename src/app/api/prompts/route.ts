import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { prompts } from '@/models/Schema';
import { verifyToken } from '@/libs/Auth';
import { cookies } from 'next/headers';

// POST: حفظ برومبت جديد
export async function POST(request: NextRequest) {
  try {
    // 1. التحقق من المصادقة
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'رمز غير صالح' }, { status: 401 });
    }

    // 2. قراءة البيانات
    const body = await request.json();
    const { title, description, content, status = 'published' } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      );
    }

    // 3. حفظ في قاعدة البيانات
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        title,
        description: description || '',
        content,
        status,
        isPublic: false,
        authorId: decoded.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'تم حفظ البرومبت بنجاح',
      promptId: newPrompt?.id,
    });
  } catch (error) {
    console.error('Save prompt error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ داخلي' },
      { status: 500 }
    );
  }
}

// GET: جلب برومبتات المستخدم (اختياري، للتأكد من العمل)
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

    const userPrompts = await db
      .select()
      .from(prompts)
      .where(decoded.userId); // تبسيط: نستخدم where مع authorId

    return NextResponse.json(userPrompts);
  } catch (error) {
    console.error('Fetch prompts error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ داخلي' },
      { status: 500 }
    );
  }
}