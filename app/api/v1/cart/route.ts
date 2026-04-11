import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getCartWithItems } from "@/lib/db/queries/cart";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await getCartWithItems(session.user.id);
    return NextResponse.json(cart || { items: [] });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
