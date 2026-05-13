import { db } from "@/lib/db";
import { reviews, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
) {
  const offset = (page - 1) * limit;

  const data = await db.query.reviews.findMany({
    where: and(
      eq(reviews.productId, productId),
      eq(reviews.status, "published")
    ),
    with: {
      user: {
        columns: { name: true, avatarUrl: true },
      },
    },
    orderBy: [desc(reviews.createdAt)],
    limit,
    offset,
  });

  return data;
}

export async function getUserReviewForProduct(
  userId: string,
  productId: string
) {
  return db.query.reviews.findFirst({
    where: and(eq(reviews.userId, userId), eq(reviews.productId, productId)),
  });
}

export async function createReview(data: typeof reviews.$inferInsert) {
  const [review] = await db.insert(reviews).values(data).returning();
  return review;
}
