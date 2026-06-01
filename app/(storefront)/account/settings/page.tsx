"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Lock, Phone } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  return (
    <div>
      <h1
        className="text-2xl lg:text-3xl mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Account Settings
      </h1>

      <div className="space-y-8">
        {/* Profile */}
        <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <h2 className="text-sm font-medium uppercase tracking-[0.08em] mb-6">
            Profile Information
          </h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-gray-50 text-sm text-[var(--color-lumina-text-muted)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                />
              </div>
            </div>
            <button className="h-10 px-6 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <h2 className="text-sm font-medium uppercase tracking-[0.08em] mb-6">
            Change Password
          </h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  type="password"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  type="password"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                />
              </div>
            </div>
            <button className="h-10 px-6 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-sm font-medium hover:opacity-90 transition-opacity">
              Update Password
            </button>
          </div>
        </div>

        {/* Marketing */}
        <div className="p-6 rounded-2xl bg-[var(--color-lumina-cream-dark)] border border-[var(--color-lumina-border)]">
          <h2 className="text-sm font-medium uppercase tracking-[0.08em] mb-4">
            Preferences
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[var(--color-lumina-border)] accent-[var(--color-lumina-gold)]"
            />
            <span className="text-sm">
              Receive marketing emails and new collection announcements
            </span>
          </label>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-200 bg-red-50">
          <h2 className="text-sm font-medium uppercase tracking-[0.08em] text-red-600 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-red-500 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button className="h-10 px-6 rounded-full border border-red-300 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
