"use client";

import { type FC } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

const featured: Testimonial = {
  name: "Ananya Sharma",
  location: "Mumbai",
  quote:
    "The Lavender Dreams candle transformed my living room into a spa retreat. The scent is so authentic — nothing artificial about it. I've been buying from Lumina for six months and every candle is consistently perfect.",
  rating: 5,
};

const mini: Testimonial[] = [
  {
    name: "Riya Patel",
    location: "Bangalore",
    quote: "Best candles I've ever purchased. The packaging is gorgeous too!",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    location: "Delhi",
    quote: "Bought as a gift and my wife loved it. The burn time is amazing.",
    rating: 5,
  },
  {
    name: "Priya Menon",
    location: "Chennai",
    quote: "The Forest Whisper candle smells incredible. Will definitely reorder!",
    rating: 5,
  },
];

export const TestimonialSection: FC = () => {
  return (
    <section className="bg-[var(--color-lumina-dark)] py-20 lg:py-28">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-3">
            What They Say
          </p>
          <h2
            className="text-white text-3xl lg:text-[48px] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loved by Thousands
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full mx-auto text-center mb-16 px-4"
        >
          <Quote className="w-10 h-10 text-[var(--color-lumina-gold)] mx-auto mb-6 opacity-40" />
          <p
            className="text-white text-lg lg:text-[28px] leading-relaxed italic mb-6 w-full mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;{featured.quote}&rdquo; 
          </p>
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: featured.rating }).map((_, i) => (
              <Star
                key={i} 
                className="w-4 h-4 fill-[var(--color-lumina-gold)] text-[var(--color-lumina-gold)]"
              /> 
            ))}
          </div>
          <p className="text-[var(--color-lumina-cream)] text-sm font-medium">
            {featured.name}
          </p>
          <p className="text-[var(--color-lumina-text-muted)] text-xs">
            {featured.location}
          </p>
        </motion.div>

        {/* Mini testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mini.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-[var(--color-lumina-dark-2)] rounded-2xl p-6"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-[var(--color-lumina-gold)] text-[var(--color-lumina-gold)]"
                  />
                ))}
              </div>
              <p className="text-[var(--color-lumina-cream)] text-sm leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-[var(--color-lumina-text-muted)] text-xs">
                {t.name} · {t.location}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
