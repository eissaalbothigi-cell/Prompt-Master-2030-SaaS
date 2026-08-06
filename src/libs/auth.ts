import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './DB';
import { users } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { Env } from './Env';

// ============================================
// 🔐 1. دوال التشفير والتحقق
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// 🔑 2. دوال إدارة الجلسات (JWT)
// ============================================

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    Env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, Env.JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await db.select().from(users).where(eq(users.id, decoded.userId));
  return user[0] || null;
}

// ============================================
// 🍪 3. دوال إدارة الكوكيز
// ============================================

export function setAuthCookie(token: string) {
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete('auth_token');
}