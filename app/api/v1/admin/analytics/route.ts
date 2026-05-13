import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  getAnalyticsSummary,
  getTopProducts,
  getRevenueByDay,
  getRecentOrders,
} from "@/lib/db/queries/analytics";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    // In a real app, strictly check for admin role
    if (!session?.user?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const [summary, topProducts, revenueData, recentOrders] = await Promise.all([
      getAnalyticsSummary(fromDate, new Date()),
      getTopProducts(5),
      getRevenueByDay(days),
      getRecentOrders(5),
    ]);

    return NextResponse.json({
      summary,
      topProducts,
      revenueData,
      recentOrders,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
