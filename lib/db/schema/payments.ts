import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  razorpayOrderId: varchar("razorpay_order_id", { length: 100 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 100 }),
  razorpaySignature: varchar("razorpay_signature", { length: 255 }),
  method: varchar("method", { length: 50 }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 5 }).notNull().default("INR"),
  status: varchar("status", { length: 30 }).notNull(),
  refundId: varchar("refund_id", { length: 100 }),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
