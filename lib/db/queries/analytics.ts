import "server-only";
import { db } from "@/lib/db";
import { orders, orderItems, products, users, payments, productVariants } from "@/lib/db/schema";
import { eq, sql, gte, lte, and, count, sum, desc } from "drizzle-orm";

export async function getAnalyticsSummary(from?: Date, to?: Date) {
  const dateFilter =
    from && to ? and(gte(orders.createdAt, from), lte(orders.createdAt, to)) : undefined;

  const [revenueResult] = await db
    .select({
      totalRevenue: sum(orders.total),
      orderCount: count(),
    })
    .from(orders)
    .where(
      dateFilter
        ? and(dateFilter, eq(orders.status, "confirmed"))
        : eq(orders.status, "confirmed")
    );

  const [customerCount] = await db.select({ total: count() }).from(users);

  const [pendingOrders] = await db
    .select({ total: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return {
    totalRevenue: revenueResult.totalRevenue || "0",
    totalOrders: revenueResult.orderCount,
    totalCustomers: customerCount.total,
    pendingOrders: pendingOrders.total,
  };
}

export async function getTopProducts(limit = 5) {
  const result = await db
    .select({
      productName: orderItems.productName,
      totalQuantity: sum(orderItems.quantity),
      totalRevenue: sum(orderItems.lineTotal),
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orders.status, "confirmed"))
    .groupBy(orderItems.productName)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(limit);

  return result;
}

export async function getRevenueByDay(days = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const result = await db
    .select({
      date: sql<string>`DATE(${orders.createdAt})`,
      revenue: sum(orders.total),
      orderCount: count(),
    })
    .from(orders)
    .where(and(gte(orders.createdAt, fromDate), eq(orders.status, "confirmed")))
    .groupBy(sql`DATE(${orders.createdAt})`)
    .orderBy(sql`DATE(${orders.createdAt})`);

  return result;
}

export async function getRecentOrders(limit = 10) {
  return db.query.orders.findMany({
    with: { items: true, user: true },
    orderBy: desc(orders.createdAt),
    limit,
  });
}

export async function getLowStockProducts(threshold = 5) {
  return db.query.productVariants.findMany({
    where: lte(productVariants.stockQty, threshold),
    with: { product: true },
  });
}
