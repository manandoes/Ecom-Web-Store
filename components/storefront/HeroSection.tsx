"use client";

import { type FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const HeroSection: FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/hero-bg.png')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(26,20,16,0.45)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-white text-5xl sm:text-7xl lg:text-[88px] leading-[1.0] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Handcrafted
            <br />
            <em>Scented</em>
            <br />
            Candles
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/80 text-[17px] mt-6 max-w-md mx-auto text-wrap-normal"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Small-batch candles poured with natural waxes & premium fragrance oils. Made in India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <Link
            href="/candles"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-[var(--color-lumina-gold)] text-[var(--color-lumina-text)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-gold-hover)] transition-colors"
          >
            Shop the Collection
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-8 py-3.5 rounded-full border-[1.5px] border-white/40 text-white text-[13px] font-medium tracking-[0.06em] hover:border-[var(--color-lumina-gold)] hover:text-[var(--color-lumina-gold)] transition-colors"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
