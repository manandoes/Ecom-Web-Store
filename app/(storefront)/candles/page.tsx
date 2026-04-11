"use client";

import { type FC, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";

const scentFamilies = ["Floral", "Woody", "Fresh", "Citrus", "Spicy", "Gourmand"];
const sizes = ["2oz", "4oz", "8oz"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "best_selling", label: "Best Selling" },
];

// Demo products for initial render
const demoProducts = [
  { id: "1", name: "Lavender Dreams", slug: "lavender-dreams", scentFamily: "floral", basePrice: "599.00", avgRating: "4.7", reviewCount: 42, images: [{ url: "/images/products/lavender-dreams.png", altText: "Lavender candle" }], variants: [{ id: "v1", name: "4oz", price: "299.00", stockQty: 12 }, { id: "v2", name: "8oz", price: "599.00", stockQty: 8 }] },
  { id: "2", name: "Forest Whisper", slug: "forest-whisper", scentFamily: "woody", basePrice: "699.00", avgRating: "4.9", reviewCount: 38, images: [{ url: "/images/products/forest-whisper.png", altText: "Forest candle" }], variants: [{ id: "v3", name: "4oz", price: "349.00", stockQty: 15 }, { id: "v4", name: "8oz", price: "699.00", stockQty: 6 }] },
  { id: "3", name: "Citrus Sunrise", slug: "citrus-sunrise", scentFamily: "citrus", basePrice: "499.00", avgRating: "4.5", reviewCount: 27, images: [{ url: "/images/products/citrus-sunrise.png", altText: "Citrus candle" }], variants: [{ id: "v5", name: "4oz", price: "249.00", stockQty: 20 }, { id: "v6", name: "8oz", price: "499.00", stockQty: 10 }] },
  { id: "4", name: "Vanilla Chai", slug: "vanilla-chai", scentFamily: "spicy", basePrice: "649.00", avgRating: "4.8", reviewCount: 56, images: [{ url: "/images/products/vanilla-chai.png", altText: "Vanilla chai candle" }], variants: [{ id: "v7", name: "4oz", price: "329.00", stockQty: 18 }, { id: "v8", name: "8oz", price: "649.00", stockQty: 4 }] },
  { id: "5", name: "Ocean Breeze", slug: "ocean-breeze", scentFamily: "fresh", basePrice: "549.00", avgRating: "4.6", reviewCount: 31, images: [{ url: "/images/products/ocean-breeze.png", altText: "Ocean candle" }], variants: [{ id: "v9", name: "8oz", price: "549.00", stockQty: 14 }] },
  { id: "6", name: "Rose Garden", slug: "rose-garden", scentFamily: "floral", basePrice: "749.00", avgRating: "4.9", reviewCount: 63, images: [{ url: "/images/products/rose-garden.png", altText: "Rose candle" }], variants: [{ id: "v10", name: "8oz", price: "749.00", stockQty: 7 }] },
  { id: "7", name: "Midnight Amber", slug: "midnight-amber", scentFamily: "woody", basePrice: "799.00", avgRating: "4.8", reviewCount: 45, images: [{ url: "/images/products/forest-whisper.png", altText: "Amber candle" }], variants: [{ id: "v11", name: "8oz", price: "799.00", stockQty: 5 }] },
  { id: "8", name: "Honey & Oat", slug: "honey-oat", scentFamily: "gourmand", basePrice: "579.00", avgRating: "4.6", reviewCount: 22, images: [{ url: "/images/products/vanilla-chai.png", altText: "Honey candle" }], variants: [{ id: "v12", name: "8oz", price: "579.00", stockQty: 11 }] },
];

export default function CandlesPage() {
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleScent = (scent: string) => {
    setSelectedScents((prev) =>
      prev.includes(scent) ? prev.filter((s) => s !== scent) : [...prev, scent]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedScents([]);
    setSelectedSizes([]);
  };

  const activeFilterCount = selectedScents.length + selectedSizes.length;

  return (
    <div className="pt-[72px]">
      {/* Page header */}
      <section className="bg-[var(--color-lumina-cream-dark)] py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h1 className="text-3xl lg:text-[48px] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Our Candles
          </h1>
          <p className="text-[var(--color-lumina-text-secondary)] text-[15px] mt-3 max-w-md mx-auto">
            Explore our collection of handcrafted scented candles, each one poured with intention.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-[88px] self-start">
            <div className="space-y-8">
              {/* Scent Family */}
              <div>
                <h3 className="text-sm font-medium uppercase tracking-[0.08em] mb-4">
                  Scent Family
                </h3>
                <div className="flex flex-wrap gap-2">
                  {scentFamilies.map((scent) => (
                    <button
                      key={scent}
                      onClick={() => toggleScent(scent.toLowerCase())}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                        selectedScents.includes(scent.toLowerCase())
                          ? "bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] border-[var(--color-lumina-dark)]"
                          : "bg-[var(--color-lumina-cream-dark)] text-[var(--color-lumina-text)] border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text)]"
                      }`}
                    >
                      {scent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h3 className="text-sm font-medium uppercase tracking-[0.08em] mb-4">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] border-[var(--color-lumina-dark)]"
                          : "bg-[var(--color-lumina-cream-dark)] text-[var(--color-lumina-text)] border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text)]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--color-lumina-gold-deep)] hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-lumina-border)] text-sm font-medium hover:border-[var(--color-lumina-text)] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[var(--color-lumina-gold)] text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="text-sm text-[var(--color-lumina-text-muted)]">
                  {demoProducts.length} products
                </span>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pr-8 pl-4 py-2 rounded-full border border-[var(--color-lumina-border)] bg-transparent text-sm font-medium cursor-pointer hover:border-[var(--color-lumina-text)] transition-colors focus:outline-none focus:border-[var(--color-lumina-gold)]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--color-lumina-text-muted)]" />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedScents.map((scent) => (
                  <button
                    key={scent}
                    onClick={() => toggleScent(scent)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-lumina-cream-dark)] text-xs font-medium border border-[var(--color-lumina-border)]"
                  >
                    {scent}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {selectedSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-lumina-cream-dark)] text-xs font-medium border border-[var(--color-lumina-border)]"
                  >
                    {size}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-[var(--color-lumina-gold-deep)] hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {demoProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)]"
                      : "bg-[var(--color-lumina-cream-dark)] text-[var(--color-lumina-text)] hover:bg-[var(--color-lumina-border)]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
