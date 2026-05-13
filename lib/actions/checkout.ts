"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { createOrder } from "@/lib/db/queries/orders";
import { clearCart, getCartWithItems } from "@/lib/db/queries/cart";
import { productVariants, discountCodes } from "@/lib/db/schema";
import { eq, and, gt, or, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { checkoutRateLimit } from "@/lib/redis/ratelimit";
import { sendOrderConfirmationEmail } from "@/lib/emails/resend";

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
    console.error("Checkout validation error:", e);
    return { error: "Validation failed. Please try again." };
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
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  const { success: rateLimitSuccess } = await checkoutRateLimit.limit(ip);
  
  if (!rateLimitSuccess) {
    return { error: "Too many checkout requests. Please try again later." };
  }

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

    let discountAmount = 0;
    if (input.couponCode) {
      const coupon = await db.query.discountCodes.findFirst({
        where: eq(discountCodes.code, input.couponCode),
      });

      if (coupon && coupon.isActive) {
        // Validate expiry
        const now = new Date();
        const isValidExpiry = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
        
        // Validate limits
        const isValidUsage = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
        const isValidMinOrder = !coupon.minOrderValue || subtotal >= parseFloat(coupon.minOrderValue.toString());

        if (isValidExpiry && isValidUsage && isValidMinOrder) {
          if (coupon.type === "percentage") {
            discountAmount = subtotal * (parseFloat(coupon.value.toString()) / 100);
          } else if (coupon.type === "fixed") {
            discountAmount = parseFloat(coupon.value.toString());
          }
          // Cap discount to subtotal
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }
    }

    const shippingAmount = input.shippingMethod === "express" ? 149 : subtotal >= 999 ? 0 : 79;
    const total = subtotal - discountAmount + shippingAmount;

    const order = await createOrder({
      userId: session.user.id,
      email: input.email,
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
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

    // Fire-and-forget: send order confirmation email
    sendOrderConfirmationEmail(input.email, {
      orderNumber: order.orderNumber,
      customerName: `${input.shippingAddress.firstName} ${input.shippingAddress.lastName}`,
      total: total.toFixed(2),
      items: orderItems.map((item) => ({
        name: item.productName,
        variant: item.variantName,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    }).catch((err) => console.error("Order confirmation email failed:", err));

    return { success: true, orderNumber: order.orderNumber, orderId: order.id };
  } catch (e: unknown) {
    console.error("Order creation error:", e);
    return { error: "Order creation failed. Please contact support if the issue persists." };
  }
}

export async function validateCouponAction(code: string, cartTotal: number) {
  try {
    const coupon = await db.query.discountCodes.findFirst({
      where: eq(discountCodes.code, code.toUpperCase()),
    });

    if (!coupon) {
      return { error: "Invalid coupon code." };
    }

    if (!coupon.isActive) {
      return { error: "This coupon is no longer active." };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { error: "This coupon has expired." };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { error: "This coupon has reached its usage limit." };
    }

    if (coupon.minOrderValue && cartTotal < parseFloat(coupon.minOrderValue.toString())) {
      return { error: `Minimum order value of ₹${coupon.minOrderValue} required.` };
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = cartTotal * (parseFloat(coupon.value.toString()) / 100);
    } else if (coupon.type === "fixed") {
      discountAmount = parseFloat(coupon.value.toString());
    }

    // Cap at cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return { 
      success: true, 
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      } 
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { error: "Failed to validate coupon." };
  }
}
