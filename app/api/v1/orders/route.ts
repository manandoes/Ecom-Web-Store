import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getUserOrders } from "@/lib/db/queries/orders";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");

    const result = await getUserOrders(session.user.id, page);
    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
