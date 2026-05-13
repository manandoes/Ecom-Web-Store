import { db } from "@/lib/db";
import ProductForm from "../../ProductForm";
import { eq } from "drizzle-orm";
import { products } from "@/lib/db/schema";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const categories = await db.query.categories.findMany();
  const product = await db.query.products.findFirst({
    where: eq(products.id, params.id),
    with: {
      images: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
      </div>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
