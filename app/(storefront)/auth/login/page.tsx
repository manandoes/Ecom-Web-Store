"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { loginAction, googleSignInAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAction(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Login successful
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignInAction();
    } catch {
      // Redirect happens server-side
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1602607526325-cc002016a227?w=1200&q=80"
          alt="Lumina Candles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(26,20,16,0.3)]" />
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-white text-4xl leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Welcome Back to Lumina
          </h2>
          <p className="text-white/70 text-sm">
            Sign in to access your orders, wishlist, and exclusive offers.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-lumina-cream)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px]"
        >
          <Link href="/" className="text-3xl tracking-tight block mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Lumina
          </Link>

          <h1 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Sign In</h1>
          <p className="text-sm text-[var(--color-lumina-text-secondary)] mb-8">
            Enter your email and password to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-full border border-[var(--color-lumina-border)] text-sm font-medium flex items-center justify-center gap-3 hover:bg-[var(--color-lumina-cream-dark)] transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-[var(--color-lumina-border)]" />
            <span className="text-xs text-[var(--color-lumina-text-muted)]">or</span>
            <hr className="flex-1 border-[var(--color-lumina-border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-lumina-text-muted)] block mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-[var(--color-lumina-border)] bg-[var(--color-lumina-white)] text-sm focus:border-[var(--color-lumina-gold)] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-lumina-text-muted)] block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-lumina-text-muted)]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-[var(--color-lumina-border)] bg-[var(--color-lumina-white)] text-sm focus:border-[var(--color-lumina-gold)] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[var(--color-lumina-text-muted)]" /> : <Eye className="w-4 h-4 text-[var(--color-lumina-text-muted)]" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--color-lumina-border)] accent-[var(--color-lumina-gold)]" />
                <span className="text-sm text-[var(--color-lumina-text-secondary)]">Remember me</span>
              </label>
              <Link href="/auth/reset-password" className="text-sm text-[var(--color-lumina-gold-deep)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-[var(--color-lumina-text-secondary)] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[var(--color-lumina-gold-deep)] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
