"use server";

import { db } from "@/lib/db";
import { products, productVariants, productImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: any) {
  try {
    const [product] = await db.insert(products).values({
      name: data.name,
      slug: data.slug,
      basePrice: data.basePrice?.toString(),
      description: data.description,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
      status: data.isActive ? "active" : "draft",
    }).returning();

    if (data.images && data.images.length > 0) {
      await db.insert(productImages).values(
        data.images.map((img: any) => ({
          productId: product.id,
          url: img.url,
          altText: img.altText || img.alt || data.name,
          isPrimary: img.isPrimary || false,
        }))
      );
    }

    if (data.variants && data.variants.length > 0) {
      await db.insert(productVariants).values(
        data.variants.map((v: any) => ({
          productId: product.id,
          name: v.name,
          sku: v.sku,
          price: v.price.toString(),
          stockQty: v.stockQty ?? v.stock ?? 0,
        }))
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, id: product.id };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { error: "Failed to create product" };
  }
}

export async function updateProductAction(id: string, data: any) {
  try {
    await db.update(products).set({
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
      status: data.isActive ? "active" : "draft",
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    // Handle images (for simplicity, delete and recreate if changed)
    if (data.images) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (data.images.length > 0) {
        await db.insert(productImages).values(
          data.images.map((img: any) => ({
            productId: id,
            url: img.url,
            altText: img.altText || img.alt || data.name,
            isPrimary: img.isPrimary || false,
          }))
        );
      }
    }

    // Handle variants
    if (data.variants) {
      await db.delete(productVariants).where(eq(productVariants.productId, id));
      if (data.variants.length > 0) {
        await db.insert(productVariants).values(
          data.variants.map((v: any) => ({
            productId: id,
            name: v.name,
            sku: v.sku,
            price: v.price.toString(),
            stockQty: v.stockQty ?? v.stock ?? 0,
          }))
        );
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
}
