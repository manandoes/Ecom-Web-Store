"use client";

import { type FC } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_RATE, calculateShipping } from "@/lib/utils/currency";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal, "standard");
  const total = subtotal + shipping;

  return (
    <div className="pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[var(--color-lumina-text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-lumina-text)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--color-lumina-text)]">Cart</span>
        </nav>

        <h1 className="text-3xl lg:text-4xl mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-[var(--color-lumina-border)] mx-auto mb-6" />
            <h2 className="text-xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Your cart is empty</h2>
            <p className="text-[var(--color-lumina-text-secondary)] text-sm mb-6">Looks like you haven't added any candles yet.</p>
            <Link href="/candles" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
            {/* Cart Items */}
            <div>
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b border-[var(--color-lumina-border)] text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-lumina-text-muted)]">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span className="w-8" />
              </div>

              {items.map((item) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 py-6 border-b border-[var(--color-lumina-border)] items-center"
                >
                  {/* Product */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[var(--color-lumina-cream-dark)] overflow-hidden flex-shrink-0">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <Link href={`/candles/${item.slug}`} className="text-sm font-medium hover:text-[var(--color-lumina-gold)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                        {item.productName}
                      </Link>
                      <p className="text-xs text-[var(--color-lumina-text-muted)] mt-0.5">{item.variantName}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="text-sm text-center">{formatCurrency(item.unitPrice)}</span>

                  {/* Quantity */}
                  <div className="flex items-center justify-center">
                    <div className="inline-flex items-center border border-[var(--color-lumina-border)] rounded-full">
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item.variantId, item.quantity - 1) : removeItem(item.variantId)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, Math.min(item.quantity + 1, item.stockQty))} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <span className="text-sm font-medium text-right">
                    {formatCurrency(parseFloat(item.unitPrice) * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.variantId)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors" aria-label="Remove item">
                    <Trash2 className="w-4 h-4 text-[var(--color-lumina-text-muted)] hover:text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-[88px] self-start">
              <div className="bg-[var(--color-lumina-cream-dark)] rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-medium mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Order Summary
                </h2>

                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-lumina-text-secondary)]">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-lumina-text-secondary)]">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>

                {subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-[var(--color-lumina-gold-deep)]">
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} for free shipping
                  </p>
                )}

                <hr className="border-[var(--color-lumina-border)]" />

                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span style={{ fontFamily: "var(--font-display)" }}>{formatCurrency(total)}</span>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center h-12 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors mt-4">
                  Proceed to Checkout
                </Link>

                <Link href="/candles" className="w-full flex items-center justify-center h-10 text-sm font-medium text-[var(--color-lumina-text-secondary)] hover:text-[var(--color-lumina-text)] transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
