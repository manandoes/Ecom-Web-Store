"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  ChevronLeft,
  Menu,
  Flame,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/discounts", label: "Discounts", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f0f10] text-[#e8e8e8] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-[260px]" : "w-[72px]"
        } flex-shrink-0 border-r border-[#1f1f23] bg-[#141416] transition-all duration-300 sticky top-0 h-screen overflow-y-auto`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold tracking-wide">
                LUMINA
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-[#1f1f23] flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="px-2 mt-4 space-y-1">
          {adminNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-[#8b8b8b] hover:text-white hover:bg-[#1f1f23]"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#1f1f23]">
            <p className="text-xs text-[#8b8b8b]">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">Admin</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}
