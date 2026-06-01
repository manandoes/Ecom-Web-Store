"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Edit, Trash2, Tag, X } from "lucide-react";
import {
  createDiscountAction,
  updateDiscountAction,
  deleteDiscountAction,
  toggleDiscountAction,
} from "@/lib/actions/admin-discounts";

type Discount = {
  id: string;
  code: string;
  type: string;
  value: string;
  minOrderValue: string | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
};

const emptyForm = {
  code: "",
  type: "percentage",
  value: "",
  minOrderValue: "",
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function fetchDiscounts() {
    try {
      const res = await fetch("/api/v1/admin/discounts");
      if (res.ok) {
        const data = await res.json();
        setDiscounts(data.discounts);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDiscounts();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(d: Discount) {
    setEditingId(d.id);
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minOrderValue: d.minOrderValue || "",
      maxUses: d.maxUses?.toString() || "",
      expiresAt: d.expiresAt
        ? new Date(d.expiresAt).toISOString().slice(0, 10)
        : "",
      isActive: d.isActive,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setFormError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.code.trim()) return setFormError("Code is required.");
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0)
      return setFormError("Value must be a positive number.");

    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: form.value,
      minOrderValue: form.minOrderValue || "0",
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };

    startTransition(async () => {
      const result = editingId
        ? await updateDiscountAction(editingId, payload)
        : await createDiscountAction(payload);

      if (result.error) {
        setFormError(result.error);
      } else {
        closeModal();
        fetchDiscounts();
      }
    });
  }

  function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteDiscountAction(id);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleDiscountAction(id, !current);
      if (result.success) {
        setDiscounts((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isActive: !current } : d))
        );
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Discount Codes</h1>
          {!loading && (
            <p className="text-xs text-[#8b8b8b] mt-1">
              {discounts.length} coupon{discounts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors"
        >
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
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[#8b8b8b]">
                  Loading...
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <Tag className="w-8 h-8 mx-auto mb-3 text-[#8b8b8b] opacity-50" />
                  <p className="text-[#8b8b8b]">No coupon codes yet.</p>
                </td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-amber-400">
                    {d.code}
                  </td>
                  <td className="px-4 py-3 capitalize">{d.type}</td>
                  <td className="px-4 py-3 font-medium">
                    {d.type === "percentage" ? `${d.value}%` : `₹${d.value}`}
                  </td>
                  <td className="px-4 py-3 text-[#8b8b8b]">
                    {d.minOrderValue && parseFloat(d.minOrderValue) > 0
                      ? `₹${d.minOrderValue}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {d.usedCount}
                    {d.maxUses ? `/${d.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[#8b8b8b] text-xs">
                    {d.expiresAt
                      ? new Date(d.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(d.id, d.isActive)}
                      disabled={isPending}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-75 disabled:opacity-50 ${
                        d.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {d.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#8b8b8b]" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.code)}
                        disabled={isPending}
                        className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#2a2a2e] bg-[#141416] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Coupon" : "Create Coupon Code"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-[#2a2a2e] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8b8b8b] mb-1.5">
                  Code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="e.g. WELCOME10"
                  className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white font-mono placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8b8b8b] mb-1.5">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8b8b8b] mb-1.5">
                    Value {form.type === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === "percentage" ? "10" : "100"}
                    className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8b8b8b] mb-1.5">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.minOrderValue}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, minOrderValue: e.target.value }))
                    }
                    placeholder="0"
                    className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8b8b8b] mb-1.5">
                    Max Uses (leave blank = unlimited)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.maxUses}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxUses: e.target.value }))
                    }
                    placeholder="Unlimited"
                    className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white placeholder-[#8b8b8b] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8b8b8b] mb-1.5">
                  Expiry Date (leave blank = no expiry)
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiresAt: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[#2a2a2e] bg-[#1a1a1e] text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    form.isActive ? "bg-amber-500" : "bg-[#2a2a2e]"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-[#8b8b8b]">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-10 rounded-lg border border-[#2a2a2e] text-sm text-[#8b8b8b] hover:text-white hover:border-[#3a3a3e] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-10 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {isPending
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
