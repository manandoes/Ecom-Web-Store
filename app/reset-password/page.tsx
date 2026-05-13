"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth";
import { Lock } from "lucide-react";

export default function ResetPasswordUpdatePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center bg-[var(--color-lumina-cream)]">
        <div className="text-center">
          <h1 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Invalid Link</h1>
          <p className="text-[var(--color-lumina-text-muted)]">No reset token provided.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);

      const res = await resetPasswordAction(formData);

      if (res.error) {
        setError(res.error);
      } else {
        alert("Password updated successfully");
        router.push("/auth/login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center bg-[var(--color-lumina-cream)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] mx-auto px-6 py-12"
      >
        <h1
          className="text-3xl mb-2 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Update Password
        </h1>

        <p className="text-[var(--color-lumina-text-muted)] text-sm mb-8 text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
