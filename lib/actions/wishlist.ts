"use server";

import { auth } from "@/lib/auth/config";
import { toggleWishlistItem, removeFromWishlist } from "@/lib/db/queries/wishlists";
import { revalidatePath } from "next/cache";

export async function toggleWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to use wishlist" };
  }

  try {
    const result = await toggleWishlistItem(session.user.id, productId);
    revalidatePath("/account/wishlist");
    return { success: true, ...result };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to update wishlist" };
  }
}

export async function removeFromWishlistAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in" };
  }

  try {
    await removeFromWishlist(session.user.id, productId);
    revalidatePath("/account/wishlist");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to remove from wishlist" };
  }
}
