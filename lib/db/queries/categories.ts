import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCategories() {
  return db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
}
