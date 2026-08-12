import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums (أنواع محددة) ───
export const userRoleEnum = pgEnum("user_role", ["admin", "user", "moderator"]);
export const orgRoleEnum = pgEnum("org_role", ["owner", "admin", "member"]);
export const orgPlanEnum = pgEnum("org_plan", ["free", "starter", "pro", "enterprise"]);
export const orgStatusEnum = pgEnum("org_status", ["active", "suspended", "inactive"]);
export const projectStatusEnum = pgEnum("project_status", ["active", "archived", "draft"]);
export const promptStatusEnum = pgEnum("prompt_status", ["draft", "published", "archived"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "completed", "cancelled", "refunded"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "refunded"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired", "trialing"]);
export const creditTypeEnum = pgEnum("credit_type", ["purchase", "usage", "refund", "bonus"]);
export const auditActionEnum = pgEnum("audit_action", [
  "create", "update", "delete", "login", "logout", 
  "export", "import", "payment", "api_call"
]);

// ─── 1. users (المستخدمين) ───
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    avatar: text("avatar"),
    role: userRoleEnum("role").default("user").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
    index("users_deleted_at_idx").on(table.deletedAt),
    index("users_created_at_idx").on(table.createdAt),
  ]
);

// ─── 2. sessions (الجلسات) ───
export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 512 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ]
);

// ─── 3. organizations (المنظمات) ───
export const organizations = pgTable(
  "organizations",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: orgPlanEnum("plan").default("free").notNull(),
    status: orgStatusEnum("status").default("active").notNull(),
    settings: jsonb("settings").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("organizations_slug_idx").on(table.slug),
    index("organizations_owner_id_idx").on(table.ownerId),
    index("organizations_plan_idx").on(table.plan),
    index("organizations_status_idx").on(table.status),
  ]
);

// ─── 4. organizationMembers (أعضاء المنظمة) ───
export const organizationMembers = pgTable(
  "organization_members",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: orgRoleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("org_members_unique_idx").on(table.orgId, table.userId),
    index("org_members_org_id_idx").on(table.orgId),
    index("org_members_user_id_idx").on(table.userId),
  ]
);

// ─── 5. projects (المشاريع) ───
export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: projectStatusEnum("status").default("active").notNull(),
    settings: jsonb("settings").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("projects_org_id_idx").on(table.orgId),
    index("projects_owner_id_idx").on(table.ownerId),
    index("projects_status_idx").on(table.status),
  ]
);

// ─── 6. promptFrameworks (إطارات الـ Prompt) ───
export const promptFrameworks = pgTable(
  "prompt_frameworks",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }),
    category: varchar("category", { length: 100 }),
    template: text("template"),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("frameworks_slug_idx").on(table.slug),
    index("frameworks_category_idx").on(table.category),
    index("frameworks_is_active_idx").on(table.isActive),
  ]
);

// ─── 7. prompts (الـ Prompts) ───
export const prompts = pgTable(
  "prompts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    content: text("content").notNull(),
    frameworkId: integer("framework_id").references(() => promptFrameworks.id, {
      onDelete: "set null",
    }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgId: integer("org_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    projectId: integer("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    isPublic: boolean("is_public").default(false).notNull(),
    status: promptStatusEnum("status").default("draft").notNull(),
    tags: jsonb("tags").default([]),
    metadata: jsonb("metadata").default({}),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("prompts_user_id_idx").on(table.userId),
    index("prompts_org_id_idx").on(table.orgId),
    index("prompts_framework_id_idx").on(table.frameworkId),
    index("prompts_project_id_idx").on(table.projectId),
    index("prompts_status_idx").on(table.status),
    index("prompts_is_public_idx").on(table.isPublic),
    index("prompts_deleted_at_idx").on(table.deletedAt),
    index("prompts_created_at_idx").on(table.createdAt),
  ]
);

// ─── 8. orders (الطلبات) ───
export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgId: integer("org_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    description: text("description"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_org_id_idx").on(table.orgId),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
  ]
);

// ─── 9. payments (المدفوعات) ───
export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    provider: varchar("provider", { length: 100 }).notNull(),
    providerPaymentId: varchar("provider_payment_id", { length: 255 }),
    status: paymentStatusEnum("status").default("pending").notNull(),
    receiptUrl: text("receipt_url"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    index("payments_provider_idx").on(table.provider),
    index("payments_status_idx").on(table.status),
    index("payments_created_at_idx").on(table.createdAt),
  ]
);

// ─── 10. subscriptions (الاشتراكات) ───
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    plan: orgPlanEnum("plan").default("free").notNull(),
    status: subscriptionStatusEnum("status").default("active").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    cancelAt: timestamp("cancel_at", { withTimezone: true }),
    autoRenew: boolean("auto_renew").default(true).notNull(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("subscriptions_org_id_idx").on(table.orgId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_end_date_idx").on(table.endDate),
  ]
);

// ─── 11. apiKeys (مفاتيح API) ───
export const apiKeys = pgTable(
  "api_keys",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    keyHash: varchar("key_hash", { length: 512 }).notNull().unique(),
    keyPrefix: varchar("key_prefix", { length: 20 }),
    orgId: integer("org_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permissions: jsonb("permissions").default([]),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("api_keys_org_id_idx").on(table.orgId),
    index("api_keys_user_id_idx").on(table.userId),
    index("api_keys_key_hash_idx").on(table.keyHash),
    index("api_keys_is_active_idx").on(table.isActive),
  ]
);

// ─── 12. rateLimits (حدود الاستخدام) ───
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: serial("id").primaryKey(),
    apiKeyId: integer("api_key_id")
      .notNull()
      .references(() => apiKeys.id, { onDelete: "cascade" }),
    endpoint: varchar("endpoint", { length: 500 }).notNull(),
    requestsCount: integer("requests_count").default(1).notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("rate_limits_api_key_id_idx").on(table.apiKeyId),
    index("rate_limits_endpoint_idx").on(table.endpoint),
    index("rate_limits_window_start_idx").on(table.windowStart),
  ]
);

// ─── 13. auditLogs (سجلات التدقيق) ───
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    orgId: integer("org_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    action: auditActionEnum("action").notNull(),
    entityType: varchar("entity_type", { length: 100 }),
    entityId: varchar("entity_id", { length: 255 }),
    description: text("description"),
    metadata: jsonb("metadata").default({}),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_org_id_idx").on(table.orgId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ]
);

// ─── 14. creditTransactions (معاملات الرصيد) ───
export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgId: integer("org_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    type: creditTypeEnum("type").notNull(),
    description: text("description"),
    balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }),
    referenceId: varchar("reference_id", { length: 255 }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("credit_tx_user_id_idx").on(table.userId),
    index("credit_tx_org_id_idx").on(table.orgId),
    index("credit_tx_type_idx").on(table.type),
    index("credit_tx_created_at_idx").on(table.createdAt),
  ]
);

// ═══════════════════════════════════════════
// العلاقات بين الجداول (Relations)
// ═══════════════════════════════════════════

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  organizations: many(organizations),
  orgMemberships: many(organizationMembers),
  projects: many(projects),
  prompts: many(prompts),
  orders: many(orders),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
  creditTransactions: many(creditTransactions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, { fields: [organizations.ownerId], references: [users.id] }),
  members: many(organizationMembers),
  projects: many(projects),
  prompts: many(prompts),
  orders: many(orders),
  subscriptions: many(subscriptions),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
  creditTransactions: many(creditTransactions),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.orgId],
    references: [organizations.id],
  }),
  user: one(users, { fields: [organizationMembers.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.orgId],
    references: [organizations.id],
  }),
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  prompts: many(prompts),
}));

export const promptFrameworksRelations = relations(promptFrameworks, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one }) => ({
  framework: one(promptFrameworks, {
    fields: [prompts.frameworkId],
    references: [promptFrameworks.id],
  }),
  user: one(users, { fields: [prompts.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [prompts.orgId],
    references: [organizations.id],
  }),
  project: one(projects, { fields: [prompts.projectId], references: [projects.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [orders.orgId],
    references: [organizations.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.orgId],
    references: [organizations.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [apiKeys.orgId],
    references: [organizations.id],
  }),
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
  rateLimits: many(rateLimits),
}));

export const rateLimitsRelations = relations(rateLimits, ({ one }) => ({
  apiKey: one(apiKeys, { fields: [rateLimits.apiKeyId], references: [apiKeys.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [auditLogs.orgId],
    references: [organizations.id],
  }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, { fields: [creditTransactions.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [creditTransactions.orgId],
    references: [organizations.id],
  }),
}));

// ═══════════════════════════════════════════
// الأنواع الجاهزة (Types)
// ═══════════════════════════════════════════
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type PromptFramework = typeof promptFrameworks.$inferSelect;
export type NewPromptFramework = typeof promptFrameworks.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
