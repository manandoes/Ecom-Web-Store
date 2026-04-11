import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: uuid("parent_id").references(
    (): AnyPgColumn => categories.id
  ),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
