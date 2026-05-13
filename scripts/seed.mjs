/**
 * Seed script for Lumina Candles e-commerce store
 * Run: node scripts/seed.mjs
 *
 * Creates:
 *  - 1 admin user + 1 test customer
 *  - 6 categories
 *  - 12 products (with variants + images)
 */
import postgres from "postgres";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL, { connect_timeout: 15 });

// ─── Helpers ────────────────────────────────────────────
function slug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sku(prefix, size) {
  return `LUM-${prefix}-${size}`.toUpperCase();
}

// ─── Categories ─────────────────────────────────────────
const categoryData = [
  {
    id: randomUUID(),
    name: "Scented Candles",
    slug: "scented-candles",
    description: "Hand-poured candles with curated fragrance profiles for every mood.",
    sortOrder: 1,
  },
  {
    id: randomUUID(),
    name: "Pillar Candles",
    slug: "pillar-candles",
    description: "Free-standing sculptural candles that make a statement.",
    sortOrder: 2,
  },
  {
    id: randomUUID(),
    name: "Jar Candles",
    slug: "jar-candles",
    description: "Classic glass-jar candles for everyday warmth.",
    sortOrder: 3,
  },
  {
    id: randomUUID(),
    name: "Taper Candles",
    slug: "taper-candles",
    description: "Elegant taper candles for dining tables and holders.",
    sortOrder: 4,
  },
  {
    id: randomUUID(),
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Beautifully packaged candle sets — perfect for gifting.",
    sortOrder: 5,
  },
  {
    id: randomUUID(),
    name: "Limited Edition",
    slug: "limited-edition",
    description: "Seasonal and limited-run candles available while stocks last.",
    sortOrder: 6,
  },
];

// ─── Products ───────────────────────────────────────────
// Using Unsplash candle images
const candleImages = [
  "https://images.unsplash.com/photo-1602607526325-cc002016a227?w=800&q=80",
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800&q=80",
  "https://images.unsplash.com/photo-1608181831688-ba943e6f3c26?w=800&q=80",
  "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80",
  "https://images.unsplash.com/photo-1596463059283-da257ba4c9ab?w=800&q=80",
  "https://images.unsplash.com/photo-1607444011547-5765e4b1c5ce?w=800&q=80",
  "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?w=800&q=80",
  "https://images.unsplash.com/photo-1616401784845-180882c0083d?w=800&q=80",
  "https://images.unsplash.com/photo-1595535373192-fc438458db75?w=800&q=80",
  "https://images.unsplash.com/photo-1605651531144-51381895e23d?w=800&q=80",
  "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&q=80",
];

const productData = [
  {
    name: "Golden Hour",
    shortDesc: "Warm amber & vanilla notes that capture the magic of sunset.",
    description:
      "Golden Hour wraps your space in the warm, inviting glow of amber and vanilla. With subtle hints of sandalwood and musk, this candle evokes the serene beauty of a sunset — perfect for unwinding after a long day.",
    scentFamily: "Warm & Spicy",
    topNotes: "Bergamot, Mandarin",
    middleNotes: "Amber, Vanilla Bean",
    baseNotes: "Sandalwood, White Musk",
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTime: "45-55 hours",
    basePrice: "799.00",
    categorySlug: "scented-candles",
    isFeatured: true,
    tags: ["bestseller", "warm", "vanilla"],
  },
  {
    name: "Midnight Garden",
    shortDesc: "Dark florals and earthy undertones for late-night contemplation.",
    description:
      "Midnight Garden is a mysterious blend of jasmine, tuberose, and dark plum, layered over a deep base of vetiver and black amber. Light it after dark and let the night bloom.",
    scentFamily: "Floral",
    topNotes: "Black Plum, Bergamot",
    middleNotes: "Jasmine, Tuberose",
    baseNotes: "Vetiver, Black Amber",
    waxType: "Soy-Coconut Blend",
    wickType: "Wooden Wick",
    burnTime: "50-60 hours",
    basePrice: "899.00",
    categorySlug: "scented-candles",
    isFeatured: true,
    tags: ["floral", "luxury", "evening"],
  },
  {
    name: "Sea Salt & Driftwood",
    shortDesc: "A coastal escape in a candle — mineral sea salt, sun-bleached wood.",
    description:
      "Transport yourself to a windswept shoreline with our Sea Salt & Driftwood candle. Crisp ocean air mingles with the warmth of sun-bleached driftwood and a whisper of white tea.",
    scentFamily: "Fresh & Aquatic",
    topNotes: "Sea Salt, Ozone",
    middleNotes: "White Tea, Lily",
    baseNotes: "Driftwood, Cedarwood",
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTime: "40-50 hours",
    basePrice: "749.00",
    categorySlug: "jar-candles",
    isFeatured: true,
    tags: ["fresh", "beach", "summer"],
  },
  {
    name: "Forest Bathing",
    shortDesc: "Pine, eucalyptus, and moss — a woodland retreat in your room.",
    description:
      "Inspired by the Japanese practice of Shinrin-yoku, Forest Bathing brings the soothing essence of old-growth forests into your space. Layered with pine needle, eucalyptus, and damp earth moss.",
    scentFamily: "Woody & Green",
    topNotes: "Eucalyptus, Pine Needle",
    middleNotes: "Cedar Leaf, Fern",
    baseNotes: "Moss, Patchouli",
    waxType: "Coconut Wax",
    wickType: "Cotton Wick",
    burnTime: "45-55 hours",
    basePrice: "849.00",
    categorySlug: "scented-candles",
    isFeatured: false,
    tags: ["woody", "green", "calming"],
  },
  {
    name: "Espresso Martini",
    shortDesc: "Rich coffee, dark chocolate, and a hint of Kahlúa.",
    description:
      "Espresso Martini is an indulgent blend of freshly-roasted arabica coffee, dark Venezuelan chocolate, and a touch of coffee liqueur warmth. A candle for cocktail lovers and night owls alike.",
    scentFamily: "Gourmand",
    topNotes: "Coffee Bean, Cardamom",
    middleNotes: "Dark Chocolate, Kahlúa",
    baseNotes: "Caramel, Tonka Bean",
    waxType: "Soy Wax",
    wickType: "Wooden Wick",
    burnTime: "40-50 hours",
    basePrice: "899.00",
    categorySlug: "jar-candles",
    isFeatured: true,
    tags: ["coffee", "gourmand", "bestseller"],
  },
  {
    name: "Ivory Pillar – Classic",
    shortDesc: "Timeless unscented ivory pillar candle for any décor.",
    description:
      "Our classic ivory pillar candle is hand-poured with premium paraffin blend for a clean, even burn. A versatile piece for mantels, dining tables, or as the centrepiece of any arrangement.",
    scentFamily: null,
    topNotes: null,
    middleNotes: null,
    baseNotes: null,
    waxType: "Paraffin Blend",
    wickType: "Cotton Wick",
    burnTime: "60-70 hours",
    basePrice: "499.00",
    categorySlug: "pillar-candles",
    isFeatured: false,
    tags: ["unscented", "classic", "decor"],
  },
  {
    name: "Lavender Fields",
    shortDesc: "Calming Provençal lavender — your at-home spa moment.",
    description:
      "Close your eyes and wander through rolling fields of French lavender. This therapeutic candle blends true lavender essential oil with chamomile and a touch of clary sage for deep relaxation.",
    scentFamily: "Herbaceous",
    topNotes: "Clary Sage, Lemon",
    middleNotes: "French Lavender, Chamomile",
    baseNotes: "Vanilla, Tonka Bean",
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTime: "45-55 hours",
    basePrice: "799.00",
    categorySlug: "scented-candles",
    isFeatured: false,
    tags: ["lavender", "relaxation", "spa"],
  },
  {
    name: "Smoked Oud & Saffron",
    shortDesc: "Opulent oud, saffron, and rose — pure luxury.",
    description:
      "Our most luxurious candle. Smoked Oud & Saffron combines rare Middle-Eastern oud wood with precious saffron threads, Damascus rose, and smooth leather undertones. An heirloom-quality scent.",
    scentFamily: "Oriental",
    topNotes: "Saffron, Pink Pepper",
    middleNotes: "Damascus Rose, Oud Wood",
    baseNotes: "Leather, Sandalwood",
    waxType: "Soy-Coconut Blend",
    wickType: "Wooden Wick",
    burnTime: "50-60 hours",
    basePrice: "1299.00",
    categorySlug: "limited-edition",
    isFeatured: true,
    tags: ["oud", "luxury", "limited"],
  },
  {
    name: "Citrus Grove",
    shortDesc: "Zesty lemon, grapefruit, and fresh basil — pure energy.",
    description:
      "Citrus Grove is a burst of sunshine. Hand-poured with essential oils of Sicilian lemon, pink grapefruit, and fresh basil leaf. Light it in the morning to energise your space.",
    scentFamily: "Citrus",
    topNotes: "Sicilian Lemon, Grapefruit",
    middleNotes: "Basil Leaf, Green Tea",
    baseNotes: "White Cedar, Musk",
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTime: "40-50 hours",
    basePrice: "699.00",
    categorySlug: "jar-candles",
    isFeatured: false,
    tags: ["citrus", "energising", "morning"],
  },
  {
    name: "Dinner Party Tapers — Set of 4",
    shortDesc: "Elegant 12-inch unscented tapers for sophisticated dining.",
    description:
      "Elevate your tablescape with these hand-dipped taper candles. Available in warm ivory, each taper burns for approximately 10 hours with minimal drip. Set of four candles.",
    scentFamily: null,
    topNotes: null,
    middleNotes: null,
    baseNotes: null,
    waxType: "Paraffin Blend",
    wickType: "Cotton Wick",
    burnTime: "10 hours each",
    basePrice: "599.00",
    categorySlug: "taper-candles",
    isFeatured: false,
    tags: ["taper", "dining", "set"],
  },
  {
    name: "The Lumina Signature Set",
    shortDesc: "Three bestselling mini candles in a luxury gift box.",
    description:
      "Introduce someone special to Lumina with our Signature Gift Set. Includes travel-size versions of Golden Hour, Midnight Garden, and Sea Salt & Driftwood — beautifully boxed with a hand-written note card.",
    scentFamily: "Mixed",
    topNotes: null,
    middleNotes: null,
    baseNotes: null,
    waxType: "Soy Wax",
    wickType: "Cotton Wick",
    burnTime: "15 hours each",
    basePrice: "1499.00",
    categorySlug: "gift-sets",
    isFeatured: true,
    tags: ["gift", "bestseller", "set"],
  },
  {
    name: "Fireside Embers",
    shortDesc: "Smoky cedarwood, cinnamon bark, and crackling hearth vibes.",
    description:
      "Fireside Embers captures the comforting warmth of a crackling fireplace. Rich cedarwood and smoky birch are softened by cinnamon bark and a base of warm amber and benzoin resin.",
    scentFamily: "Warm & Spicy",
    topNotes: "Cinnamon Bark, Clove",
    middleNotes: "Smoky Birch, Cedarwood",
    baseNotes: "Amber, Benzoin Resin",
    waxType: "Soy-Coconut Blend",
    wickType: "Wooden Wick",
    burnTime: "50-60 hours",
    basePrice: "949.00",
    categorySlug: "scented-candles",
    isFeatured: false,
    tags: ["smoky", "winter", "cozy"],
  },
];

// ─── Main ───────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding Lumina Candles database...\n");

  // 1. Create admin user
  console.log("👤 Creating admin user...");
  const adminPassword = await bcrypt.hash("Admin@Lumina123", 12);
  const adminId = randomUUID();
  await sql`
    INSERT INTO users (id, name, email, password_hash, role, email_verified)
    VALUES (${adminId}, ${"Lumina Admin"}, ${"admin@lumina-candles.com"}, ${adminPassword}, ${"admin"}, NOW())
    ON CONFLICT (email) DO NOTHING
  `;

  // 2. Create test customer
  console.log("👤 Creating test customer...");
  const customerPassword = await bcrypt.hash("Test@User123", 12);
  const customerId = randomUUID();
  await sql`
    INSERT INTO users (id, name, email, password_hash, role, email_verified)
    VALUES (${customerId}, ${"Test Customer"}, ${"customer@test.com"}, ${customerPassword}, ${"customer"}, NOW())
    ON CONFLICT (email) DO NOTHING
  `;
  console.log("   ✅ Admin: admin@lumina-candles.com / Admin@Lumina123");
  console.log("   ✅ Customer: customer@test.com / Test@User123\n");

  // 3. Insert categories
  console.log("📂 Inserting categories...");
  for (const cat of categoryData) {
    await sql`
      INSERT INTO categories (id, name, slug, description, sort_order, is_active)
      VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.description}, ${cat.sortOrder}, true)
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log(`   ✅ ${categoryData.length} categories\n`);

  // 4. Insert products + variants + images
  console.log("🕯️  Inserting products...");
  for (let i = 0; i < productData.length; i++) {
    const p = productData[i];
    const category = categoryData.find((c) => c.slug === p.categorySlug);
    const productId = randomUUID();
    const productSlug = slug(p.name);

    await sql`
      INSERT INTO products (
        id, category_id, name, slug, description, short_desc,
        scent_family, top_notes, middle_notes, base_notes,
        wax_type, wick_type, burn_time,
        base_price, status, is_featured, tags,
        meta_title, meta_desc
      ) VALUES (
        ${productId}, ${category?.id ?? null}, ${p.name}, ${productSlug},
        ${p.description}, ${p.shortDesc},
        ${p.scentFamily}, ${p.topNotes}, ${p.middleNotes}, ${p.baseNotes},
        ${p.waxType}, ${p.wickType}, ${p.burnTime},
        ${p.basePrice}, ${"active"}, ${p.isFeatured}, ${p.tags},
        ${p.name + " | Lumina Candles"}, ${p.shortDesc}
      )
      ON CONFLICT (slug) DO NOTHING
    `;

    // Create 2 variants per product (Small & Large)
    const baseNum = parseFloat(p.basePrice);
    const smallPrice = (baseNum * 0.7).toFixed(2);
    const prefix = productSlug.slice(0, 6).replace(/-/g, "");

    await sql`
      INSERT INTO product_variants (id, product_id, name, sku, price, stock_qty, sort_order, is_active)
      VALUES
        (${randomUUID()}, ${productId}, ${"Small (150g)"}, ${sku(prefix, "SM")}, ${smallPrice}, ${Math.floor(Math.random() * 30) + 10}, 0, true),
        (${randomUUID()}, ${productId}, ${"Large (300g)"}, ${sku(prefix, "LG")}, ${p.basePrice}, ${Math.floor(Math.random() * 25) + 5}, 1, true)
      ON CONFLICT (sku) DO NOTHING
    `;

    // Insert primary image
    const imgUrl = candleImages[i % candleImages.length];
    await sql`
      INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
      VALUES (${randomUUID()}, ${productId}, ${imgUrl}, ${p.name + " — Lumina Candles"}, 0, true)
    `;

    // Insert secondary image (different from primary)
    const secondaryImg = candleImages[(i + 3) % candleImages.length];
    await sql`
      INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary)
      VALUES (${randomUUID()}, ${productId}, ${secondaryImg}, ${p.name + " — lifestyle shot"}, 1, false)
    `;

    console.log(`   ✅ ${p.name}`);
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   ${categoryData.length} categories`);
  console.log(`   ${productData.length} products (${productData.length * 2} variants, ${productData.length * 2} images)`);
  console.log(`   2 users (1 admin, 1 customer)\n`);

  await sql.end();
  process.exit(0);
}

seed().catch(async (e) => {
  console.error("❌ Seed failed:", e.message);
  await sql.end();
  process.exit(1);
});
