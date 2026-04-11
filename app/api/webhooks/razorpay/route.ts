import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { payments, orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("No RAZORPAY_WEBHOOK_SECRET configured. Webhook bypassed.");
      // Just return 200 to prevent Razorpay retries if we don't have webhook setup yet
      return NextResponse.json({ status: "ignored" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;
    const paymentEntity = body.payload.payment.entity;

    // Handle payment.authorized / payment.captured / payment.failed event
    if (event === "payment.captured" || event === "payment.authorized") {
      const internalPayment = await db.query.payments.findFirst({
        where: eq(payments.razorpayOrderId, paymentEntity.order_id),
      });

      if (internalPayment && internalPayment.status !== "captured") {
        await db
          .update(payments)
          .set({ status: "captured", razorpayPaymentId: paymentEntity.id })
          .where(eq(payments.id, internalPayment.id));
        
        await db
          .update(orders)
          .set({ status: "confirmed" })
          .where(eq(orders.id, internalPayment.orderId));
      }
    } else if (event === "payment.failed") {
      const internalPayment = await db.query.payments.findFirst({
        where: eq(payments.razorpayOrderId, paymentEntity.order_id),
      });

      if (internalPayment) {
        await db
          .update(payments)
          .set({ status: "failed", razorpayPaymentId: paymentEntity.id })
          .where(eq(payments.id, internalPayment.id));

         // Note: We might not want to cancel the order immediately, maybe just mark payment failed
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (e: unknown) {
    console.error("Webhook processing error:", e);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
