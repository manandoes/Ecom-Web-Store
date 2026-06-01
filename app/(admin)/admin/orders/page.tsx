"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const nextStatuses: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["dispatched", "cancelled"],
  dispatched: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

type Order = {
  id: string;
  orderNumber: string;
  email: string;
  total: string;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
  user?: { name?: string } | null;
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status: statusFilter,
      });
      const res = await fetch(`/api/v1/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (e) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/v1/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  }

  const filtered = search
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase()) ||
          (o.user?.name || "").toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          {!loading && (
            <p className="text-xs text-[#8b8b8b] mt-1">{total} total order{total !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, email..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 pl-4 pr-8 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b8b8b] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#2a2a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1a1e] text-[#8b8b8b] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Items</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8b8b8b]">
                  Loading orders...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <Package className="w-8 h-8 mx-auto mb-3 text-[#8b8b8b] opacity-50" />
                  <p className="text-[#8b8b8b]">No orders found.</p>
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const actions = nextStatuses[order.status] || [];
                return (
                  <tr
                    key={order.id}
                    className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-amber-400">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-[#8b8b8b]">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#8b8b8b] text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColor[order.status] || "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {actions.length > 0 ? (
                        <div className="relative inline-block">
                          <select
                            disabled={updating === order.id}
                            onChange={(e) => {
                              if (e.target.value) handleStatusChange(order.id, e.target.value);
                              e.target.value = "";
                            }}
                            defaultValue=""
                            className="h-8 pl-3 pr-7 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          >
                            <option value="" disabled>
                              {updating === order.id ? "Updating..." : "Move to..."}
                            </option>
                            {actions.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b8b8b] pointer-events-none" />
                        </div>
                      ) : (
                        <span className="text-xs text-[#8b8b8b]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-[#8b8b8b]">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2a2a2e] hover:bg-[#1a1a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2a2a2e] hover:bg-[#1a1a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
