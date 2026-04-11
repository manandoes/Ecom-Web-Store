"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to server action
    setSubmitted(true);
  };

  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center bg-[var(--color-lumina-cream)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] mx-auto px-6 py-12"
      >
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-lumina-text-muted)] hover:text-[var(--color-lumina-text)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Reset Password
        </h1>

        {!submitted ? (
          <>
            <p className="text-[var(--color-lumina-text-muted)] text-sm mb-8">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-white focus:outline-none focus:border-[var(--color-lumina-gold)] transition-colors text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[var(--color-lumina-gold)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2
              className="text-xl mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Check your email
            </h2>
            <p className="text-sm text-[var(--color-lumina-text-muted)] mb-6">
              We&apos;ve sent a password reset link to{" "}
              <strong>{email}</strong>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-[var(--color-lumina-gold-deep)] hover:underline"
            >
              Didn&apos;t receive it? Try again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
