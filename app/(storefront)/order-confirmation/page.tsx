"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Package, Truck, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "LC-2026-00001";

  return (
    <div className="pt-[72px] min-h-screen bg-[var(--color-lumina-cream)]">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-8"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1
            className="text-3xl lg:text-4xl mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Thank you for your order!
          </h1>
          <p className="text-[var(--color-lumina-text-secondary)] mb-2">
            Your order has been confirmed and is being prepared.
          </p>
          <p className="text-sm text-[var(--color-lumina-text-muted)] mb-8">
            Order Number:{" "}
            <span className="font-medium text-[var(--color-lumina-text)]">
              {orderNumber}
            </span>
          </p>

          {/* Order Status Timeline */}
          <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)] text-left mb-8">
            <h3 className="text-sm font-medium uppercase tracking-[0.08em] mb-6">
              Order Status
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: Check,
                  label: "Order Confirmed",
                  desc: "We have received your order",
                  active: true,
                },
                {
                  icon: Package,
                  label: "Processing",
                  desc: "Your candles are being prepared",
                  active: false,
                },
                {
                  icon: Truck,
                  label: "Shipped",
                  desc: "On the way to you",
                  active: false,
                },
                {
                  icon: MapPin,
                  label: "Delivered",
                  desc: "Enjoy your candles!",
                  active: false,
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.active
                        ? "bg-green-100 text-green-600"
                        : "bg-[var(--color-lumina-border)] text-[var(--color-lumina-text-muted)]"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.active
                          ? "text-[var(--color-lumina-text)]"
                          : "text-[var(--color-lumina-text-muted)]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-[var(--color-lumina-text-muted)]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-[var(--color-lumina-text-muted)] mb-8">
            We've sent a confirmation email. You can track your order status in
            your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/candles"
              className="h-12 px-8 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium flex items-center justify-center hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="h-12 px-8 rounded-full border border-[var(--color-lumina-border)] text-sm font-medium flex items-center justify-center hover:border-[var(--color-lumina-text)] transition-colors"
            >
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OrderConfirmationFallback() {
  return (
    <div className="pt-[72px] min-h-screen bg-[var(--color-lumina-cream)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-lumina-gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
