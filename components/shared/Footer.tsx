import { type FC } from "react";
import Link from "next/link";

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/></svg>
);
const TwitterXIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);


export const Footer: FC = () => {
  return (
    <footer className="bg-[var(--color-lumina-dark)] text-[var(--color-lumina-text-muted)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-[var(--color-lumina-cream)] text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lumina
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Handcrafted scented candles poured with love in small batches. Made with natural waxes and premium fragrance oils.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-lumina-dark-2)] hover:border-[var(--color-lumina-gold)] hover:text-[var(--color-lumina-gold)] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-lumina-dark-2)] hover:border-[var(--color-lumina-gold)] hover:text-[var(--color-lumina-gold)] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-lumina-dark-2)] hover:border-[var(--color-lumina-gold)] hover:text-[var(--color-lumina-gold)] transition-colors"
                aria-label="Twitter"
              >
                <TwitterXIcon />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-[var(--color-lumina-cream)] text-sm font-medium uppercase tracking-[0.12em] mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li><Link href="/candles" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">All Candles</Link></li>
              <li><Link href="/candles?scentFamily=floral" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Floral</Link></li>
              <li><Link href="/candles?scentFamily=woody" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Woody</Link></li>
              <li><Link href="/candles?scentFamily=fresh" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Fresh</Link></li>
              <li><Link href="/candles?scentFamily=citrus" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Citrus</Link></li>
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-[var(--color-lumina-cream)] text-sm font-medium uppercase tracking-[0.12em] mb-4">
              Help
            </h3>
            <ul className="space-y-3">
              <li><Link href="/account/orders" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-[var(--color-lumina-white)] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[var(--color-lumina-cream)] text-sm font-medium uppercase tracking-[0.12em] mb-4">
              Stay Inspired
            </h3>
            <p className="text-sm mb-4">
              Subscribe for exclusive scents and offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-10 px-4 rounded-full bg-[var(--color-lumina-dark-2)] border border-[var(--color-lumina-dark-2)] text-[var(--color-lumina-cream)] text-sm placeholder:text-[var(--color-lumina-text-muted)] focus:border-[var(--color-lumina-gold)] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-full bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] text-sm font-medium hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[var(--color-lumina-dark-2)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-lumina-text-secondary)]">
            © {new Date().getFullYear()} Lumina Candles. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs hover:text-[var(--color-lumina-white)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:text-[var(--color-lumina-white)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
