"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { createOrder } from "@/lib/db/queries/orders";
import { clearCart, getCartWithItems } from "@/lib/db/queries/cart";
import { productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function validateCheckoutAction(formData: {
  email: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to checkout" };
  }

  try {
    const cart = await getCartWithItems(session.user.id);
    if (!cart || cart.items.length === 0) {
      return { error: "Your cart is empty" };
    }

    // Stock validation
    for (const item of cart.items) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantId),
      });
      if (!variant || variant.stockQty < item.quantity) {
        return {
          error: `Insufficient stock for ${item.variant?.product?.name || "an item"}`,
        };
      }
    }

    return { success: true, valid: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Validation failed" };
  }
}

export async function createOrderAction(input: {
  email: string;
  shippingMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  couponCode?: string;
  isGift?: boolean;
  giftMessage?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to checkout" };
  }

  try {
    const cart = await getCartWithItems(session.user.id);
    if (!cart || cart.items.length === 0) {
      return { error: "Your cart is empty" };
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const unitPrice = parseFloat(item.variant.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        variantId: item.variantId,
        productName: item.variant.product.name,
        variantName: item.variant.name,
        sku: item.variant.sku,
        imageUrl: item.variant.product.images?.[0]?.url,
        unitPrice: unitPrice.toFixed(2),
        quantity: item.quantity,
        lineTotal: lineTotal.toFixed(2),
      };
    });

    const shippingAmount = input.shippingMethod === "express" ? 149 : subtotal >= 999 ? 0 : 79;
    const total = subtotal + shippingAmount;

    const order = await createOrder({
      userId: session.user.id,
      email: input.email,
      subtotal: subtotal.toFixed(2),
      shippingAmount: shippingAmount.toFixed(2),
      total: total.toFixed(2),
      shippingMethod: input.shippingMethod,
      couponCode: input.couponCode,
      isGift: input.isGift,
      giftMessage: input.giftMessage,
      items: orderItems,
      shippingAddress: input.shippingAddress,
    });

    // Clear the cart
    await clearCart(session.user.id);

    return { success: true, orderNumber: order.orderNumber, orderId: order.id };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Order creation failed" };
  }
}
