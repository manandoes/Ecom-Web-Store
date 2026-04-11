import { relations } from "drizzle-orm";

// Re-export all tables
export { users, accounts, sessions } from "./users";
export { categories } from "./categories";
export { products, productImages, productVariants } from "./products";
export { carts, cartItems } from "./cart";
export { orders, orderItems, addresses } from "./orders";
export { payments } from "./payments";
export { reviews } from "./reviews";
export { wishlistItems } from "./wishlists";
export { discountCodes } from "./discounts";

// Import for relations
import { users, accounts, sessions } from "./users";
import { categories } from "./categories";
import { products, productImages, productVariants } from "./products";
import { carts, cartItems } from "./cart";
import { orders, orderItems, addresses } from "./orders";
import { payments } from "./payments";
import { reviews } from "./reviews";
import { wishlistItems } from "./wishlists";

// ── Relations ──────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  orders: many(orders),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
  addresses: many(addresses),
  carts: many(carts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    cartItems: many(cartItems),
    orderItems: many(orderItems),
  })
);

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payment: many(payments),
  addresses: many(addresses),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
  order: one(orders, { fields: [addresses.orderId], references: [orders.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));
