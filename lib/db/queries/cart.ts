import "server-only";
import { db } from "@/lib/db";
import { carts, cartItems, productVariants, products, productImages } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getOrCreateCart(userId: string) {
  const existing = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: {
                with: { images: true },
              },
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  const [newCart] = await db.insert(carts).values({ userId }).returning();
  return { ...newCart, items: [] };
}

export async function getCartWithItems(userId: string) {
  return db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: {
                with: { images: { limit: 1 } },
              },
            },
          },
        },
      },
    },
  });
}

export async function addToCart(userId: string, variantId: string, quantity: number = 1) {
  const cart = await getOrCreateCart(userId);

  // Check stock
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
  });
  if (!variant || variant.stockQty < quantity) {
    throw new Error("Insufficient stock");
  }

  // Upsert cart item
  const existing = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variantId)),
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > variant.stockQty) throw new Error("Insufficient stock");
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      variantId,
      quantity,
    });
  }

  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
  return getCartWithItems(userId);
}

export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  });
  if (!cart) throw new Error("Cart not found");

  const item = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)),
    with: { variant: true },
  });
  if (!item) throw new Error("Item not found");

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    if (quantity > item.variant.stockQty) throw new Error("Insufficient stock");
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  }

  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
  return getCartWithItems(userId);
}

export async function removeCartItem(userId: string, itemId: string) {
  return updateCartItemQuantity(userId, itemId, 0);
}

export async function clearCart(userId: string) {
  const cart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
  });
  if (!cart) return;

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
}
