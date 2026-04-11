"use client";

import { Search, Eye } from "lucide-react";

export default function AdminCustomersPage() {
  const customers: {
    id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: string;
    joinedDate: string;
  }[] = [];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Customers</h1>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      <div className="rounded-2xl border border-[#2a2a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1a1e] text-[#8b8b8b] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Orders</th>
              <th className="text-left px-4 py-3 font-medium">Total Spent</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#8b8b8b]">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-[#8b8b8b]">{c.email}</p>
                  </td>
                  <td className="px-4 py-3">{c.orders}</td>
                  <td className="px-4 py-3 font-medium">{c.totalSpent}</td>
                  <td className="px-4 py-3 text-[#8b8b8b]">{c.joinedDate}</td>
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
