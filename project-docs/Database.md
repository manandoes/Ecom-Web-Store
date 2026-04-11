# Database Design
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11  
**Database:** JioBase (PostgreSQL-compatible) · ORM: Drizzle

---

## 1. Overview

JioBase is a managed PostgreSQL-compatible database. All schema definitions use **Drizzle ORM** with TypeScript for full type safety. Migrations are managed with `drizzle-kit`.

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    users     │◄───│   orders     │───►│ order_items  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  addresses   │    │  payments    │    │   variants   │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
┌──────────────┐    ┌──────────────┐    ┌──────▼───────┐
│  wishlists   │    │   reviews    │    │   products   │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                                        ┌──────▼───────┐
                                        │  categories  │
                                        └──────────────┘
```

---

## 2. Schema Definitions (Drizzle ORM)

### 2.1 Users

```typescript
// schema/users.ts
import { pgTable, uuid, varchar, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:              uuid('id').defaultRandom().primaryKey(),
  email:           varchar('email', { length: 255 }).notNull().unique(),
  emailVerified:   timestamp('email_verified'),
  passwordHash:    varchar('password_hash', { length: 255 }),  // null for OAuth users
  name:            varchar('name', { length: 100 }).notNull(),
  avatarUrl:       text('avatar_url'),
  role:            varchar('role', { length: 20 }).notNull().default('customer'),  // 'customer' | 'admin'
  phone:           varchar('phone', { length: 20 }),
  marketingOptIn:  boolean('marketing_opt_in').notNull().default(false),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id:                uuid('id').defaultRandom().primaryKey(),
  userId:            uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider:          varchar('provider', { length: 50 }).notNull(),  // 'google' | 'credentials'
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken:       text('access_token'),
  refreshToken:      text('refresh_token'),
  expiresAt:         timestamp('expires_at'),
});

export const sessions = pgTable('sessions', {
  id:           uuid('id').defaultRandom().primaryKey(),
  userId:       uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  expiresAt:    timestamp('expires_at').notNull(),
});
```

### 2.2 Categories

```typescript
// schema/categories.ts
export const categories = pgTable('categories', {
  id:          uuid('id').defaultRandom().primaryKey(),
  name:        varchar('name', { length: 100 }).notNull(),
  slug:        varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description'),
  imageUrl:    text('image_url'),
  parentId:    uuid('parent_id').references((): AnyPgColumn => categories.id),
  sortOrder:   integer('sort_order').notNull().default(0),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
});
```

### 2.3 Products

```typescript
// schema/products.ts
export const products = pgTable('products', {
  id:           uuid('id').defaultRandom().primaryKey(),
  categoryId:   uuid('category_id').references(() => categories.id),
  name:         varchar('name', { length: 255 }).notNull(),
  slug:         varchar('slug', { length: 280 }).notNull().unique(),
  description:  text('description'),
  shortDesc:    varchar('short_desc', { length: 500 }),

  // Scent profile
  scentFamily:  varchar('scent_family', { length: 50 }),  // 'floral' | 'woody' | 'fresh' | 'spicy' | 'citrus'
  topNotes:     text('top_notes'),
  middleNotes:  text('middle_notes'),
  baseNotes:    text('base_notes'),

  // Physical details
  waxType:      varchar('wax_type', { length: 50 }),      // 'soy' | 'coconut' | 'beeswax' | 'paraffin'
  wickType:     varchar('wick_type', { length: 50 }),
  burnTime:     varchar('burn_time', { length: 50 }),     // e.g. "40-50 hours"

  // Pricing (base / default variant)
  basePrice:    numeric('base_price', { precision: 10, scale: 2 }).notNull(),

  // Status
  status:       varchar('status', { length: 20 }).notNull().default('draft'),  // 'draft' | 'active' | 'archived'
  isFeatured:   boolean('is_featured').notNull().default(false),
  tags:         text('tags').array(),

  // SEO
  metaTitle:    varchar('meta_title', { length: 70 }),
  metaDesc:     varchar('meta_desc', { length: 160 }),

  // Stats (denormalised for performance)
  totalSold:    integer('total_sold').notNull().default(0),
  avgRating:    numeric('avg_rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount:  integer('review_count').notNull().default(0),

  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
});

export const productImages = pgTable('product_images', {
  id:         uuid('id').defaultRandom().primaryKey(),
  productId:  uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url:        text('url').notNull(),
  altText:    varchar('alt_text', { length: 255 }),
  sortOrder:  integer('sort_order').notNull().default(0),
  isPrimary:  boolean('is_primary').notNull().default(false),
});

export const productVariants = pgTable('product_variants', {
  id:         uuid('id').defaultRandom().primaryKey(),
  productId:  uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name:       varchar('name', { length: 100 }).notNull(),  // e.g. "4oz"
  sku:        varchar('sku', { length: 100 }).notNull().unique(),
  price:      numeric('price', { precision: 10, scale: 2 }).notNull(),
  stockQty:   integer('stock_qty').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  weight:     numeric('weight', { precision: 6, scale: 2 }),  // grams
  sortOrder:  integer('sort_order').notNull().default(0),
  isActive:   boolean('is_active').notNull().default(true),
});
```

### 2.4 Cart

```typescript
// schema/cart.ts
// Guest carts are stored in Redis (TTL 7 days). DB cart for logged-in users.

export const carts = pgTable('carts', {
  id:        uuid('id').defaultRandom().primaryKey(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cartItems = pgTable('cart_items', {
  id:        uuid('id').defaultRandom().primaryKey(),
  cartId:    uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity:  integer('quantity').notNull().default(1),
  addedAt:   timestamp('added_at').notNull().defaultNow(),
}, (t) => ({
  uniqueCartVariant: unique().on(t.cartId, t.variantId),
}));
```

### 2.5 Orders

```typescript
// schema/orders.ts
export const orders = pgTable('orders', {
  id:              uuid('id').defaultRandom().primaryKey(),
  orderNumber:     varchar('order_number', { length: 30 }).notNull().unique(),  // e.g. "LC-2026-00042"
  userId:          uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  email:           varchar('email', { length: 255 }).notNull(),  // preserved for guest orders

  // Amounts (in INR paise or rupees — rupees with 2dp)
  subtotal:        numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountAmount:  numeric('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  shippingAmount:  numeric('shipping_amount', { precision: 10, scale: 2 }).notNull(),
  taxAmount:       numeric('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  total:           numeric('total', { precision: 10, scale: 2 }).notNull(),

  status:          varchar('status', { length: 30 }).notNull().default('pending'),
  // 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'completed'
  // | 'cancelled' | 'refund_requested' | 'refunded'

  shippingMethod:  varchar('shipping_method', { length: 50 }),  // 'standard' | 'express'
  trackingNumber:  varchar('tracking_number', { length: 100 }),
  trackingUrl:     text('tracking_url'),
  couponCode:      varchar('coupon_code', { length: 50 }),

  // Gift options
  isGift:          boolean('is_gift').notNull().default(false),
  giftMessage:     varchar('gift_message', { length: 200 }),

  adminNotes:      text('admin_notes'),
  cancelReason:    varchar('cancel_reason', { length: 255 }),

  confirmedAt:     timestamp('confirmed_at'),
  dispatchedAt:    timestamp('dispatched_at'),
  deliveredAt:     timestamp('delivered_at'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id:          uuid('id').defaultRandom().primaryKey(),
  orderId:     uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId:   uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),

  // Snapshot at time of purchase (variant may change later)
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantName: varchar('variant_name', { length: 100 }).notNull(),
  sku:         varchar('sku', { length: 100 }).notNull(),
  imageUrl:    text('image_url'),
  unitPrice:   numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity:    integer('quantity').notNull(),
  lineTotal:   numeric('line_total', { precision: 10, scale: 2 }).notNull(),
});

export const addresses = pgTable('addresses', {
  id:         uuid('id').defaultRandom().primaryKey(),
  userId:     uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  orderId:    uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),  // snapshot
  firstName:  varchar('first_name', { length: 80 }).notNull(),
  lastName:   varchar('last_name', { length: 80 }).notNull(),
  phone:      varchar('phone', { length: 20 }).notNull(),
  line1:      varchar('line1', { length: 255 }).notNull(),
  line2:      varchar('line2', { length: 255 }),
  city:       varchar('city', { length: 100 }).notNull(),
  state:      varchar('state', { length: 100 }).notNull(),
  pinCode:    varchar('pin_code', { length: 10 }).notNull(),
  country:    varchar('country', { length: 50 }).notNull().default('India'),
  isDefault:  boolean('is_default').notNull().default(false),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
});
```

### 2.6 Payments

```typescript
// schema/payments.ts
export const payments = pgTable('payments', {
  id:                uuid('id').defaultRandom().primaryKey(),
  orderId:           uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  razorpayOrderId:   varchar('razorpay_order_id', { length: 100 }),
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 100 }),
  razorpaySignature: varchar('razorpay_signature', { length: 255 }),
  method:            varchar('method', { length: 50 }),  // 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  amount:            numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency:          varchar('currency', { length: 5 }).notNull().default('INR'),
  status:            varchar('status', { length: 30 }).notNull(),  // 'created' | 'captured' | 'failed' | 'refunded'
  refundId:          varchar('refund_id', { length: 100 }),
  refundAmount:      numeric('refund_amount', { precision: 10, scale: 2 }),
  metadata:          jsonb('metadata'),
  createdAt:         timestamp('created_at').notNull().defaultNow(),
});
```

### 2.7 Reviews, Wishlists, Discounts

```typescript
// schema/reviews.ts
export const reviews = pgTable('reviews', {
  id:          uuid('id').defaultRandom().primaryKey(),
  productId:   uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating:      integer('rating').notNull(),  // 1–5
  title:       varchar('title', { length: 100 }),
  body:        text('body'),
  ownerReply:  text('owner_reply'),
  helpfulCount: integer('helpful_count').notNull().default(0),
  status:      varchar('status', { length: 20 }).notNull().default('published'), // 'pending' | 'published' | 'flagged'
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  uniqueUserProduct: unique().on(t.userId, t.productId),
}));

// schema/wishlists.ts
export const wishlistItems = pgTable('wishlist_items', {
  id:         uuid('id').defaultRandom().primaryKey(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId:  uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt:    timestamp('added_at').notNull().defaultNow(),
}, (t) => ({
  uniqueUserProduct: unique().on(t.userId, t.productId),
}));

// schema/discounts.ts
export const discountCodes = pgTable('discount_codes', {
  id:               uuid('id').defaultRandom().primaryKey(),
  code:             varchar('code', { length: 50 }).notNull().unique(),
  type:             varchar('type', { length: 20 }).notNull(),  // 'percentage' | 'fixed'
  value:            numeric('value', { precision: 10, scale: 2 }).notNull(),
  minOrderValue:    numeric('min_order_value', { precision: 10, scale: 2 }).default('0'),
  maxUses:          integer('max_uses'),  // null = unlimited
  maxUsesPerUser:   integer('max_uses_per_user').default(1),
  usedCount:        integer('used_count').notNull().default(0),
  isActive:         boolean('is_active').notNull().default(true),
  expiresAt:        timestamp('expires_at'),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
});
```

---

## 3. Indexes

```sql
-- Products
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_scent_family ON products(scent_family);
CREATE INDEX idx_products_slug ON products(slug);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Cart Items
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Wishlist
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
```

---

## 4. Redis (Upstash) Usage

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `cart:guest:{sessionId}` | 7 days | Guest cart (JSON array of items) |
| `otp:verify:{email}` | 10 min | Email verification OTP |
| `otp:reset:{email}` | 1 hour | Password reset token |
| `rate:checkout:{ip}` | 1 min | Checkout rate limiter |
| `rate:auth:{ip}` | 15 min | Login brute force protection |
| `stock:lock:{variantId}` | 10 sec | Optimistic stock lock during checkout |
| `session:{sessionToken}` | 30 days | Auth.js session cache |

---

## 5. Migrations

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate

# Push schema directly (dev only)
npx drizzle-kit push

# Inspect live DB
npx drizzle-kit studio
```

---

## 6. Naming Conventions

- Tables: `snake_case` plural nouns (`order_items`, `product_variants`)
- Columns: `snake_case` (`created_at`, `user_id`)
- Indexes: `idx_{table}_{column(s)}`
- Foreign keys: `{referenced_table_singular}_id`
- All primary keys: UUID v4 (`defaultRandom()`)
- Timestamps: `created_at` and `updated_at` on every table
