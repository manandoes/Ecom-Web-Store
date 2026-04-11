"use client";

import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  // Demo — will be fetched via API
  const orders: {
    orderNumber: string;
    date: string;
    status: string;
    total: string;
    items: number;
  }[] = [];

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    dispatched: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1
        className="text-2xl lg:text-3xl mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <Package className="w-12 h-12 mx-auto text-[var(--color-lumina-text-muted)] mb-4" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-sm text-[var(--color-lumina-text-muted)] mb-6">
            Your order history will appear here after your first purchase.
          </p>
          <Link
            href="/candles"
            className="inline-flex h-10 items-center px-6 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/account/orders/${order.orderNumber}`}
              className="flex items-center justify-between p-5 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text-muted)] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium">{order.orderNumber}</p>
                <p className="text-xs text-[var(--color-lumina-text-muted)]">
                  {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColor[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-medium">{order.total}</span>
                <ChevronRight className="w-4 h-4 text-[var(--color-lumina-text-muted)] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
