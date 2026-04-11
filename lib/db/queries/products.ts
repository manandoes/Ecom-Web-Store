import { db } from "@/lib/db";
import { products, productImages, productVariants, categories } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, sql, desc, asc } from "drizzle-orm";
import type { ProductQuery } from "@/lib/validations/product";

export async function getProducts(query: ProductQuery) {
  const { page, limit, category, scentFamily, minPrice, maxPrice, inStock, sort, search } = query;
  const offset = (page - 1) * limit;

  const conditions = [eq(products.status, "active")];

  if (category) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, category),
    });
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }

  if (scentFamily) conditions.push(eq(products.scentFamily, scentFamily));
  if (minPrice) conditions.push(gte(products.basePrice, String(minPrice)));
  if (maxPrice) conditions.push(lte(products.basePrice, String(maxPrice)));
  if (search) conditions.push(ilike(products.name, `%${search}%`));

  const orderBy = (() => {
    switch (sort) {
      case "price_asc": return asc(products.basePrice);
      case "price_desc": return desc(products.basePrice);
      case "newest": return desc(products.createdAt);
      case "rating": return desc(products.avgRating);
      case "best_selling": return desc(products.totalSold);
      default: return desc(products.isFeatured);
    }
  })();

  const where = and(...conditions);

  const [data, countResult] = await Promise.all([
    db.query.products.findMany({
      where,
      with: {
        images: { where: eq(productImages.isPrimary, true), limit: 1 },
        variants: {
          where: eq(productVariants.isActive, true),
          orderBy: (v, { asc: a }) => [a(v.sortOrder)],
        },
        category: true,
      },
      orderBy: () => [orderBy],
      limit,
      offset,
    }),
    db.select({ count: sql<number>`count(*)` }).from(products).where(where),
  ]);

  const total = Number(countResult[0].count);

  // If filtering by stock, post-filter (variant-level stock)
  const filteredData = inStock
    ? data.filter((p) => p.variants.some((v) => v.stockQty > 0))
    : data;

  return {
    products: filteredData,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.status, "active")),
    with: {
      variants: {
        where: eq(productVariants.isActive, true),
        orderBy: (v, { asc: a }) => [a(v.sortOrder)],
      },
      images: { orderBy: (i, { asc: a }) => [a(i.sortOrder)] },
      category: true,
    },
  });
}

export async function getFeaturedProducts(limit: number = 4) {
  return db.query.products.findMany({
    where: and(eq(products.status, "active"), eq(products.isFeatured, true)),
    with: {
      images: { where: eq(productImages.isPrimary, true), limit: 1 },
      variants: {
        where: eq(productVariants.isActive, true),
        orderBy: (v, { asc: a }) => [a(v.sortOrder)],
      },
      category: true,
    },
    limit,
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit: number = 4) {
  const conditions = [
    eq(products.status, "active"),
    sql`${products.id} != ${productId}`,
  ];
  if (categoryId) conditions.push(eq(products.categoryId, categoryId));

  return db.query.products.findMany({
    where: and(...conditions),
    with: {
      images: { where: eq(productImages.isPrimary, true), limit: 1 },
      variants: {
        where: eq(productVariants.isActive, true),
        orderBy: (v, { asc: a }) => [a(v.sortOrder)],
      },
    },
    limit,
  });
}
