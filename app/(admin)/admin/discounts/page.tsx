"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

const demoDiscounts = [
  { id: "1", code: "WELCOME10", type: "percentage", value: "10", minOrder: "₹499", maxUses: 100, used: 12, active: true, expires: "2026-12-31" },
  { id: "2", code: "FLAT100", type: "fixed", value: "₹100", minOrder: "₹999", maxUses: 50, used: 8, active: true, expires: "2026-06-30" },
];

export default function AdminDiscountsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Discount Codes</h1>
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors">
          <Plus className="w-4 h-4" />
          Create Code
        </button>
      </div>

      <div className="rounded-2xl border border-[#2a2a2e] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1a1a1e] text-[#8b8b8b] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Value</th>
              <th className="text-left px-4 py-3 font-medium">Min Order</th>
              <th className="text-left px-4 py-3 font-medium">Usage</th>
              <th className="text-left px-4 py-3 font-medium">Expires</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoDiscounts.map((d) => (
              <tr key={d.id} className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-medium text-amber-400">
                  {d.code}
                </td>
                <td className="px-4 py-3 capitalize">{d.type}</td>
                <td className="px-4 py-3 font-medium">
                  {d.type === "percentage" ? `${d.value}%` : d.value}
                </td>
                <td className="px-4 py-3 text-[#8b8b8b]">{d.minOrder}</td>
                <td className="px-4 py-3">
                  {d.used}/{d.maxUses}
                </td>
                <td className="px-4 py-3 text-[#8b8b8b]">{d.expires}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      d.active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Edit className="w-4 h-4 text-[#8b8b8b]" />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
