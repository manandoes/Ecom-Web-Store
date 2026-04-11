"use client";

import { type FC } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string | null;
    scentFamily?: string | null;
    basePrice: string;
    avgRating?: string | null;
    reviewCount?: number;
    images?: { url: string; altText?: string | null }[];
    variants?: { id: string; name: string; price: string; stockQty: number }[];
  };
  index?: number;
}

export const ProductCard: FC<ProductCardProps> = ({ product, index = 0 }) => {
  const primaryImage = product.images?.[0];
  const lowestPrice = product.variants?.length
    ? product.variants.reduce(
        (min, v) => (parseFloat(v.price) < parseFloat(min.price) ? v : min),
        product.variants[0]
      )
    : null;
  const displayPrice = lowestPrice ? lowestPrice.price : product.basePrice;
  const inStock = product.variants?.some((v) => v.stockQty > 0) ?? true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/candles/${product.slug}`} className="block">
        <div className="bg-[var(--color-lumina-white)] rounded-2xl shadow-[var(--shadow-card)] overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-hover)]">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-lumina-cream-dark)]">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[var(--color-lumina-text-muted)] text-sm">
                  No image
                </span>
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Add ${product.name} to wishlist`}
            >
              <Heart className="w-4 h-4 text-[var(--color-lumina-text)]" />
            </button>

            {/* Quick add button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--color-lumina-gold)] hover:bg-[var(--color-lumina-gold-hover)] transition-all opacity-0 group-hover:opacity-100"
              aria-label={`Quick add ${product.name} to cart`}
            >
              <ShoppingBag className="w-4 h-4 text-[var(--color-lumina-text)]" />
            </button>

            {/* Out of stock badge */}
            {!inStock && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[10px] font-medium uppercase tracking-wider">
                Sold Out
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            {product.scentFamily && (
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-lumina-cream-dark)] text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-lumina-text-muted)] mb-2">
                {product.scentFamily}
              </span>
            )}
            <h3
              className="text-[17px] text-[var(--color-lumina-text)] line-clamp-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[16px] font-medium text-[var(--color-lumina-text)]">
                {lowestPrice && product.variants && product.variants.length > 1 ? "From " : ""}
                {formatCurrency(displayPrice)}
              </span>
              {product.avgRating && parseFloat(product.avgRating) > 0 && (
                <div className="flex items-center gap-1 text-xs text-[var(--color-lumina-text-muted)]">
                  <span className="text-[var(--color-lumina-gold)]">★</span>
                  {parseFloat(product.avgRating).toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
