import "server-only";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

interface DiscountInput {
  code: string;
  type: string;
  value: string;
  minOrderValue?: string;
  maxUses?: number | null;
  expiresAt?: Date | null;
  isActive?: boolean;
}

export async function getAllDiscounts() {
  return db.query.discountCodes.findMany({
    orderBy: desc(discountCodes.createdAt),
  });
}

export async function createDiscount(input: DiscountInput) {
  const [created] = await db
    .insert(discountCodes)
    .values({
      code: input.code.toUpperCase(),
      type: input.type,
      value: input.value,
      minOrderValue: input.minOrderValue || "0",
      maxUses: input.maxUses || null,
      expiresAt: input.expiresAt || null,
      isActive: input.isActive ?? true,
    })
    .returning();
  return created;
}

export async function updateDiscount(id: string, input: Partial<DiscountInput>) {
  const updates: Record<string, unknown> = {};
  if (input.code !== undefined) updates.code = input.code.toUpperCase();
  if (input.type !== undefined) updates.type = input.type;
  if (input.value !== undefined) updates.value = input.value;
  if (input.minOrderValue !== undefined) updates.minOrderValue = input.minOrderValue;
  if (input.maxUses !== undefined) updates.maxUses = input.maxUses;
  if (input.expiresAt !== undefined) updates.expiresAt = input.expiresAt;
  if (input.isActive !== undefined) updates.isActive = input.isActive;

  const [updated] = await db
    .update(discountCodes)
    .set(updates)
    .where(eq(discountCodes.id, id))
    .returning();
  return updated;
}

export async function deleteDiscount(id: string) {
  await db.delete(discountCodes).where(eq(discountCodes.id, id));
}

export async function toggleDiscount(id: string, isActive: boolean) {
  const [updated] = await db
    .update(discountCodes)
    .set({ isActive })
    .where(eq(discountCodes.id, id))
    .returning();
  return updated;
}
