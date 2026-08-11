import { db } from "@/lib/db";
import { auditLogs } from "@/db/schema";

interface AuditLogInput {
  action: string;
  userId: string;
  metadata?: Record<string, any>;
}

export async function auditLog({ action, userId, metadata = {} }: AuditLogInput) {
  try {
    await db.insert(auditLogs).values({
      action,
      userId,
      metadata,
      ipAddress: null, // يمكن استخراجه من الطلب
      userAgent: null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
