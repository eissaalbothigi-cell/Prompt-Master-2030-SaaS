import { NextResponse } from "next/server";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await migrate(db, { migrationsFolder: "drizzle/migrations" });
    return NextResponse.json({ success: true, message: "Migration completed" });
  } catch (error: any) {
    console.error("[Migration] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}