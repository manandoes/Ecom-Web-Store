import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (t) => [unique("unique_user_product_wishlist").on(t.userId, t.productId)]
);
