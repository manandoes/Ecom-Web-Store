import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import Razorpay from "razorpay";
import { getCartWithItems } from "@/lib/db/queries/cart";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "12345",
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shippingMethod } = await req.json();

    // Re-calculate amount purely from DB, don't trust client
    const cart = await getCartWithItems(session.user.id);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let subtotal = 0;
    cart.items.forEach((item) => {
      subtotal += parseFloat(item.variant.price) * item.quantity;
    });

    const shippingAmount = shippingMethod === "express" ? 149 : subtotal >= 999 ? 0 : 79;
    const total = subtotal + shippingAmount;

    // Razorpay requires amount in paise (multiply by 100)
    const amountInPaise = Math.round(total * 100);

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.user.id,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e: unknown) {
    console.error("Razorpay order creation error:", e);
    return NextResponse.json(
      { error: "Failed to initialize payment gateway" },
      { status: 500 }
    );
  }
}
