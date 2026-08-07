// ============================================================
// 📝 Logger - Prompt Master 2030
// ============================================================
// Simple logging utility that uses console methods.
// Supports log levels: error, warn, info, debug, trace.
// Level can be controlled via NEXT_PUBLIC_LOGGING_LEVEL env var.
// ============================================================

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * تحديد مستوى التسجيل الحالي من متغيرات البيئة
 */
const currentLevel: LogLevel = 
  (process.env.NEXT_PUBLIC_LOGGING_LEVEL as LogLevel) || 
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * مستويات التسجيل (مرتبة تصاعدياً)
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

/**
 * التحقق مما إذا كان المستوى المطلوب مسموحاً به
 */
const isLevelEnabled = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
};

/**
 * تسجيل رسالة خطأ (Error)
 */
export const logError = (...args: unknown[]): void => {
  if (isLevelEnabled('error')) {
    console.error('[ERROR]', ...args);
  }
};

/**
 * تسجيل رسالة تحذير (Warning)
 */
export const logWarn = (...args: unknown[]): void => {
  if (isLevelEnabled('warn')) {
    console.warn('[WARN]', ...args);
  }
};

/**
 * تسجيل رسالة معلومات (Info)
 */
export const logInfo = (...args: unknown[]): void => {
  if (isLevelEnabled('info')) {
    console.log('[INFO]', ...args);
  }
};

/**
 * تسجيل رسالة تصحيح (Debug)
 */
export const logDebug = (...args: unknown[]): void => {
  if (isLevelEnabled('debug')) {
    console.debug('[DEBUG]', ...args);
  }
};

/**
 * تسجيل رسالة تتبع (Trace)
 */
export const logTrace = (...args: unknown[]): void => {
  if (isLevelEnabled('trace')) {
    console.trace('[TRACE]', ...args);
  }
};

/**
 * كائن Logger يحتوي على جميع الدوال
 */
export const logger = {
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
  trace: logTrace,
};

/**
 * تسجيل رسالة مع المستوى المحدد ديناميكياً
 */
export const log = (level: LogLevel, ...args: unknown[]): void => {
  switch (level) {
    case 'error':
      logError(...args);
      break;
    case 'warn':
      logWarn(...args);
      break;
    case 'info':
      logInfo(...args);
      break;
    case 'debug':
      logDebug(...args);
      break;
    case 'trace':
      logTrace(...args);
      break;
    default:
      console.log('[LOG]', ...args);
  }
};

// ============================================================
// 🧪 أمثلة (Examples)
// ============================================================
/*
logger.info('✅ Application started');
logger.debug('🔍 Debugging user session');
logger.error('❌ Failed to connect to database');
*/