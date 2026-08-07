import type { EnumValues } from './Enum';

// ============================================================
// 🏢 Organization Roles & Permissions - Prompt Master 2030
// ============================================================
// This file defines the roles and permissions for organizations.
// It supports hierarchical role-based access control (RBAC).
// ============================================================

// ============================================================
// 1️⃣ Organization Roles (أدوار المؤسسة)
// ============================================================

export const ORG_ROLE = {
  /** المالك - أعلى صلاحية، يمتلك كل الصلاحيات */
  OWNER: 'org:owner',

  /** المدير - صلاحية كاملة باستثناء حذف المؤسسة */
  ADMIN: 'org:admin',

  /** مدير الفريق - يدير الأعضاء والمشاريع والبرومبتات */
  MANAGER: 'org:manager',

  /** عضو - صلاحيات أساسية (إنشاء وتعديل البرومبتات) */
  MEMBER: 'org:member',

  /** مشاهد - صلاحية قراءة فقط */
  VIEWER: 'org:viewer',
} as const;

export type OrgRole = EnumValues<typeof ORG_ROLE>;

// ============================================================
// 2️⃣ Organization Permissions (صلاحيات المؤسسة)
// ============================================================

export const ORG_PERMISSION = {
  // 🏢 إدارة المؤسسة
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',

  // 👥 إدارة الأعضاء
  MEMBER_READ: 'member:read',
  MEMBER_INVITE: 'member:invite',
  MEMBER_REMOVE: 'member:remove',
  MEMBER_ROLE_UPDATE: 'member:role:update',

  // 📁 إدارة المشاريع
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',

  // 📦 إدارة البرومبتات
  PROMPT_CREATE: 'prompt:create',
  PROMPT_READ: 'prompt:read',
  PROMPT_UPDATE: 'prompt:update',
  PROMPT_DELETE: 'prompt:delete',
  PROMPT_PUBLISH: 'prompt:publish',

  // 🔧 الإعدادات
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',

  // 💰 الإشتراكات والفواتير
  BILLING_READ: 'billing:read',
  BILLING_UPDATE: 'billing:update',
} as const;

export type OrgPermission = EnumValues<typeof ORG_PERMISSION>;

// ============================================================
// 3️⃣ Role-Permission Mapping (ربط الأدوار بالصلاحيات)
// ============================================================

/**
 * صلاحيات كل دور في المؤسسة
 */
export const ROLE_PERMISSIONS: Record<OrgRole, OrgPermission[]> = {
  [ORG_ROLE.OWNER]: [
    ORG_PERMISSION.ORG_READ,
    ORG_PERMISSION.ORG_UPDATE,
    ORG_PERMISSION.ORG_DELETE,
    ORG_PERMISSION.MEMBER_READ,
    ORG_PERMISSION.MEMBER_INVITE,
    ORG_PERMISSION.MEMBER_REMOVE,
    ORG_PERMISSION.MEMBER_ROLE_UPDATE,
    ORG_PERMISSION.PROJECT_CREATE,
    ORG_PERMISSION.PROJECT_READ,
    ORG_PERMISSION.PROJECT_UPDATE,
    ORG_PERMISSION.PROJECT_DELETE,
    ORG_PERMISSION.PROMPT_CREATE,
    ORG_PERMISSION.PROMPT_READ,
    ORG_PERMISSION.PROMPT_UPDATE,
    ORG_PERMISSION.PROMPT_DELETE,
    ORG_PERMISSION.PROMPT_PUBLISH,
    ORG_PERMISSION.SETTINGS_READ,
    ORG_PERMISSION.SETTINGS_UPDATE,
    ORG_PERMISSION.BILLING_READ,
    ORG_PERMISSION.BILLING_UPDATE,
  ],
  [ORG_ROLE.ADMIN]: [
    ORG_PERMISSION.ORG_READ,
    ORG_PERMISSION.ORG_UPDATE,
    ORG_PERMISSION.MEMBER_READ,
    ORG_PERMISSION.MEMBER_INVITE,
    ORG_PERMISSION.MEMBER_REMOVE,
    ORG_PERMISSION.MEMBER_ROLE_UPDATE,
    ORG_PERMISSION.PROJECT_CREATE,
    ORG_PERMISSION.PROJECT_READ,
    ORG_PERMISSION.PROJECT_UPDATE,
    ORG_PERMISSION.PROJECT_DELETE,
    ORG_PERMISSION.PROMPT_CREATE,
    ORG_PERMISSION.PROMPT_READ,
    ORG_PERMISSION.PROMPT_UPDATE,
    ORG_PERMISSION.PROMPT_DELETE,
    ORG_PERMISSION.PROMPT_PUBLISH,
    ORG_PERMISSION.SETTINGS_READ,
    ORG_PERMISSION.SETTINGS_UPDATE,
    ORG_PERMISSION.BILLING_READ,
  ],
  [ORG_ROLE.MANAGER]: [
    ORG_PERMISSION.MEMBER_READ,
    ORG_PERMISSION.PROJECT_CREATE,
    ORG_PERMISSION.PROJECT_READ,
    ORG_PERMISSION.PROJECT_UPDATE,
    ORG_PERMISSION.PROJECT_DELETE,
    ORG_PERMISSION.PROMPT_CREATE,
    ORG_PERMISSION.PROMPT_READ,
    ORG_PERMISSION.PROMPT_UPDATE,
    ORG_PERMISSION.PROMPT_DELETE,
    ORG_PERMISSION.PROMPT_PUBLISH,
    ORG_PERMISSION.SETTINGS_READ,
  ],
  [ORG_ROLE.MEMBER]: [
    ORG_PERMISSION.PROMPT_CREATE,
    ORG_PERMISSION.PROMPT_READ,
    ORG_PERMISSION.PROMPT_UPDATE,
    ORG_PERMISSION.PROJECT_READ,
  ],
  [ORG_ROLE.VIEWER]: [
    ORG_PERMISSION.PROMPT_READ,
    ORG_PERMISSION.PROJECT_READ,
  ],
};

// ============================================================
// 4️⃣ Helper Functions (دوال مساعدة)
// ============================================================

/**
 * التحقق مما إذا كان الدور يمتلك صلاحية معينة
 * @param role - دور المستخدم
 * @param permission - الصلاحية المطلوبة
 * @returns `true` إذا كان الدور يمتلك الصلاحية
 */
export const hasPermission = (role: OrgRole, permission: OrgPermission): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * الحصول على جميع صلاحيات دور معين
 * @param role - دور المستخدم
 * @returns قائمة الصلاحيات
 */
export const getPermissionsForRole = (role: OrgRole): OrgPermission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * التحقق مما إذا كان الدور يمتلك جميع الصلاحيات المطلوبة
 * @param role - دور المستخدم
 * @param permissions - قائمة الصلاحيات المطلوبة
 * @returns `true` إذا كان الدور يمتلك جميع الصلاحيات
 */
export const hasAllPermissions = (role: OrgRole, permissions: OrgPermission[]): boolean => {
  return permissions.every((p) => hasPermission(role, p));
};

/**
 * التحقق مما إذا كان الدور يمتلك أي من الصلاحيات المطلوبة
 * @param role - دور المستخدم
 * @param permissions - قائمة الصلاحيات المطلوبة
 * @returns `true` إذا كان الدور يمتلك أي من الصلاحيات
 */
export const hasAnyPermission = (role: OrgRole, permissions: OrgPermission[]): boolean => {
  return permissions.some((p) => hasPermission(role, p));
};

/**
 * الحصول على جميع الأدوار
 * @returns قائمة الأدوار
 */
export const getAllRoles = (): OrgRole[] => {
  return Object.values(ORG_ROLE);
};

/**
 * الحصول على جميع الصلاحيات
 * @returns قائمة الصلاحيات
 */
export const getAllPermissions = (): OrgPermission[] => {
  return Object.values(ORG_PERMISSION);
};

// ============================================================
// 5️⃣ Role Hierarchy (تسلسل الأدوار)
// ============================================================

/**
 * ترتيب الأدوار (من الأعلى إلى الأقل)
 */
export const ROLE_HIERARCHY: Record<OrgRole, number> = {
  [ORG_ROLE.OWNER]: 5,
  [ORG_ROLE.ADMIN]: 4,
  [ORG_ROLE.MANAGER]: 3,
  [ORG_ROLE.MEMBER]: 2,
  [ORG_ROLE.VIEWER]: 1,
};

/**
 * التحقق مما إذا كان دور أعلى من دور آخر
 * @param role1 - الدور الأول
 * @param role2 - الدور الثاني
 * @returns `true` إذا كان الدور الأول أعلى من الثاني
 */
export const isHigherRole = (role1: OrgRole, role2: OrgRole): boolean => {
  return (ROLE_HIERARCHY[role1] || 0) > (ROLE_HIERARCHY[role2] || 0);
};

/**
 * التحقق مما إذا كان دور مساوياً أو أعلى من دور آخر
 * @param role1 - الدور الأول
 * @param role2 - الدور الثاني
 * @returns `true` إذا كان الدور الأول مساوياً أو أعلى
 */
export const isSameOrHigherRole = (role1: OrgRole, role2: OrgRole): boolean => {
  return (ROLE_HIERARCHY[role1] || 0) >= (ROLE_HIERARCHY[role2] || 0);
};

// ============================================================
// 6️⃣ Default Role (الدور الافتراضي)
// ============================================================

/**
 * الدور الافتراضي للمستخدمين الجدد في المؤسسة
 */
export const DEFAULT_ORG_ROLE = ORG_ROLE.MEMBER;

/**
 * الدور الافتراضي للقائمين على المؤسسة
 */
export const DEFAULT_OWNER_ROLE = ORG_ROLE.OWNER;