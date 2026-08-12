import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts } from "@/models/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { auditLog } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { getUserFromRequest } from "@/lib/session";

// ----------------------------------------------
// 1. التحقق من صحة المدخلات (Zod Schema)
// ----------------------------------------------
const createPromptSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  projectId: z.string().uuid().optional().nullable(),
});

// ----------------------------------------------
// 2. GET: جلب قائمة البرومبتات مع Pagination
// ----------------------------------------------
export async function GET(request: NextRequest) {
  try {
    // 2.1 التحقق من المصادقة
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2.2 استخراج معاملات Pagination والبحث
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const isPublic = searchParams.get("isPublic");

    const offset = (page - 1) * limit;

    // 2.3 بناء شروط الاستعلام
    let conditions = and(
      eq(prompts.isDeleted, false),
      or(
        eq(prompts.userId, user.userId),
        eq(prompts.isPublic, true)
      )
    );

    if (search) {
      conditions = and(
        conditions,
        or(
          ilike(prompts.title, `%${search}%`),
          ilike(prompts.content, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions = and(conditions, eq(prompts.category, category));
    }

    if (isPublic !== null) {
      conditions = and(conditions, eq(prompts.isPublic, isPublic === "true"));
    }

    // 2.4 تنفيذ الاستعلام
    const [items, total] = await Promise.all([
      db
        .select()
        .from(prompts)
        .where(conditions)
        .orderBy(desc(prompts.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(prompts)
        .where(conditions)
        .then((res) => Number(res[0]?.count || 0)),
    ]);

    // 2.5 تسجيل التدقيق
    await auditLog({
      action: "prompts.list",
      userId: user.userId,
      metadata: { page, limit, search, category },
    });

    return NextResponse.json({
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/prompts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------
// 3. POST: إنشاء برومبت جديد
// ----------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 3.1 التحقق من المصادقة
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3.2 التحقق من Rate Limit
    const rateLimitResult = await rateLimit({
      identifier: `prompt-create:${user.userId}`,
      maxRequests: 10,
      windowMs: 60 * 1000, // دقيقة واحدة
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // 3.3 قراءة وتحليل البيانات
    const body = await request.json();
    const validation = createPromptSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3.4 التحقق من ملكية المشروع (إن وجد)
    if (data.projectId) {
      const project = await db.query.projects.findFirst({
        where: (projects, { eq }) => eq(projects.id, data.projectId!),
      });
      if (!project || project.userId !== user.userId) {
        return NextResponse.json(
          { error: "Project not found or not owned by you" },
          { status: 403 }
        );
      }
    }

    // 3.5 إنشاء البرومبت في قاعدة البيانات
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        title: data.title,
        content: data.content,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        isPublic: data.isPublic,
        userId: user.userId,
        projectId: data.projectId || null,
      })
      .returning();

    // 3.6 تسجيل التدقيق
    await auditLog({
      action: "prompts.create",
      userId: user.userId,
      metadata: { promptId: newPrompt.id, title: newPrompt.title },
    });

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error("[POST /api/prompts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}