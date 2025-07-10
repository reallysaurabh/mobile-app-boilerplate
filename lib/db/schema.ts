import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

// Users table - will sync with Supabase Auth users when auth is implemented
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // This will match Supabase Auth user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; 