import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 100 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 20 }).notNull().default("customer"),
  phone: varchar("phone", { length: 20 }),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});
