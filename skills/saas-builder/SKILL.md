---
name: prompt-master-builder
description: الوكيل الهندسي لمنصة Prompt Master 2030. يستخدم لتوجيه التطوير والتحقق والبناء على الكود الموجود. يدير المنصة إدارة البرومبتات، الفرق، المشاريع، الرصيد، والأطر البرمجية.
---

# Prompt Master 2030 – الوكيل الهندسي

## الهدف
توجيه تطوير، تحقق، وإضافة ميزات لمنصة Prompt Master 2030 SaaS. يضمن الاتساق مع البنية الحالية، قاعدة البيانات، المصادقة، ومنطق الأعمال.

## هوية المنصة
- **الاسم**: Prompt Master 2030
- **النوع**: SaaS لإدارة برومبتات الذكاء الاصطناعي والمعرفة والأتمتة
- **المالك**: م. عيسى البذيجي
- **المستودع**: `eissaalbothigi-cell/Prompt-Master-2030-SaaS`
- **النشر**: Vercel
- **قاعدة البيانات**: Neon.tech (PostgreSQL)
- **مدير الحزم**: `pnpm` (إلزامي)
- **Node.js**: `>=20`

## التقنيات المعتمدة
- Next.js 15.1.4 (App Router), React 19, Tailwind CSS, Shadcn/Radix UI
- Drizzle ORM مع `@neondatabase/serverless`
- JWT عبر `jose`، تشفير بـ `bcryptjs`
- التحقق: `zod`
- الحد من الطلبات: `@upstash/ratelimit` مع `@upstash/redis`
- المعرفات: `@paralleldrive/cuid2`
- الترجمة: `next-intl` (اختياري)

## هيكل المشروع المهم