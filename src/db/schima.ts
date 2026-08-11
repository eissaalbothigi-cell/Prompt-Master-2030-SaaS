import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "admin", "superadmin"]);
export const subscriptionEnum = pgEnum("subscription_status", ["active", "cancelled", "past_due", "trialing"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
}, (table) => ({
  emailIdx: sql`CREATE INDEX IF NOT EXISTS users_email_idx ON ${table} (email)`,
  roleIdx: sql`CREATE INDEX IF NOT EXISTS users_role_idx ON ${table} (role)`,
}));

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").default([]).$type<string[]>(),
  isPublic: boolean("is_public").default(false).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
}, (table) => ({
  userIdx: sql`CREATE INDEX IF NOT EXISTS prompts_user_id_idx ON ${table} (user_id)`,
  categoryIdx: sql`CREATE INDEX IF NOT EXISTS prompts_category_idx ON ${table} (category)`,
  publicIdx: sql`CREATE INDEX IF NOT EXISTS prompts_is_public_idx ON ${table} (is_public)`,
  deletedIdx: sql`CREATE INDEX IF NOT EXISTS prompts_is_deleted_idx ON ${table} (is_deleted)`,
}));

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  metadata: jsonb("metadata").default({}),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  actionIdx: sql`CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON ${table} (action)`,
  userIdx: sql`CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON ${table} (user_id)`,
  createdIdx: sql`CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON ${table} (created_at)`,
}));

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  status: subscriptionEnum("status").default("trialing").notNull(),
  priceId: varchar("price_id", { length: 255 }),
  currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).unique(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: text("key_hash").notNull(),
  lastFour: varchar("last_four", { length: 4 }),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const rateLimits = pgTable("rate_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull().unique(),
  count: integer("count").default(0).notNull(),
  resetAt: timestamp("reset_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
