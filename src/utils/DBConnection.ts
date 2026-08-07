import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import * as schema from '@/models/Schema';

// ============================================================
// 🗄️ Database Connection - Prompt Master 2030
// ============================================================
// This file manages the PostgreSQL database connection using Drizzle ORM.
// It uses a connection pool for efficient resource management.
// 
// 🔗 Documentation:
// - Drizzle: https://orm.drizzle.team/docs/overview
// - PostgreSQL: https://www.postgresql.org/docs/current/index.html
// ============================================================

// ============================================================
// 1️⃣ Connection Pool Configuration
// ============================================================

/**
 * تكوين Pool اتصال قاعدة البيانات
 */
const poolConfig = {
  connectionString: Env.DATABASE_URL,
  max: 20, // الحد الأقصى لعدد الاتصالات المتزامنة
  idleTimeoutMillis: 30000, // 30 ثانية
  connectionTimeoutMillis: 5000, // 5 ثوانٍ
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// ============================================================
// 2️⃣ Connection Pool Instance (Singleton)
// ============================================================

let poolInstance: Pool | null = null;

/**
 * إنشاء أو إعادة استخدام Pool الاتصال
 * @returns {Pool} Pool الاتصال بقاعدة البيانات
 */
function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool(poolConfig);

    // 🛡️ معالجة أخطاء الـ Pool
    poolInstance.on('error', (error) => {
      logger.error(`❌ Database pool error: ${error.message}`);
      // محاولة إعادة الاتصال
      poolInstance = null;
    });

    // ✅ مراقبة الاتصال
    poolInstance.on('connect', () => {
      logger.info('✅ Database pool connected successfully');
    });

    // 🧹 تنظيف الاتصالات المنتهية
    poolInstance.on('remove', () => {
      logger.debug('🔄 Database connection removed from pool');
    });

    logger.info('🗄️ Database pool initialized');
  }

  return poolInstance;
}

// ============================================================
// 3️⃣ Drizzle ORM Instance (Singleton)
// ============================================================

let drizzleInstance: ReturnType<typeof drizzle> | null = null;

/**
 * إنشاء أو إعادة استخدام Drizzle ORM
 * @returns {ReturnType<typeof drizzle>} كائن Drizzle
 */
export function createDbConnection() {
  if (!drizzleInstance) {
    const pool = getPool();
    drizzleInstance = drizzle({
      client: pool,
      schema,
      // 🐞 تفعيل وضع التصحيح (في التطوير فقط)
      ...(process.env.NODE_ENV !== 'production' && {
        logger: {
          log: (message: string) => logger.debug(`🔍 Drizzle: ${message}`),
        },
      }),
    });

    logger.info('🗄️ Drizzle ORM initialized');
  }

  return drizzleInstance;
}

// ============================================================
// 4️⃣ Export Connection (للراحة)
// ============================================================

/**
 * المصدر الأساسي للاتصال بقاعدة البيانات
 * استخدم هذا في جميع أنحاء التطبيق
 */
export const db = createDbConnection();

// ============================================================
// 5️⃣ Helper Functions (دوال مساعدة)
// ============================================================

/**
 * اختبار الاتصال بقاعدة البيانات
 * @returns {Promise<boolean>} true إذا كان الاتصال ناجحاً
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const client = await pool.connect();
    client.release();
    logger.info('✅ Database connection test successful');
    return true;
  } catch (error) {
    logger.error(`❌ Database connection test failed: ${(error as Error).message}`);
    return false;
  }
}

/**
 * إغلاق جميع الاتصالات (يُستخدم عند إيقاف الخادم)
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    drizzleInstance = null;
    logger.info('🛑 Database connections closed');
  }
}

// ============================================================
// 🧹 Cleanup on Server Shutdown
// ============================================================

// إغلاق الاتصالات عند إيقاف الخادم
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGTERM', async () => {
    logger.warn('⚠️ Received SIGTERM signal, closing database connections...');
    await closeDatabaseConnection();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.warn('⚠️ Received SIGINT signal, closing database connections...');
    await closeDatabaseConnection();
    process.exit(0);
  });
}