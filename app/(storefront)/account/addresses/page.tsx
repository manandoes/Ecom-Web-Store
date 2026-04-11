"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses] = useState<
    {
      id: string;
      firstName: string;
      lastName: string;
      line1: string;
      city: string;
      state: string;
      pinCode: string;
      isDefault: boolean;
    }[]
  >([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl lg:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Addresses
        </h1>
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors">
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <MapPin className="w-12 h-12 mx-auto text-[var(--color-lumina-text-muted)] mb-4" />
          <p className="text-lg font-medium mb-2">No saved addresses</p>
          <p className="text-sm text-[var(--color-lumina-text-muted)]">
            Add an address to speed up your checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-5 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)] relative"
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[var(--color-lumina-gold)] text-[10px] font-medium">
                  Default
                </span>
              )}
              <p className="text-sm font-medium">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-sm text-[var(--color-lumina-text-secondary)]">
                {addr.line1}
              </p>
              <p className="text-sm text-[var(--color-lumina-text-secondary)]">
                {addr.city}, {addr.state} {addr.pinCode}
              </p>
              <div className="flex gap-3 mt-4">
                <button className="text-xs text-[var(--color-lumina-gold-deep)] hover:underline">
                  Edit
                </button>
                <button className="text-xs text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
