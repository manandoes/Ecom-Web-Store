"use client";

import { type FC } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, FREE_SHIPPING_THRESHOLD } from "@/lib/utils/currency";

export const CartDrawer: FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-[var(--color-lumina-white)] shadow-[var(--shadow-modal)] z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-lumina-border)]">
              <h2
                className="text-lg font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Cart ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-lumina-cream-dark)] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-[var(--color-lumina-border)] mb-4" />
                  <p className="text-[var(--color-lumina-text-secondary)] text-sm">
                    Your cart is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-6 py-2.5 rounded-full border border-[var(--color-lumina-text)] text-sm font-medium hover:bg-[var(--color-lumina-text)] hover:text-[var(--color-lumina-cream)] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 py-4 border-b border-[var(--color-lumina-border)] last:border-0"
                    >
                      {/* Image placeholder */}
                      <div className="w-16 h-16 rounded-lg bg-[var(--color-lumina-cream-dark)] flex-shrink-0 overflow-hidden">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/candles/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[var(--color-lumina-text)] hover:text-[var(--color-lumina-gold)] transition-colors line-clamp-1"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {item.productName}
                        </Link>
                        <p className="text-xs text-[var(--color-lumina-text-muted)] mt-0.5">
                          {item.variantName}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity stepper */}
                          <div className="flex items-center border border-[var(--color-lumina-border)] rounded-full">
                            <button
                              onClick={() =>
                                item.quantity > 1
                                  ? updateQuantity(
                                      item.variantId,
                                      item.quantity - 1
                                    )
                                  : removeItem(item.variantId)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  Math.min(item.quantity + 1, item.stockQty)
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-lumina-cream-dark)] rounded-full transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-medium">
                            {formatCurrency(
                              parseFloat(item.unitPrice) * item.quantity
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="self-start w-6 h-6 flex items-center justify-center rounded-full hover:bg-[var(--color-lumina-cream-dark)] transition-colors"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <X className="w-3.5 h-3.5 text-[var(--color-lumina-text-muted)]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-lumina-border)] px-6 py-5 space-y-4">
                {/* Free shipping progress */}
                {freeShippingRemaining > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-lumina-text-secondary)] mb-2">
                      Add {formatCurrency(freeShippingRemaining)} more for free
                      shipping
                    </p>
                    <div className="h-1.5 bg-[var(--color-lumina-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-lumina-gold)] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-lumina-text-secondary)]">
                    Subtotal
                  </span>
                  <span className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-lumina-text-muted)]">
                  Shipping and taxes calculated at checkout
                </p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center h-12 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center h-10 rounded-full border border-[var(--color-lumina-text)] text-sm font-medium hover:bg-[var(--color-lumina-text)] hover:text-[var(--color-lumina-cream)] transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
