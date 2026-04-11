import { z } from "zod";

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  category: z.string().optional(),
  scentFamily: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "rating", "best_selling", "featured"])
    .default("featured"),
  search: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  shortDesc: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
  scentFamily: z.enum(["floral", "woody", "fresh", "citrus", "spicy", "gourmand"]).optional(),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  waxType: z.enum(["soy", "coconut", "beeswax", "paraffin"]).optional(),
  wickType: z.string().optional(),
  burnTime: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDesc: z.string().max(160).optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/),
        stockQty: z.number().int().min(0),
        weight: z.string().optional(),
      })
    )
    .optional(),
});

export const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const couponSchema = z.object({
  code: z.string().min(1).max(50).trim().toUpperCase(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
