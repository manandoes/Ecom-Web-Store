"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";

export default function WishlistPage() {
  // Demo — will be fetched from server
  const wishlistItems: {
    id: string;
    name: string;
    slug: string;
    basePrice: string;
    avgRating: string;
    images: { url: string; altText: string }[];
    variants: { id: string; name: string; price: string; stockQty: number }[];
  }[] = [];

  return (
    <div>
      <h1
        className="text-2xl lg:text-3xl mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <Heart className="w-12 h-12 mx-auto text-[var(--color-lumina-text-muted)] mb-4" />
          <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
          <p className="text-sm text-[var(--color-lumina-text-muted)] mb-6">
            Save your favorite candles here for later.
          </p>
          <Link
            href="/candles"
            className="inline-flex h-10 items-center px-6 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
          >
            Browse Candles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
