import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();

  // Get the last order number for this year
  const result = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(sql`${orders.orderNumber} LIKE ${"LC-" + year + "-%"}`)
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(1);

  let nextSeq = 1;
  if (result.length > 0) {
    const lastNumber = result[0].orderNumber;
    const lastSeq = parseInt(lastNumber.split("-")[2], 10);
    nextSeq = lastSeq + 1;
  }

  return `LC-${year}-${nextSeq.toString().padStart(5, "0")}`;
}
