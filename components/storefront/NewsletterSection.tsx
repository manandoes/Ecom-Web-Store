"use client";

import { type FC } from "react";
import { motion } from "framer-motion";

export const NewsletterSection: FC = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[rgba(26,20,16,0.65)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-xl mx-auto text-center px-4"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
          Newsletter
        </p>
        <h2
          className="text-white text-3xl lg:text-[44px] leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Subscribe & Stay Inspired
        </h2>
        <p className="text-white/70 text-[15px] mb-8">
          Get early access to new scents, exclusive offers, and candle care tips.
        </p>

        <form className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:border-[var(--color-lumina-gold)] focus:outline-none backdrop-blur-sm transition-colors"
            required
          />
          <button
            type="submit"
            className="h-12 px-7 rounded-full bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-gold-hover)] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  );
};
