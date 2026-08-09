import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { prompts } from '@/models/Schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '@/libs/Auth';
import { cookies } from 'next/headers';
import { handleApiError, UnauthorizedError, NotFoundError } from '@/libs/apiErrorHandler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new UnauthorizedError();
    const decoded = verifyToken(token);
    if (!decoded?.userId) throw new UnauthorizedError();

    const deleted = await db
      .delete(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.authorId, decoded.userId)))
      .returning({ id: prompts.id });

    if (deleted.length === 0) throw new NotFoundError('البرومبت');

    return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    return handleApiError(error);
  }
}