"use server";

import { revalidatePath } from "next/cache";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscount,
} from "@/lib/db/queries/discounts";

interface DiscountFormInput {
  code: string;
  type: string;
  value: string;
  minOrderValue?: string;
  maxUses?: number | null;
  expiresAt?: string | null;
  isActive: boolean;
}

export async function createDiscountAction(input: DiscountFormInput) {
  try {
    const discount = await createDiscount({
      ...input,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    });
    revalidatePath("/admin/discounts");
    return { success: true, discount };
  } catch (e: any) {
    console.error("Create discount error:", e);
    if (e.message?.includes("unique") || e.message?.includes("duplicate")) {
      return { error: "A coupon with this code already exists." };
    }
    return { error: "Failed to create coupon code." };
  }
}

export async function updateDiscountAction(
  id: string,
  input: Partial<DiscountFormInput>
) {
  try {
    const discount = await updateDiscount(id, {
      ...input,
      expiresAt:
        input.expiresAt !== undefined
          ? input.expiresAt
            ? new Date(input.expiresAt)
            : null
          : undefined,
    });
    revalidatePath("/admin/discounts");
    return { success: true, discount };
  } catch (e) {
    console.error("Update discount error:", e);
    return { error: "Failed to update coupon code." };
  }
}

export async function deleteDiscountAction(id: string) {
  try {
    await deleteDiscount(id);
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (e) {
    console.error("Delete discount error:", e);
    return { error: "Failed to delete coupon code." };
  }
}

export async function toggleDiscountAction(id: string, isActive: boolean) {
  try {
    const discount = await toggleDiscount(id, isActive);
    revalidatePath("/admin/discounts");
    return { success: true, discount };
  } catch (e) {
    console.error("Toggle discount error:", e);
    return { error: "Failed to update status." };
  }
}
