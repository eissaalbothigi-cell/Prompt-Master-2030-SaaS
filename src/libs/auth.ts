import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

// ============================================================
// 1. التحقق من صحة التوكن (Verify Token)
// ============================================================

/**
 * التحقق من صحة JWT وإرجاع المحتوى (payload) إذا كان صالحاً
 * @param token - التوكن المستلم من الكوكي أو الهيدر
 * @returns - محتوى التوكن (userId, email, role, ...) أو null إذا كان غير صالح
 */
export async function verifyTokenAsync(token: string): Promise<any | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    // التوكن غير صالح (منتهي الصلاحية، توقيع غير صحيح، أو مفسد)
    console.error('JWT verification failed:', error);
    return null;
  }
}

// ============================================================
// 2. توليد توكن جديد (Generate Token)
// ============================================================

/**
 * توليد JWT جديد للمستخدم
 * @param userId - معرف المستخدم
 * @param email - البريد الإلكتروني
 * @param role - دور المستخدم (user, admin, ...)
 * @returns - التوكن المُولَّد
 */
export async function generateToken(
  userId: string,
  email: string,
  role: string = 'user'
): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({
    userId,
    email,
    role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // صلاحية 7 أيام
    .sign(secret);
  return token;
}

// ============================================================
// 3. استخراج المستخدم من الطلب (Get Auth User)
// ============================================================

/**
 * استخراج التوكن من الكوكيز في طلبات Server Components أو API Routes
 * @param request - كائن Request من Next.js
 * @returns - محتوى التوكن (payload) أو null
 */
export async function getAuthUserFromRequest(request: Request): Promise<any | null> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookieMap = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...value] = c.split('=');
      return [key, value.join('=')];
    })
  );

  const token = cookieMap['auth_token'];
  if (!token) return null;

  return await verifyTokenAsync(token);
}

// ============================================================
// 4. استخراج المستخدم من Server Components (Next.js 15+)
// ============================================================

/**
 * استخراج التوكن من الكوكيز في Server Components (باستخدام next/headers)
 * @returns - محتوى التوكن (payload) أو null
 */
export async function getAuthUserFromServer(): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return await verifyTokenAsync(token);
  } catch (error) {
    console.error('Failed to get auth user from server:', error);
    return null;
  }
}