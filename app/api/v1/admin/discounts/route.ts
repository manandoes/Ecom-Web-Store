import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAllDiscounts } from "@/lib/db/queries/discounts";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const discounts = await getAllDiscounts();
    return NextResponse.json({ discounts });
  } catch (e) {
    console.error("Admin discounts fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch discounts" }, { status: 500 });
  }
}
