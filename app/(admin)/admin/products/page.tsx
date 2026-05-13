import { db } from "@/lib/db";
import ProductListClient from "./ProductListClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return <ProductListClient products={allProducts} />;
}
