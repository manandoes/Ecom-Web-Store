"use client";

import { type FC } from "react";

const scentNames = [
  "Floral",
  "Woody",
  "Fresh",
  "Citrus",
  "Spicy",
  "Gourmand",
  "Earthy",
  "Smoky",
  "Herbal",
  "Oceanic",
];

export const MarqueeStrip: FC = () => {
  const items = [...scentNames, ...scentNames];

  return (
    <section className="bg-[var(--color-lumina-dark)] py-4 overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite]">
        {items.map((name, i) => (
          <span
            key={i}
            className={`flex-shrink-0 mx-6 text-lg italic tracking-wide ${
              i % 2 === 0
                ? "text-[var(--color-lumina-gold)]"
                : "text-[var(--color-lumina-white)]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
            <span className="mx-6 text-[var(--color-lumina-text-muted)]">·</span>
          </span>
        ))}
      </div>
    </section>
  );
};
