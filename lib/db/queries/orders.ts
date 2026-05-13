import "server-only";
import { db } from "@/lib/db";
import { orders, orderItems, addresses, payments, productVariants } from "@/lib/db/schema";
import { eq, desc, and, sql, gte, lte, count, sum } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils/order-number";

interface CreateOrderInput {
  userId?: string;
  email: string;
  subtotal: string;
  discountAmount?: string;
  shippingAmount: string;
  taxAmount?: string;
  total: string;
  shippingMethod?: string;
  couponCode?: string;
  isGift?: boolean;
  giftMessage?: string;
  items: {
    variantId: string;
    productName: string;
    variantName: string;
    sku: string;
    imageUrl?: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }[];
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
}

export async function createOrder(input: CreateOrderInput) {
  const orderNumber = await generateOrderNumber();

  return db.transaction(async (tx) => {
    // Create order
    const [order] = await tx
      .insert(orders)
      .values({
        orderNumber,
        userId: input.userId,
        email: input.email,
        subtotal: input.subtotal,
        discountAmount: input.discountAmount || "0",
        shippingAmount: input.shippingAmount,
        taxAmount: input.taxAmount || "0",
        total: input.total,
        status: "pending",
        shippingMethod: input.shippingMethod,
        couponCode: input.couponCode,
        isGift: input.isGift || false,
        giftMessage: input.giftMessage,
      } as typeof orders.$inferInsert)
      .returning();

    // Create order items
    await tx.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        sku: item.sku,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      }))
    );

    // Create shipping address
    await tx.insert(addresses).values({
      userId: input.userId,
      orderId: order.id,
      firstName: input.shippingAddress.firstName,
      lastName: input.shippingAddress.lastName,
      phone: input.shippingAddress.phone,
      line1: input.shippingAddress.line1,
      line2: input.shippingAddress.line2,
      city: input.shippingAddress.city,
      state: input.shippingAddress.state,
      pinCode: input.shippingAddress.pinCode,
    });

    // Deduct stock
    for (const item of input.items) {
      await tx
        .update(productVariants)
        .set({
          stockQty: sql`${productVariants.stockQty} - ${item.quantity}`,
        })
        .where(eq(productVariants.id, item.variantId));
    }

    return order;
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: {
      items: true,
      addresses: true,
      payment: true,
      user: true,
    },
  });
}

export async function getUserOrders(userId: string, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;

  const [data, [{ total }]] = await Promise.all([
    db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: { items: true },
      orderBy: desc(orders.createdAt),
      limit: perPage,
      offset,
    }),
    db.select({ total: count() }).from(orders).where(eq(orders.userId, userId)),
  ]);

  return { orders: data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  extra?: { trackingNumber?: string; trackingUrl?: string; adminNotes?: string; cancelReason?: string }
) {
  const updates: Record<string, unknown> = { status, updatedAt: new Date() };

  if (status === "confirmed") updates.confirmedAt = new Date();
  if (status === "dispatched") updates.dispatchedAt = new Date();
  if (status === "delivered") updates.deliveredAt = new Date();
  if (extra?.trackingNumber) updates.trackingNumber = extra.trackingNumber;
  if (extra?.trackingUrl) updates.trackingUrl = extra.trackingUrl;
  if (extra?.adminNotes) updates.adminNotes = extra.adminNotes;
  if (extra?.cancelReason) updates.cancelReason = extra.cancelReason;

  const [updated] = await db.update(orders).set(updates).where(eq(orders.id, orderId)).returning();
  return updated;
}

export async function getAllOrders(page = 1, perPage = 20, status?: string) {
  const offset = (page - 1) * perPage;
  const conditions = status ? eq(orders.status, status) : undefined;

  const [data, [{ total }]] = await Promise.all([
    db.query.orders.findMany({
      where: conditions,
      with: { items: true, user: true },
      orderBy: desc(orders.createdAt),
      limit: perPage,
      offset,
    }),
    db.select({ total: count() }).from(orders).where(conditions),
  ]);

  return { orders: data, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}
