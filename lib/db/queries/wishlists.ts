import "server-only";
import { db } from "@/lib/db";
import { wishlistItems, products, productImages, productVariants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserWishlist(userId: string) {
  return db.query.wishlistItems.findMany({
    where: eq(wishlistItems.userId, userId),
    with: {
      product: {
        with: {
          images: { limit: 1 },
          variants: true,
        },
      },
    },
    orderBy: (items, { desc }) => [desc(items.addedAt)],
  });
}

export async function toggleWishlistItem(userId: string, productId: string) {
  const existing = await db.query.wishlistItems.findFirst({
    where: and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)),
  });

  if (existing) {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, existing.id));
    return { added: false };
  }

  await db.insert(wishlistItems).values({ userId, productId });
  return { added: true };
}

export async function isInWishlist(userId: string, productId: string) {
  const item = await db.query.wishlistItems.findFirst({
    where: and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)),
  });
  return !!item;
}

export async function removeFromWishlist(userId: string, productId: string) {
  await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
}
