"use client";

import { type FC, useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { label: "Customer Satisfaction", value: 98, suffix: "%" },
  { label: "Candles Poured", value: 5000, suffix: "+", prefix: "" },
  { label: "Happy Customers", value: 10000, suffix: "+", prefix: "" },
  { label: "Average Rating", value: 4.9, suffix: "/5" },
];

function AnimatedNumber({
  value,
  suffix,
  prefix = "",
}: {
  value: number;
  suffix: string;
  prefix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const display = Number.isInteger(value)
    ? displayed.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : displayed.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export const StatsStrip: FC = () => {
  return (
    <section className="bg-[var(--color-lumina-dark)] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`text-center ${
                i < 3 ? "lg:border-r lg:border-[var(--color-lumina-dark-2)]" : ""
              }`}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-lumina-text-muted)] mb-2">
                {stat.label}
              </p>
              <p
                className="text-white text-[48px] lg:text-[60px] leading-none font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
