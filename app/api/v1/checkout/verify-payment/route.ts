import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import crypto from "crypto";
import { db } from "@/lib/db";
import { payments, orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateOrderStatus } from "@/lib/db/queries/orders";
import { sendAdminOrderEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ourOrderId, // The internal DB order ID we just created
    } = body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "12345";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is valid! Update the DB
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, ourOrderId),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Insert payment record
    await db.insert(payments).values({
      orderId: ourOrderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      method: "razorpay",
      amount: order.total,
      currency: "INR",
      status: "captured", // Assume captured for simplicity here; webhook handles definitive status
    });

    // Update order status
    await updateOrderStatus(ourOrderId, "confirmed");

    // Notify admin
    const confirmedOrder = await db.query.orders.findFirst({
      where: eq(orders.id, ourOrderId),
      with: { items: true },
    });
    if (confirmedOrder) {
      sendAdminOrderEmail({
        orderNumber: confirmedOrder.orderNumber,
        total: confirmedOrder.total,
        customerEmail: confirmedOrder.email,
        items: confirmedOrder.items.map((i: any) => ({
          productName: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("Payment verification error:", e);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
