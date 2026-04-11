import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { addToCart } from "@/lib/db/queries/cart";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { variantId, quantity = 1 } = await req.json();
    if (!variantId) {
      return NextResponse.json({ error: "variantId is required" }, { status: 400 });
    }

    const cart = await addToCart(session.user.id, variantId, quantity);
    return NextResponse.json(cart);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to add item" },
      { status: 500 }
    );
  }
}
