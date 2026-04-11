import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db/queries/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
