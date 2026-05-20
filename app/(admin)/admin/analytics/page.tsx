import { db } from "@/lib/db";
import { orders, products, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { BarChart, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  // Aggregate data for analytics
  const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
  const totalUsers = totalUsersResult[0].count;

  const totalOrdersResult = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const totalOrders = totalOrdersResult[0].count;

  const totalProductsResult = await db.select({ count: sql<number>`count(*)` }).from(products);
  const totalProducts = totalProductsResult[0].count;

  const totalRevenueResult = await db.select({
    sum: sql<number>`sum(CAST(${orders.total} AS DECIMAL))`
  }).from(orders).where(eq(orders.status, "delivered")); // Only count delivered for revenue
  const totalRevenue = totalRevenueResult[0].sum || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Analytics Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#8b8b8b]">Total Revenue</p>
              <h3 className="text-2xl font-semibold">{formatCurrency(totalRevenue.toString())}</h3>
            </div>
          </div>
          <div className="text-xs text-emerald-400">Recorded from delivered orders</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#8b8b8b]">Total Orders</p>
              <h3 className="text-2xl font-semibold">{totalOrders}</h3>
            </div>
          </div>
          <div className="text-xs text-[#8b8b8b]">All time orders</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#8b8b8b]">Total Customers</p>
              <h3 className="text-2xl font-semibold">{totalUsers}</h3>
            </div>
          </div>
          <div className="text-xs text-[#8b8b8b]">Registered users</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#8b8b8b]">Total Products</p>
              <h3 className="text-2xl font-semibold">{totalProducts}</h3>
            </div>
          </div>
          <div className="text-xs text-[#8b8b8b]">Products in catalog</div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-[#2a2a2e] flex items-center justify-center mb-4">
          <BarChart className="w-8 h-8 text-[#8b8b8b]" />
        </div>
        <h2 className="text-xl font-medium mb-2">Detailed Charts Coming Soon</h2>
        <p className="text-[#8b8b8b] max-w-md">
          Advanced analytics, sales over time, and customer behavior charts are being prepared for the next update.
        </p>
      </div>
    </div>
  );
}
