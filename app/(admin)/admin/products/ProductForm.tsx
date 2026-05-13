"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { createProductAction, updateProductAction } from "@/lib/actions/admin-products";
import { uploadImageAction } from "@/lib/actions/upload";

export default function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    isActive: initialData ? initialData.isActive : true,
    isFeatured: initialData ? initialData.isFeatured : false,
    images: initialData?.images || [],
    variants: initialData?.variants || [
      { name: "Default", sku: "", price: "", compareAtPrice: "", stock: 0 }
    ],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      setIsSubmitting(true);
      try {
        const res = await uploadImageAction(base64);
        if (res.success) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: res.url, alt: prev.name, isPrimary: prev.images.length === 0 }]
          }));
        } else {
          setError(res.error || "Failed to upload image");
        }
      } catch (err) {
        setError("Image upload failed");
      } finally {
        setIsSubmitting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: "", sku: "", price: "", compareAtPrice: "", stock: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) return;
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (initialData) {
        const res = await updateProductAction(initialData.id, formData);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await createProductAction(formData);
        if (res.error) throw new Error(res.error);
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] space-y-4">
            <h2 className="text-lg font-medium">Basic Information</h2>
            
            <div>
              <label className="block text-sm text-[#8b8b8b] mb-2">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => updateField("name", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1f1f23] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#8b8b8b] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => updateField("description", e.target.value)}
                className="w-full h-32 p-3 rounded-lg border border-[#2a2a2e] bg-[#1f1f23] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] space-y-4">
            <h2 className="text-lg font-medium">Media</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((img: any, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-lg border border-[#2a2a2e] bg-[#1f1f23] overflow-hidden group">
                  <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {img.isPrimary && (
                    <div className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-black px-2 py-0.5 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-[#2a2a2e] bg-[#1f1f23] hover:bg-[#2a2a2e] transition-colors flex flex-col items-center justify-center cursor-pointer text-[#8b8b8b] hover:text-white"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Variants</h2>
              <button 
                type="button" 
                onClick={addVariant}
                className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {formData.variants.map((variant: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg border border-[#2a2a2e] bg-[#1f1f23] space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Variant #{idx + 1}</span>
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#8b8b8b] mb-1">Name (e.g. 8oz, 12oz)</label>
                      <input
                        type="text"
                        required
                        value={variant.name}
                        onChange={e => updateVariant(idx, "name", e.target.value)}
                        className="w-full h-8 px-2 rounded border border-[#2a2a2e] bg-[#1a1a1e] text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8b8b8b] mb-1">SKU</label>
                      <input
                        type="text"
                        required
                        value={variant.sku}
                        onChange={e => updateVariant(idx, "sku", e.target.value)}
                        className="w-full h-8 px-2 rounded border border-[#2a2a2e] bg-[#1a1a1e] text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8b8b8b] mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={e => updateVariant(idx, "price", e.target.value)}
                        className="w-full h-8 px-2 rounded border border-[#2a2a2e] bg-[#1a1a1e] text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8b8b8b] mb-1">Compare Price (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.compareAtPrice}
                        onChange={e => updateVariant(idx, "compareAtPrice", e.target.value)}
                        className="w-full h-8 px-2 rounded border border-[#2a2a2e] bg-[#1a1a1e] text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8b8b8b] mb-1">Stock</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={variant.stock}
                        onChange={e => updateVariant(idx, "stock", parseInt(e.target.value))}
                        className="w-full h-8 px-2 rounded border border-[#2a2a2e] bg-[#1a1a1e] text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status & Organization */}
          <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] space-y-4">
            <h2 className="text-lg font-medium">Organization</h2>
            
            <div>
              <label className="block text-sm text-[#8b8b8b] mb-2">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={e => updateField("categoryId", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1f1f23] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-[#2a2a2e] space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => updateField("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-[#2a2a2e] text-amber-500 focus:ring-amber-500 focus:ring-offset-[#1a1a1e] bg-[#1f1f23]"
                />
                <span className="text-sm">Active (Visible in store)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={e => updateField("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded border-[#2a2a2e] text-amber-500 focus:ring-amber-500 focus:ring-offset-[#1a1a1e] bg-[#1f1f23]"
                />
                <span className="text-sm">Featured Product</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
