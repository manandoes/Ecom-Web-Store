import {
  pgTable,
  uuid,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { productVariants } from "./products";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (t) => [unique("unique_cart_variant").on(t.cartId, t.variantId)]
);
