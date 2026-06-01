import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { inArray, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [{ total }] = await db
      .select({ total: count() })
      .from(orders)
      .where(inArray(orders.status, ["pending", "confirmed"]));

    return NextResponse.json({ count: total });
  } catch (e) {
    return NextResponse.json({ count: 0 });
  }
}
