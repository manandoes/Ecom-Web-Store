"use client";

import { type FC, useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils/cn";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export const Header: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount, openCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const itemCount = useCartStore((s) => s.items.length > 0 ? s.getItemCount() : 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--color-lumina-cream)] shadow-[0_1px_0_var(--color-lumina-border)]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-lumina-text)]" style={{ fontFamily: "var(--font-display)" }}>
            Lumina
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/candles"
              className="text-sm font-medium text-[var(--color-lumina-text)] hover:text-[var(--color-lumina-gold)] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--color-lumina-text)] hover:text-[var(--color-lumina-gold)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/journal"
              className="text-sm font-medium text-[var(--color-lumina-text)] hover:text-[var(--color-lumina-gold)] transition-colors"
            >
              Journal
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-lumina-cream-dark)] hover:bg-[var(--color-lumina-border)] transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] text-[var(--color-lumina-text)]" />
            </button>

            <Link
              href="/account/wishlist"
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-lumina-cream-dark)] hover:bg-[var(--color-lumina-border)] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px] text-[var(--color-lumina-text)]" />
            </Link>

            <Link
              href="/auth/login"
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-lumina-cream-dark)] hover:bg-[var(--color-lumina-border)] transition-colors"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px] text-[var(--color-lumina-text)]" />
            </Link>

            <button
              onClick={openCart}
              className="relative flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-lumina-cream-dark)] hover:bg-[var(--color-lumina-border)] transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-[18px] h-[18px] text-[var(--color-lumina-text)]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              href="/candles"
              className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors"
            >
              Shop Now
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-lumina-cream-dark)] hover:bg-[var(--color-lumina-border)] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-[18px] h-[18px]" />
              ) : (
                <Menu className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-lumina-cream)] border-t border-[var(--color-lumina-border)] px-4 py-6">
            <div className="flex flex-col gap-4">
              <Link href="/candles" className="text-[15px] font-medium py-2" onClick={closeMobileMenu}>Shop</Link>
              <Link href="/about" className="text-[15px] font-medium py-2" onClick={closeMobileMenu}>About</Link>
              <Link href="/journal" className="text-[15px] font-medium py-2" onClick={closeMobileMenu}>Journal</Link>
              <hr className="border-[var(--color-lumina-border)]" />
              <Link href="/auth/login" className="text-[15px] font-medium py-2" onClick={closeMobileMenu}>Account</Link>
              <Link href="/account/wishlist" className="text-[15px] font-medium py-2" onClick={closeMobileMenu}>Wishlist</Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
};
