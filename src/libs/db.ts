import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/models/schema"; // ✅ التصحيح: المسار الجديد حسب خطة كيمي

// ----------------------------------------------
// 1. التحقق الصريح من وجود المتغير (بدلاً من استخدام !)
// ----------------------------------------------
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in environment variables");
}

// ----------------------------------------------
// 2. إنشاء عميل Neon
// ----------------------------------------------
const sql = neon(process.env.DATABASE_URL);

// ----------------------------------------------
// 3. إنشاء كائن Drizzle مع السكيما المُحدّثة
// ----------------------------------------------
export const db = drizzle(sql, { schema });

// ----------------------------------------------
// 4. تصدير نوع السكيما للاستخدام في TypeScript
// ----------------------------------------------
export type Schema = typeof schema;

// ----------------------------------------------
// 5. دالة مساعدة لاختبار الاتصال (مفيدة للتطوير)
// ----------------------------------------------
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connected`;
    return { success: true, message: "✅ Database connected successfully", result };
  } catch (error) {
    console.error("[DB] Connection test failed:", error);
    return { success: false, message: "❌ Database connection failed", error };
  }
}