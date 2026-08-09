import { handleApiError, UnauthorizedError, ValidationError, apiSuccess } from '@/libs/apiErrorHandler';

export async function POST(request: Request) {
  try {
    // 1. التحقق من الصلاحية
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    // 2. التحقق من صحة البيانات
    const body = await request.json();
    if (!body.title) throw new ValidationError('العنوان مطلوب');

    // 3. منطق العمل
    const result = await saveToDatabase(body);

    // 4. رد النجاح
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}