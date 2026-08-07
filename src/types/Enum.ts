// ============================================================
// 🔢 Enum Utilities - Prompt Master 2030
// ============================================================
// This file provides utility types for working with enums and const objects.
// ============================================================

/**
 * استخراج قيم الكائن (Enum Values)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * type Color = EnumValues<typeof COLORS>; // 'red' | 'green' | 'blue'
 */
export type EnumValues<Type> = Type[keyof Type];

/**
 * استخراج مفاتيح الكائن (Enum Keys)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * type ColorKeys = EnumKeys<typeof COLORS>; // 'RED' | 'GREEN' | 'BLUE'
 */
export type EnumKeys<Type> = keyof Type;

/**
 * استخراج قيم الكائن كـ Array (للحلقات التكرارية)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * const colorValues = enumValuesArray(COLORS); // ['red', 'green', 'blue']
 */
export const enumValuesArray = <T extends Record<string, string | number>>(
  enumObj: T,
): EnumValues<T>[] => {
  return Object.values(enumObj) as EnumValues<T>[];
};

/**
 * استخراج مفاتيح الكائن كـ Array (للحلقات التكرارية)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * const colorKeys = enumKeysArray(COLORS); // ['RED', 'GREEN', 'BLUE']
 */
export const enumKeysArray = <T extends Record<string, string | number>>(
  enumObj: T,
): EnumKeys<T>[] => {
  return Object.keys(enumObj) as EnumKeys<T>[];
};

/**
 * التحقق مما إذا كانت القيمة موجودة في الكائن (Enum Check)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * isEnumValue(COLORS, 'red'); // true
 * isEnumValue(COLORS, 'yellow'); // false
 */
export const isEnumValue = <T extends Record<string, string | number>>(
  enumObj: T,
  value: unknown,
): value is EnumValues<T> => {
  return Object.values(enumObj).includes(value as T[keyof T]);
};

/**
 * التحقق مما إذا كان المفتاح موجوداً في الكائن (Enum Key Check)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * isEnumKey(COLORS, 'RED'); // true
 * isEnumKey(COLORS, 'YELLOW'); // false
 */
export const isEnumKey = <T extends Record<string, string | number>>(
  enumObj: T,
  key: unknown,
): key is EnumKeys<T> => {
  return Object.keys(enumObj).includes(key as string);
};

/**
 * الحصول على المفتاح من القيمة (Reverse Lookup)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * getKeyByValue(COLORS, 'red'); // 'RED'
 * getKeyByValue(COLORS, 'yellow'); // undefined
 */
export const getKeyByValue = <T extends Record<string, string | number>>(
  enumObj: T,
  value: EnumValues<T>,
): EnumKeys<T> | undefined => {
  const entry = Object.entries(enumObj).find(([_, val]) => val === value);
  return entry?.[0] as EnumKeys<T> | undefined;
};

/**
 * الحصول على القيمة من المفتاح (Safe Lookup)
 * @example
 * const COLORS = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;
 * getValueByKey(COLORS, 'RED'); // 'red'
 * getValueByKey(COLORS, 'YELLOW'); // undefined
 */
export const getValueByKey = <T extends Record<string, string | number>>(
  enumObj: T,
  key: EnumKeys<T>,
): EnumValues<T> | undefined => {
  return enumObj[key];
};

// ============================================================
// 🧪 أمثلة (Examples)
// ============================================================
/*
// تعريف الكائن
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

// استخراج الأنواع
type Role = EnumValues<typeof ROLES>; // 'admin' | 'user' | 'guest'
type RoleKeys = EnumKeys<typeof ROLES>; // 'ADMIN' | 'USER' | 'GUEST'

// استخدام الدوال المساعدة
const rolesList = enumValuesArray(ROLES); // ['admin', 'user', 'guest']
const keysList = enumKeysArray(ROLES); // ['ADMIN', 'USER', 'GUEST']

const isValid = isEnumValue(ROLES, 'admin'); // true
const isKey = isEnumKey(ROLES, 'ADMIN'); // true

const key = getKeyByValue(ROLES, 'admin'); // 'ADMIN'
const value = getValueByKey(ROLES, 'ADMIN'); // 'admin'
*/