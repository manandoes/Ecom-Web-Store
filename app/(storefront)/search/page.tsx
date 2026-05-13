"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useSearchParams } from "next/navigation";

// Demo — will be replaced with API call
const demoProducts = [
  { id: "1", name: "Lavender Dreams", slug: "lavender-dreams", scentFamily: "floral", basePrice: "599.00", avgRating: "4.7", reviewCount: 42, images: [{ url: "/images/products/lavender-dreams.png", altText: "Lavender candle" }], variants: [{ id: "v1", name: "8oz", price: "599.00", stockQty: 8 }] },
  { id: "2", name: "Forest Whisper", slug: "forest-whisper", scentFamily: "woody", basePrice: "699.00", avgRating: "4.9", reviewCount: 38, images: [{ url: "/images/products/forest-whisper.png", altText: "Forest candle" }], variants: [{ id: "v3", name: "8oz", price: "699.00", stockQty: 6 }] },
  { id: "3", name: "Citrus Sunrise", slug: "citrus-sunrise", scentFamily: "citrus", basePrice: "499.00", avgRating: "4.5", reviewCount: 27, images: [{ url: "/images/products/citrus-sunrise.png", altText: "Citrus candle" }], variants: [{ id: "v5", name: "8oz", price: "499.00", stockQty: 10 }] },
  { id: "4", name: "Rose Garden", slug: "rose-garden", scentFamily: "floral", basePrice: "749.00", avgRating: "4.9", reviewCount: 63, images: [{ url: "/images/products/rose-garden.png", altText: "Rose candle" }], variants: [{ id: "v10", name: "8oz", price: "749.00", stockQty: 7 }] },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  // Filter demo products by search query
  const filtered = demoProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.scentFamily.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-[72px] min-h-screen">
      <section className="bg-[var(--color-lumina-cream-dark)] py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <h1
            className="text-3xl lg:text-[48px] leading-tight text-center mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Search
          </h1>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-lumina-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candles, scents, collections..."
              className="w-full h-14 pl-12 pr-4 rounded-full border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-[15px]"
              autoFocus
            />
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {searchQuery ? (
          <>
            <p className="text-sm text-[var(--color-lumina-text-muted)] mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-[var(--color-lumina-text-muted)] mb-4">
                  No candles found matching your search.
                </p>
                <Link
                  href="/candles"
                  className="text-sm font-medium text-[var(--color-lumina-gold-deep)] hover:underline"
                >
                  Browse all candles →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[var(--color-lumina-text-muted)]">
              Start typing to search our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-[72px] min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-lumina-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
