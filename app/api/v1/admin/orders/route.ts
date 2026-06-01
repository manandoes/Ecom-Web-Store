import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAllOrders, updateOrderStatus } from "@/lib/db/queries/orders";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "20");
    const status = searchParams.get("status") || undefined;

    const result = await getAllOrders(page, perPage, status === "all" ? undefined : status);

    return NextResponse.json(result);
  } catch (e) {
    console.error("Admin orders fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, trackingNumber, trackingUrl, adminNotes, cancelReason } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status, {
      trackingNumber,
      trackingUrl,
      adminNotes,
      cancelReason,
    });

    return NextResponse.json({ order: updated });
  } catch (e) {
    console.error("Admin order update error:", e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
