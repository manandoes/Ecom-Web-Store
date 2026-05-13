"use client";

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProductAction } from "@/lib/actions/admin-products";

export default function ProductListClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants?.[0]?.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProductAction(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="rounded-2xl border border-[#2a2a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1a1e] text-[#8b8b8b] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">SKU</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const mainVariant = product.variants?.[0];
              const stock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
              
              return (
                <tr
                  key={product.id}
                  className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-[#8b8b8b] font-mono text-xs">
                    {mainVariant?.sku || "N/A"}
                  </td>
                  <td className="px-4 py-3">{product.category?.name || "Uncategorized"}</td>
                  <td className="px-4 py-3">₹{mainVariant?.price || "0.00"}</td>
                  <td className="px-4 py-3">
                    <span className={stock <= 5 ? "text-red-400" : "text-emerald-400"}>
                      {stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${product.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#2a2a2e] text-[#8b8b8b]'}`}>
                      {product.isActive ? "active" : "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/products/${product.id}`} target="_blank" className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                        <Eye className="w-4 h-4 text-[#8b8b8b]" />
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`} className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                        <Edit className="w-4 h-4 text-[#8b8b8b]" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#8b8b8b]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
