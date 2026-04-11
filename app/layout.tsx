import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lumina Candles — Handcrafted Scented Candles",
    template: "%s | Lumina Candles",
  },
  description:
    "Discover handmade scented candles crafted with natural soy, coconut, and beeswax. Premium artisan candles hand-poured in India.",
  keywords: [
    "scented candles",
    "handmade candles",
    "soy candles",
    "artisan candles",
    "luxury candles",
    "India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Lumina Candles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
