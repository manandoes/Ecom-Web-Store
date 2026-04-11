"use server";

import { auth } from "@/lib/auth/config";
import { createReview } from "@/lib/db/queries/reviews";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to leave a review" };
  }

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return { error: "Invalid review data" };
  }

  try {
    await createReview({
      productId,
      userId: session.user.id,
      rating,
      title: title || undefined,
      body: body || undefined,
    });

    revalidatePath(`/candles`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to submit review" };
  }
}
