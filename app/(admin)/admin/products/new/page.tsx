import { db } from "@/lib/db";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await db.query.categories.findMany();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Add New Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
