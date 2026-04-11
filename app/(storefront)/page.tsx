"use client";

import { type FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/storefront/HeroSection";
import { MarqueeStrip } from "@/components/storefront/MarqueeStrip";
import { StatsStrip } from "@/components/storefront/StatsStrip";
import { ProductCard } from "@/components/storefront/ProductCard";
import { TestimonialSection } from "@/components/storefront/TestimonialSection";
import { NewsletterSection } from "@/components/storefront/NewsletterSection";
import { Droplets, Wind, Flame } from "lucide-react";

// Demo product data for initial render (will be replaced by DB queries)
const demoProducts = [
  {
    id: "1",
    name: "Lavender Dreams",
    slug: "lavender-dreams",
    shortDesc: "Calming lavender with hints of vanilla",
    scentFamily: "floral",
    basePrice: "599.00",
    avgRating: "4.7",
    reviewCount: 42,
    images: [{ url: "/images/products/lavender-dreams.png", altText: "Lavender candle" }],
    variants: [
      { id: "v1", name: "4oz", price: "299.00", stockQty: 12 },
      { id: "v2", name: "8oz", price: "599.00", stockQty: 8 },
    ],
  },
  {
    id: "2",
    name: "Forest Whisper",
    slug: "forest-whisper",
    shortDesc: "Deep cedarwood and pine needles",
    scentFamily: "woody",
    basePrice: "699.00",
    avgRating: "4.9",
    reviewCount: 38,
    images: [{ url: "/images/products/forest-whisper.png", altText: "Forest candle" }],
    variants: [
      { id: "v3", name: "4oz", price: "349.00", stockQty: 15 },
      { id: "v4", name: "8oz", price: "699.00", stockQty: 6 },
    ],
  },
  {
    id: "3",
    name: "Citrus Sunrise",
    slug: "citrus-sunrise",
    shortDesc: "Bright bergamot and sweet orange",
    scentFamily: "citrus",
    basePrice: "499.00",
    avgRating: "4.5",
    reviewCount: 27,
    images: [{ url: "/images/products/citrus-sunrise.png", altText: "Citrus candle" }],
    variants: [
      { id: "v5", name: "4oz", price: "249.00", stockQty: 20 },
      { id: "v6", name: "8oz", price: "499.00", stockQty: 10 },
    ],
  },
  {
    id: "4",
    name: "Vanilla Chai",
    slug: "vanilla-chai",
    shortDesc: "Warm spiced vanilla with cinnamon",
    scentFamily: "spicy",
    basePrice: "649.00",
    avgRating: "4.8",
    reviewCount: 56,
    images: [{ url: "/images/products/vanilla-chai.png", altText: "Vanilla chai candle" }],
    variants: [
      { id: "v7", name: "4oz", price: "329.00", stockQty: 18 },
      { id: "v8", name: "8oz", price: "649.00", stockQty: 4 },
    ],
  },
];

const scentFamilies = [
  { name: "Floral", slug: "floral", image: "/images/products/rose-garden.png" },
  { name: "Woody", slug: "woody", image: "/images/products/forest-whisper.png" },
  { name: "Fresh", slug: "fresh", image: "/images/products/ocean-breeze.png" },
  { name: "Citrus", slug: "citrus", image: "/images/products/citrus-sunrise.png" },
  { name: "Spicy", slug: "spicy", image: "/images/products/vanilla-chai.png" },
  { name: "Gourmand", slug: "gourmand", image: "/images/products/lavender-dreams.png" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Marquee */}
      <MarqueeStrip />

      {/* Stats */}
      <StatsStrip />

      {/* Featured Products */}
      <section className="bg-[var(--color-lumina-cream)] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
              Our Collection
            </p>
            <h2
              className="text-3xl lg:text-[48px] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Handpicked for Your Home
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/candles"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-[var(--color-lumina-dark)] text-[var(--color-lumina-cream)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-dark-2)] transition-colors"
            >
              View All Candles
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Split */}
      <section className="bg-[var(--color-lumina-cream-dark)] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
            >
              <img
                src="/images/products/lavender-dreams.png"
                alt="Candle making process"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
                Our Story
              </p>
              <h2
                className="text-3xl lg:text-[44px] leading-tight mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Small Batch,
                <br />
                Big Soul
              </h2>
              <p className="text-[var(--color-lumina-text-secondary)] text-[15px] leading-relaxed mb-4">
                Every Lumina candle is hand-poured in our studio using 100% natural soy and coconut wax.
                We source premium fragrance oils and essential oils to create scents that transform
                your space into a sanctuary.
              </p>
              <p className="text-[var(--color-lumina-text-secondary)] text-[15px] leading-relaxed mb-8">
                No synthetic dyes. No paraffin. No shortcuts. Just clean-burning candles that fill
                your home with warmth and calm.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-3.5 rounded-full border-[1.5px] border-[var(--color-lumina-text)] text-[13px] font-medium tracking-[0.06em] hover:bg-[var(--color-lumina-text)] hover:text-[var(--color-lumina-cream)] transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scent Profile Feature */}
      <section className="bg-[var(--color-lumina-cream)] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
                Why It Matters
              </p>
              <h2
                className="text-3xl lg:text-[44px] leading-tight mb-10"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Every Scent Tells a Story
              </h2>

              <div className="space-y-8">
                {[
                  {
                    Icon: Droplets,
                    title: "Top Notes",
                    desc: "The first impression — bright, fresh, and fleeting. They greet you the moment you strike the match.",
                  },
                  {
                    Icon: Wind,
                    title: "Middle Notes",
                    desc: "The heart of the fragrance. They develop after 15 minutes and define the candle's character.",
                  },
                  {
                    Icon: Flame,
                    title: "Base Notes",
                    desc: "The lingering foundation. Deep, warm, and grounding — they last long after the flame goes out.",
                  },
                ].map(({ Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-[var(--color-lumina-cream-dark)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[var(--color-lumina-gold-deep)]" />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-medium mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {title}
                      </h3>
                      <p className="text-sm text-[var(--color-lumina-text-secondary)] leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden"
            >
              <img
                src="/images/products/citrus-sunrise.png"
                alt="Candle scent profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Scent Family */}
      <section className="bg-[var(--color-lumina-cream-dark)] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
              Discover
            </p>
            <h2
              className="text-3xl lg:text-[48px] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Shop by Scent Family
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {scentFamilies.map((family, i) => (
              <motion.div
                key={family.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/candles?scentFamily=${family.slug}`}
                  className="group block text-center"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-[var(--color-lumina-border)]">
                    <img
                      src={family.image}
                      alt={family.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className="text-sm font-medium group-hover:text-[var(--color-lumina-gold)] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {family.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}
