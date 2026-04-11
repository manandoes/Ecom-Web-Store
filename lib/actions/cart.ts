"use server";

import { auth } from "@/lib/auth/config";
import { addToCart, updateCartItemQuantity, removeCartItem, clearCart, getCartWithItems } from "@/lib/db/queries/cart";
import { revalidatePath } from "next/cache";

export async function addToCartAction(variantId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to add items to your cart" };
  }

  try {
    const cart = await addToCart(session.user.id, variantId, quantity);
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to add to cart" };
  }
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in" };
  }

  try {
    const cart = await updateCartItemQuantity(session.user.id, itemId, quantity);
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to update cart" };
  }
}

export async function removeCartItemAction(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in" };
  }

  try {
    const cart = await removeCartItem(session.user.id, itemId);
    revalidatePath("/cart");
    return { success: true, cart };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to remove item" };
  }
}

export async function clearCartAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in" };
  }

  try {
    await clearCart(session.user.id);
    revalidatePath("/cart");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to clear cart" };
  }
}

export async function getServerCartAction() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getCartWithItems(session.user.id);
}
