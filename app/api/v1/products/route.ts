import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db/queries/products";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "12");
    const sort = searchParams.get("sort") || "featured";
    const scentFamily = searchParams.get("scentFamily") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const inStock = searchParams.get("inStock") === "true" ? true : undefined;

    const result = await getProducts({
      page,
      perPage,
      sort: sort as "featured" | "newest" | "price_asc" | "price_desc" | "rating" | "best_selling",
      scentFamily,
      minPrice,
      maxPrice,
      inStock,
    });

    return NextResponse.json(result);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}
