import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const discountCodes = pgTable("discount_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: numeric("min_order_value", { precision: 10, scale: 2 }).default("0"),
  maxUses: integer("max_uses"),
  maxUsesPerUser: integer("max_uses_per_user").default(1),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
