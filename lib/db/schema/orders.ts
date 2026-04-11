import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { productVariants } from "./products";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }).notNull(),

  // Amounts
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),

  status: varchar("status", { length: 30 }).notNull().default("pending"),

  shippingMethod: varchar("shipping_method", { length: 50 }),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  trackingUrl: text("tracking_url"),
  couponCode: varchar("coupon_code", { length: 50 }),

  // Gift options
  isGift: boolean("is_gift").notNull().default(false),
  giftMessage: varchar("gift_message", { length: 200 }),

  adminNotes: text("admin_notes"),
  cancelReason: varchar("cancel_reason", { length: 255 }),

  confirmedAt: timestamp("confirmed_at"),
  dispatchedAt: timestamp("dispatched_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),

  // Snapshot at time of purchase
  productName: varchar("product_name", { length: 255 }).notNull(),
  variantName: varchar("variant_name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  line2: varchar("line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pinCode: varchar("pin_code", { length: 10 }).notNull(),
  country: varchar("country", { length: 50 }).notNull().default("India"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
