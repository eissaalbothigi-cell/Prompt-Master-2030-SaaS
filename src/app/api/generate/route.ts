import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts } from "@/models/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auditLog } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { getUserFromRequest } from "@/lib/session";

// ----------------------------------------------
// 1. التحقق من صحة المدخلات (Zod Schema)
// ----------------------------------------------
const updatePromptSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  projectId: z.string().uuid().optional().nullable(),
});

// ----------------------------------------------
// 2. GET: جلب برومبت مفرد
// ----------------------------------------------
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 2.1 التحقق من المصادقة
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // 2.2 جلب البرومبت من قاعدة البيانات
    const [prompt] = await db
      .select()
      .from(prompts)
      .where(
        and(
          eq(prompts.id, id),
          eq(prompts.isDeleted, false),
          // المستخدم يرى فقط برومباته أو العامة
          (user.role === "admin") ? undefined : or(
            eq(prompts.userId, user.userId),
            eq(prompts.isPublic, true)
          )
        )
      )
      .limit(1);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found or access denied" },
        { status: 404 }
      );
    }

    // 2.3 تسجيل التدقيق (اختياري)
    await auditLog({
      action: "prompts.get",
      userId: user.userId,
      metadata: { promptId: id },
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("[GET /api/prompts/[id]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------
// 3. PUT: تحديث برومبت
// ----------------------------------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 3.1 التحقق من المصادقة
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // 3.2 التحقق من Rate Limit
    const rateLimitResult = await rateLimit({
      identifier: `prompt-update:${user.userId}`,
      maxRequests: 30,
      windowMs: 60 * 1000, // دقيقة واحدة
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    // 3.3 التحقق من وجود البرومبت وملكيته
    const [existingPrompt] = await db
      .select()
      .from(prompts)
      .where(
        and(
          eq(prompts.id, id),
          eq(prompts.isDeleted, false),
          eq(prompts.userId, user.userId)
        )
      )
      .limit(1);

    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt not found or you don't own it" },
        { status: 404 }
      );
    }

    // 3.4 قراءة وتحليل البيانات
    const body = await request.json();
    const validation = updatePromptSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3.5 التحقق من ملكية المشروع (إن وجد)
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

    // 3.6 تحديث البرومبت
    const [updatedPrompt] = await db
      .update(prompts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();

    // 3.7 تسجيل التدقيق
    await auditLog({
      action: "prompts.update",
      userId: user.userId,
      metadata: { promptId: id, changes: Object.keys(data) },
    });

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error("[PUT /api/prompts/[id]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------
// 4. DELETE: حذف برومبت (Soft Delete)
// ----------------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 4.1 التحقق من المصادقة
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // 4.2 التحقق من Rate Limit (أكثر صرامة للحذف)
    const rateLimitResult = await rateLimit({
      identifier: `prompt-delete:${user.userId}`,
      maxRequests: 10,
      windowMs: 60 * 1000, // دقيقة واحدة
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many delete requests. Please slow down." },
        { status: 429 }
      );
    }

    // 4.3 التحقق من وجود البرومبت وملكيته
    const [existingPrompt] = await db
      .select()
      .from(prompts)
      .where(
        and(
          eq(prompts.id, id),
          eq(prompts.isDeleted, false),
          eq(prompts.userId, user.userId)
        )
      )
      .limit(1);

    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt not found or you don't own it" },
        { status: 404 }
      );
    }

    // 4.4 تنفيذ الحذف المنطقي (Soft Delete)
    const [deletedPrompt] = await db
      .update(prompts)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where(eq(prompts.id, id))
      .returning();

    // 4.5 تسجيل التدقيق
    await auditLog({
      action: "prompts.delete",
      userId: user.userId,
      metadata: { promptId: id, title: existingPrompt.title },
    });

    return NextResponse.json({
      success: true,
      message: "Prompt deleted successfully",
      prompt: deletedPrompt,
    });
  } catch (error) {
    console.error("[DELETE /api/prompts/[id]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}