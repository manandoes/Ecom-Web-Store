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
import { categories } from "./categories";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 280 }).notNull().unique(),
  description: text("description"),
  shortDesc: varchar("short_desc", { length: 500 }),

  // Scent profile
  scentFamily: varchar("scent_family", { length: 50 }),
  topNotes: text("top_notes"),
  middleNotes: text("middle_notes"),
  baseNotes: text("base_notes"),

  // Physical details
  waxType: varchar("wax_type", { length: 50 }),
  wickType: varchar("wick_type", { length: 50 }),
  burnTime: varchar("burn_time", { length: 50 }),

  // Pricing (base / default variant)
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),

  // Status
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: text("tags").array(),

  // SEO
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDesc: varchar("meta_desc", { length: 160 }),

  // Stats (denormalised for performance)
  totalSold: integer("total_sold").notNull().default(0),
  avgRating: numeric("avg_rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQty: integer("stock_qty").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  weight: numeric("weight", { precision: 6, scale: 2 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});
