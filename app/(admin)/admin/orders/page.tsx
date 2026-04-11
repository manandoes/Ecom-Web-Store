"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  dispatched: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  // Demo data — will be replaced with server query
  const orders: {
    id: string;
    orderNumber: string;
    customer: string;
    email: string;
    total: string;
    status: string;
    date: string;
    items: number;
  }[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#8b8b8b]">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors"
                >
                  <td className="px-4 py-3 font-medium font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-[#8b8b8b]">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#8b8b8b]">{order.date}</td>
                  <td className="px-4 py-3">{order.items}</td>
                  <td className="px-4 py-3 font-medium">{order.total}</td>
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
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Eye className="w-4 h-4 text-[#8b8b8b]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
