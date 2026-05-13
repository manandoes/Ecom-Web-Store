import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lumina-candles.com";

  // Get active products
  const activeProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    columns: {
      id: true,
      updatedAt: true,
    },
  });

  // Get categories
  const allCategories = await db.query.categories.findMany({
    columns: {
      slug: true,
    },
  });

  const productUrls = activeProducts.map((product) => ({
    url: `${baseUrl}/candles/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = allCategories.map((category) => ({
    url: `${baseUrl}/candles?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/candles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
