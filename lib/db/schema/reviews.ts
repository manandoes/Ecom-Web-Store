import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 100 }),
    body: text("body"),
    ownerReply: text("owner_reply"),
    helpfulCount: integer("helpful_count").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [unique("unique_user_product_review").on(t.userId, t.productId)]
);
