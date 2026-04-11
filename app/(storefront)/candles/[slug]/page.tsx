"use client";

import { type FC, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  ChevronRight,
  Share2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import { ProductCard } from "@/components/storefront/ProductCard";

// Demo data — will be replaced with server-fetched data
const product = {
  id: "1",
  name: "Lavender Dreams",
  slug: "lavender-dreams",
  description: "Immerse yourself in the tranquil embrace of our Lavender Dreams candle. Hand-poured with premium soy wax and infused with the finest French lavender essential oil, this candle transforms any room into a peaceful sanctuary.",
  shortDesc: "Calming lavender with hints of vanilla",
  scentFamily: "floral",
  topNotes: "Lavender, Bergamot",
  middleNotes: "Jasmine, Geranium",
  baseNotes: "Vanilla, White Musk",
  waxType: "soy",
  wickType: "cotton",
  burnTime: "40–50 hours",
  basePrice: "599.00",
  avgRating: "4.7",
  reviewCount: 42,
  images: [
    { url: "https://images.unsplash.com/photo-1602607526325-cc002016a227?w=800&q=80", altText: "Lavender candle front view" },
    { url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80", altText: "Lavender candle side" },
    { url: "https://images.unsplash.com/photo-1608181831688-ba943e30ada0?w=400&q=80", altText: "Lavender candle top" },
    { url: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&q=80", altText: "Lavender candle lifestyle" },
  ],
  variants: [
    { id: "v1", name: "2oz", price: "199.00", stockQty: 20 },
    { id: "v2", name: "4oz", price: "299.00", stockQty: 12 },
    { id: "v3", name: "8oz", price: "599.00", stockQty: 8 },
  ],
  category: { id: "cat1", name: "Floral", slug: "floral" },
};

const relatedProducts = [
  { id: "2", name: "Rose Garden", slug: "rose-garden", scentFamily: "floral", basePrice: "749.00", avgRating: "4.9", images: [{ url: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&q=80", altText: "Rose candle" }], variants: [{ id: "rv1", name: "8oz", price: "749.00", stockQty: 7 }] },
  { id: "3", name: "Jasmine Twilight", slug: "jasmine-twilight", scentFamily: "floral", basePrice: "649.00", avgRating: "4.6", images: [{ url: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80", altText: "Jasmine candle" }], variants: [{ id: "rv2", name: "8oz", price: "649.00", stockQty: 9 }] },
  { id: "4", name: "Peony Blush", slug: "peony-blush", scentFamily: "floral", basePrice: "699.00", avgRating: "4.8", images: [{ url: "https://images.unsplash.com/photo-1611072337226-1e04080e6118?w=600&q=80", altText: "Peony candle" }], variants: [{ id: "rv3", name: "8oz", price: "699.00", stockQty: 11 }] },
  { id: "5", name: "Cherry Blossom", slug: "cherry-blossom", scentFamily: "floral", basePrice: "599.00", avgRating: "4.7", images: [{ url: "https://images.unsplash.com/photo-1596207891316-23751eeb30e7?w=600&q=80", altText: "Cherry blossom candle" }], variants: [{ id: "rv4", name: "8oz", price: "599.00", stockQty: 13 }] },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[2]); // Default to 8oz
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantName: selectedVariant.name,
      unitPrice: selectedVariant.price,
      quantity,
      imageUrl: product.images[0]?.url || "",
      stockQty: selectedVariant.stockQty,
      slug: product.slug,
    });
  };

  return (
    <div className="pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[var(--color-lumina-text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-lumina-text)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/candles" className="hover:text-[var(--color-lumina-text)] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--color-lumina-text)]">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--color-lumina-cream-dark)] mb-4">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.altText || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-[var(--color-lumina-gold)]"
                      : "border-transparent hover:border-[var(--color-lumina-border)]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Scent tag */}
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-lumina-cream-dark)] text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-lumina-text-muted)] mb-3">
              {product.scentFamily}
            </span>

            <h1 className="text-3xl lg:text-4xl leading-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(parseFloat(product.avgRating))
                        ? "fill-[var(--color-lumina-gold)] text-[var(--color-lumina-gold)]"
                        : "text-[var(--color-lumina-border)]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--color-lumina-text-muted)]">
                {product.avgRating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-[28px] font-medium mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {formatCurrency(selectedVariant.price)}
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.08em] mb-3">
                Size
              </p>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    className={`flex flex-col items-center px-5 py-3 rounded-2xl border-2 transition-colors min-w-[80px] ${
                      selectedVariant.id === variant.id
                        ? "border-[var(--color-lumina-dark)] bg-[var(--color-lumina-cream-dark)]"
                        : "border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text)]"
                    }`}
                  >
                    <span className="text-sm font-medium">{variant.name}</span>
                    <span className="text-xs text-[var(--color-lumina-text-muted)] mt-0.5">
                      {formatCurrency(variant.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.08em] mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-[var(--color-lumina-border)] rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stockQty, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors"
                  disabled={quantity >= selectedVariant.stockQty}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {selectedVariant.stockQty <= 5 && (
                <p className="text-xs text-[var(--color-lumina-gold-deep)] mt-2">
                  Only {selectedVariant.stockQty} left in stock
                </p>
              )}
            </div>

            {/* Add to Cart + Wishlist */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stockQty === 0}
                className="w-full h-14 rounded-full bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] text-[14px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-gold-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-full border border-[var(--color-lumina-border)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--color-lumina-text)] transition-colors">
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </button>
                <button className="h-12 w-12 rounded-full border border-[var(--color-lumina-border)] flex items-center justify-center hover:border-[var(--color-lumina-text)] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[var(--color-lumina-border)]">
              {[
                { id: "description", title: "Description", content: product.description },
                {
                  id: "scent",
                  title: "Scent Profile",
                  content: (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-[var(--color-lumina-cream-dark)] text-xs font-medium">Top: {product.topNotes}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-[var(--color-lumina-cream-dark)] text-xs font-medium">Middle: {product.middleNotes}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-[var(--color-lumina-cream-dark)] text-xs font-medium">Base: {product.baseNotes}</span>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "details",
                  title: "Wax & Wick Details",
                  content: `Wax: ${product.waxType?.charAt(0).toUpperCase()}${product.waxType?.slice(1)} • Wick: ${product.wickType?.charAt(0).toUpperCase()}${product.wickType?.slice(1)} • Burn Time: ${product.burnTime}`,
                },
                { id: "shipping", title: "Shipping & Returns", content: "Free shipping on orders above ₹999. Standard delivery in 3–5 business days. Express delivery available. 7-day return policy for unused products." },
              ].map((section) => (
                <div key={section.id} className="border-b border-[var(--color-lumina-border)]">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between py-4 text-sm font-medium hover:text-[var(--color-lumina-gold)] transition-colors"
                  >
                    {section.title}
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeAccordion === section.id ? "rotate-90" : ""}`} />
                  </button>
                  {activeAccordion === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="pb-4 text-sm text-[var(--color-lumina-text-secondary)] leading-relaxed"
                    >
                      {typeof section.content === "string" ? section.content : section.content}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <section className="mt-20 lg:mt-28">
          <h2 className="text-2xl lg:text-[36px] leading-tight mb-8" style={{ fontFamily: "var(--font-display)" }}>
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
