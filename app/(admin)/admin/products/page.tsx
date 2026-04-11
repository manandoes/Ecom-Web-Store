"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

// Demo data
const demoProducts = [
  { id: "1", name: "Lavender Dreams", sku: "LC-LAV-8OZ", category: "Floral", price: "₹599", stock: 8, status: "active" },
  { id: "2", name: "Forest Whisper", sku: "LC-FOR-8OZ", category: "Woody", price: "₹699", stock: 6, status: "active" },
  { id: "3", name: "Citrus Sunrise", sku: "LC-CIT-8OZ", category: "Citrus", price: "₹499", stock: 10, status: "active" },
  { id: "4", name: "Vanilla Chai", sku: "LC-VAN-8OZ", category: "Spicy", price: "₹649", stock: 4, status: "active" },
  { id: "5", name: "Ocean Breeze", sku: "LC-OCE-8OZ", category: "Fresh", price: "₹549", stock: 14, status: "active" },
  { id: "6", name: "Rose Garden", sku: "LC-ROS-8OZ", category: "Floral", price: "₹749", stock: 7, status: "active" },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = demoProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
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
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors"
              >
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-[#8b8b8b] font-mono text-xs">
                  {product.sku}
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock <= 5
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Eye className="w-4 h-4 text-[#8b8b8b]" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Edit className="w-4 h-4 text-[#8b8b8b]" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
