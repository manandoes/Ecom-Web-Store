"use client";

import { type FC, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Truck,
  CreditCard,
  Check,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { validateCheckoutAction, createOrderAction } from "@/lib/actions/checkout";

const steps = [
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: Check },
];

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCartStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pinCode: "",
    shippingMethod: "standard",
    isGift: false,
    giftMessage: "",
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const shippingCost =
    formData.shippingMethod === "express" ? 149 : totalPrice >= 999 ? 0 : 79;
  const orderTotal = totalPrice + shippingCost;

  const canProceed = () => {
    if (currentStep === 0) {
      return (
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.phone &&
        formData.line1 &&
        formData.city &&
        formData.state &&
        formData.pinCode
      );
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // 1. Validate stock
      const validation = await validateCheckoutAction({
        email: formData.email,
        shippingAddress: formData,
      });

      if (validation.error) {
        alert(validation.error);
        setIsProcessing(false);
        return;
      }

      // 2. Create Razorpay Order
      const res = await fetch("/api/v1/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingMethod: formData.shippingMethod }),
      });
      const razorpayOrder = await res.json();

      if (razorpayOrder.error) {
        alert(razorpayOrder.error);
        setIsProcessing(false);
        return;
      }

      // 3. Create Internal DB Order
      const internalOrder = await createOrderAction(formData);
      if (internalOrder.error) {
        alert(internalOrder.error);
        setIsProcessing(false);
        return;
      }

      // 4. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Lumina Candles",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/v1/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                ourOrderId: internalOrder.orderId,
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/order-confirmation?order=${internalOrder.orderNumber}`);
            } else {
              alert("Payment verification failed.");
              setIsProcessing(false);
            }
          } catch (e) {
            alert("Error verifying payment");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#D4AF37", // Lumina Gold
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
      
    } catch (e) {
      alert("Something went wrong");
      setIsProcessing(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-3xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your cart is empty
          </h1>
          <p className="text-[var(--color-lumina-text-muted)] mb-8">
            Add some candles to get started.
          </p>
          <Link
            href="/candles"
            className="inline-flex h-12 items-center px-8 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
          >
            Shop Candles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen bg-[var(--color-lumina-cream)]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[var(--color-lumina-text-muted)] mb-8">
          <Link
            href="/cart"
            className="hover:text-[var(--color-lumina-text)] transition-colors"
          >
            Cart
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--color-lumina-text)]">Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                  i === currentStep
                    ? "bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)]"
                    : i < currentStep
                    ? "bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] cursor-pointer"
                    : "bg-[var(--color-lumina-cream-dark)] text-[var(--color-lumina-text-muted)]"
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-[2px] ${
                    i < currentStep
                      ? "bg-[var(--color-lumina-gold)]"
                      : "bg-[var(--color-lumina-border)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Form Area */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Shipping */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Shipping Information
                </h2>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                  />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.line1}
                    onChange={(e) => updateField("line1", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address Line 2{" "}
                    <span className="text-[var(--color-lumina-text-muted)]">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.line2}
                    onChange={(e) => updateField("line2", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={formData.pinCode}
                      onChange={(e) => updateField("pinCode", e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Delivery */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delivery Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: "standard",
                      label: "Standard Delivery",
                      desc: "3–5 business days",
                      price: totalPrice >= 999 ? "Free" : "₹79",
                    },
                    {
                      id: "express",
                      label: "Express Delivery",
                      desc: "1–2 business days",
                      price: "₹149",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => updateField("shippingMethod", method.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                        formData.shippingMethod === method.id
                          ? "border-[var(--color-lumina-dark)] bg-[var(--color-lumina-cream-dark)]"
                          : "border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text-muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Truck className="w-5 h-5 text-[var(--color-lumina-text-muted)]" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{method.label}</p>
                          <p className="text-xs text-[var(--color-lumina-text-muted)]">
                            {method.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {method.price}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Gift Option */}
                <div className="border-t border-[var(--color-lumina-border)] pt-6 mt-6">
                  <button
                    onClick={() => updateField("isGift", !formData.isGift)}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        formData.isGift
                          ? "bg-[var(--color-lumina-gold)] border-[var(--color-lumina-gold)]"
                          : "border-[var(--color-lumina-border)]"
                      }`}
                    >
                      {formData.isGift && <Check className="w-3 h-3" />}
                    </div>
                    <Gift className="w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                    <span className="text-sm font-medium">
                      This is a gift
                    </span>
                  </button>
                  {formData.isGift && (
                    <textarea
                      value={formData.giftMessage}
                      onChange={(e) =>
                        updateField("giftMessage", e.target.value)
                      }
                      placeholder="Add a gift message (optional)"
                      maxLength={200}
                      className="mt-4 w-full p-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm resize-none h-24"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Payment
                </h2>
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl border-2 border-[var(--color-lumina-dark)] bg-[var(--color-lumina-cream-dark)]">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">
                          Pay with Razorpay
                        </p>
                        <p className="text-xs text-[var(--color-lumina-text-muted)]">
                          UPI, Cards, Net Banking, Wallets
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border-2 border-[var(--color-lumina-border)]">
                    <div className="flex items-center gap-4">
                      <Truck className="w-5 h-5 text-[var(--color-lumina-text-muted)]" />
                      <div>
                        <p className="text-sm font-medium">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-[var(--color-lumina-text-muted)]">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-lumina-text-muted)]">
                  <ShieldCheck className="w-4 h-4" />
                  Your payment information is encrypted and secure
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Review Order
                </h2>

                {/* Shipping Summary */}
                <div className="p-5 rounded-2xl bg-[var(--color-lumina-cream-dark)]">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-lumina-text-muted)] mb-2">
                    Shipping To
                  </p>
                  <p className="text-sm font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-[var(--color-lumina-text-secondary)]">
                    {formData.line1}
                    {formData.line2 ? `, ${formData.line2}` : ""}
                  </p>
                  <p className="text-sm text-[var(--color-lumina-text-secondary)]">
                    {formData.city}, {formData.state} {formData.pinCode}
                  </p>
                  <p className="text-sm text-[var(--color-lumina-text-secondary)]">
                    {formData.phone}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[var(--color-lumina-cream-dark)] overflow-hidden flex-shrink-0">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[var(--color-lumina-text-muted)]">
                          {item.variantName} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          (
                            parseFloat(item.unitPrice) * item.quantity
                          ).toFixed(2)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-lumina-border)]">
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="text-sm font-medium text-[var(--color-lumina-text-muted)] hover:text-[var(--color-lumina-text)] transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <Link
                  href="/cart"
                  className="text-sm font-medium text-[var(--color-lumina-text-muted)] hover:text-[var(--color-lumina-text)] transition-colors"
                >
                  ← Back to Cart
                </Link>
              )}
              <button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep((s) => s + 1);
                  } else {
                    handlePlaceOrder();
                  }
                }}
                disabled={!canProceed() || isProcessing}
                className="h-12 px-8 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : currentStep === steps.length - 1
                  ? "Place Order & Pay"
                  : "Continue"}
              </button>
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-[88px] lg:self-start">
            <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
              <h3
                className="text-lg mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[var(--color-lumina-text-secondary)] truncate mr-2">
                      {item.productName} ({item.variantName}) ×{item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {formatCurrency(
                        (parseFloat(item.unitPrice) * item.quantity).toFixed(2)
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-lumina-border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : formatCurrency(shippingCost.toFixed(2))}
                  </span>
                </div>
                {totalPrice >= 999 && shippingCost === 0 && (
                  <p className="text-xs text-green-600">
                    🎉 Free shipping on orders above ₹999
                  </p>
                )}
              </div>

              <div className="border-t border-[var(--color-lumina-border)] pt-4 mt-4">
                <div className="flex justify-between">
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {formatCurrency(orderTotal.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
