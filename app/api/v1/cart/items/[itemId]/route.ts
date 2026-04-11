import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { updateCartItemQuantity, removeCartItem } from "@/lib/db/queries/cart";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const { quantity } = await req.json();

    const cart = await updateCartItemQuantity(session.user.id, itemId, quantity);
    return NextResponse.json(cart);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const cart = await removeCartItem(session.user.id, itemId);
    return NextResponse.json(cart);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to remove item" },
      { status: 500 }
    );
  }
}
