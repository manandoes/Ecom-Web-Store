import "server-only";
import { db } from "@/lib/db";
import { users, orders } from "@/lib/db/schema";
import { eq, count, sum, desc, ilike, or, and } from "drizzle-orm";

export async function getAllCustomers(page = 1, perPage = 20, search?: string) {
  const offset = (page - 1) * perPage;

  const searchCondition = search
    ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
    : undefined;

  const where = searchCondition
    ? and(eq(users.role, "customer"), searchCondition)
    : eq(users.role, "customer");

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        orderCount: count(orders.id),
        totalSpent: sum(orders.total),
      })
      .from(users)
      .leftJoin(orders, eq(orders.userId, users.id))
      .where(where)
      .groupBy(users.id)
      .orderBy(desc(users.createdAt))
      .limit(perPage)
      .offset(offset),
    db.select({ total: count() }).from(users).where(where),
  ]);

  return {
    customers: data,
    total: Number(total),
    page,
    perPage,
    totalPages: Math.ceil(Number(total) / perPage),
  };
}
