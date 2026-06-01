"use client";

import Link from "next/link";
import { Package, Heart, MapPin, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AccountDashboardPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name ?? "there",
    email: session?.user?.email ?? "",
  };

  return (
    <div>
      <h1
        className="text-2xl lg:text-3xl mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome back, {user.name}!
      </h1>
      <p className="text-sm text-[var(--color-lumina-text-muted)] mb-8">
        {user.email}
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            href: "/account/orders",
            icon: Package,
            label: "Orders",
            value: "3",
            desc: "View order history",
          },
          {
            href: "/account/wishlist",
            icon: Heart,
            label: "Wishlist",
            value: "5",
            desc: "Saved items",
          },
          {
            href: "/account/addresses",
            icon: MapPin,
            label: "Addresses",
            value: "2",
            desc: "Saved addresses",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group p-5 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)] hover:border-[var(--color-lumina-text-muted)] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon className="w-5 h-5 text-[var(--color-lumina-text-muted)]" />
              <ChevronRight className="w-4 h-4 text-[var(--color-lumina-text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-2xl font-medium mb-1">{item.value}</p>
            <p className="text-sm text-[var(--color-lumina-text-muted)]">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-[var(--color-lumina-gold-deep)] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="text-center py-8 text-sm text-[var(--color-lumina-text-muted)]">
          No orders yet. Your order history will appear here.
        </div>
      </div>
    </div>
  );
}
