import { NextRequest } from "next/server";
import { createHash, randomBytes } from "crypto";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export async function csrfProtection(req: NextRequest): Promise<{ valid: boolean }> {
  // Skip for GET/HEAD
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return { valid: true };
  }

  const csrfHeader = req.headers.get("x-csrf-token");
  const csrfCookie = req.cookies.get("csrf-token")?.value;

  if (!csrfHeader || !csrfCookie) {
    return { valid: false };
  }

  // Double-submit cookie pattern
  return { valid: csrfHeader === csrfCookie };
}
