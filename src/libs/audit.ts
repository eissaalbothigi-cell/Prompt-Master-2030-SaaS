import { db } from "@/lib/db";
import { auditLogs } from "@/models/schema";

export interface AuditLogInput {
  action: string;
  userId: string;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function auditLog({
  action,
  userId,
  metadata = {},
  ipAddress = null,
  userAgent = null,
}: AuditLogInput): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      action,
      userId,
      metadata,
      ipAddress,
      userAgent,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("[Audit] Failed to log action:", { action, userId, error });
  }
}

// دوال مساعدة لتسجيل أحداث شائعة
export async function auditLoginSuccess(userId: string, ipAddress?: string, userAgent?: string) {
  return auditLog({ action: "auth.login.success", userId, metadata: { method: "credentials" }, ipAddress, userAgent });
}

export async function auditLoginFailed(email: string, ipAddress?: string, userAgent?: string) {
  return auditLog({ action: "auth.login.failed", userId: "system", metadata: { email }, ipAddress, userAgent });
}

export async function auditUserRegistered(userId: string, email: string, ipAddress?: string, userAgent?: string) {
  return auditLog({ action: "auth.register.success", userId, metadata: { email }, ipAddress, userAgent });
}

export async function auditPromptCreated(userId: string, promptId: string, title: string) {
  return auditLog({ action: "prompts.create", userId, metadata: { promptId, title } });
}

export async function auditPromptUpdated(userId: string, promptId: string, title: string) {
  return auditLog({ action: "prompts.update", userId, metadata: { promptId, title } });
}

export async function auditPromptDeleted(userId: string, promptId: string, title: string) {
  return auditLog({ action: "prompts.delete", userId, metadata: { promptId, title } });
}

export default auditLog;