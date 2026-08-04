import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// =============================================
// 1. جدول المستخدمين (ربط مع Clerk)
// =============================================
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  role: text('role').default('user').notNull(),
  credits: integer('credits').default(10).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================
// 2. جدول القوالب الأساسية (Prompt Frameworks)
// =============================================
export const promptFrameworks = pgTable('prompt_frameworks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  icon: varchar('icon', { length: 10 }).default('📝'),
  description: text('description').notNull(),
  structure: jsonb('structure').notNull().$type<Record<string, string>>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================
// 3. جدول البرومبتات (المنشأة من قبل المستخدمين)
// =============================================
export const prompts = pgTable('prompts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: varchar('title', { length: 255 }).notNull(),
  frameworkId: integer('framework_id').references(() => promptFrameworks.id, { onDelete: 'set null' }),
  inputData: jsonb('input_data').notNull().$type<Record<string, string>>(),
  output: text('output'),
  status: varchar('status', { length: 20 }).default('draft'),
  isPublic: boolean('is_public').default(false),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  authorId: text('author_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================
// 4. جدول الطلبات/المشتريات
// =============================================
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  buyerId: text('buyer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  promptId: text('prompt_id').references(() => prompts.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: varchar('status', { length: 20 }).default('pending'),
  stripePaymentId: text('stripe_payment_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// =============================================
// 5. جدول سجل الأرصدة
// =============================================
export const creditTransactions = pgTable('credit_transactions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  description: text('description'),
  promptId: text('prompt_id').references(() => prompts.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =============================================
// العلاقات (Relations)
// =============================================
export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  orders: many(orders),
  transactions: many(creditTransactions),
}));

export const frameworksRelations = relations(promptFrameworks, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one }) => ({
  framework: one(promptFrameworks, {
    fields: [prompts.frameworkId],
    references: [promptFrameworks.id],
  }),
  author: one(users, {
    fields: [prompts.authorId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [orders.promptId],
    references: [prompts.id],
  }),
}));

export const transactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id],
  }),
}));

