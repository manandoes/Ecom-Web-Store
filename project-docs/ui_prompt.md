I've analyzed the Vistiq design reference visually. Now here is the complete, production-ready Stitch prompt:

---

# Stitch Build Prompt: Lumina Candles — Handmade Scented Candles E-Commerce Store

---

## a. Project Overview

Build a full-stack e-commerce website for **Lumina Candles**, a premium handmade scented candle brand. The store sells artisan candles crafted in small batches with natural waxes (soy, coconut, beeswax), hand-poured in India and shipped nationwide. The site must support product browsing with scent family filtering, product detail pages with scent note profiles, a persistent shopping cart, multi-step checkout with Razorpay payment, user accounts with order history, and a full admin panel for product and order management.

The site has the following pages: **Homepage, Product Catalogue, Product Detail Page, Cart, Checkout, Order Confirmation, Account Dashboard, Order History, Wishlist, Login/Register, and Admin Panel (Dashboard, Products, Orders).**

---

## b. Visual Language (extracted exclusively from https://vistiq.framer.website/)

### Colour Palette
- **Background Primary:** `#FAF7F2` — warm off-white/cream, used as the dominant page background
- **Background Secondary:** `#F0EBE1` — slightly deeper warm beige, used for section alternation and card fills
- **Background Dark:** `#1A1410` — very deep warm brown-black, used for footer and full-bleed dark sections
- **Primary Text:** `#1A1410` — near-black warm brown, used for all headings and body text on light backgrounds
- **Secondary Text:** `#6B5E52` — warm medium taupe/brown, used for subheadings, captions, meta text
- **Muted Text:** `#A89B8E` — light warm greige, used for labels, eyebrow text, placeholder text
- **Accent Primary:** `#C4A882` — warm golden sand/champagne, used for primary CTA buttons and interactive highlights
- **Accent Hover:** `#B09068` — deeper warm gold, button hover state
- **Accent Dark:** `#8C6D4F` — rich warm caramel brown, used for secondary buttons and icon highlights
- **Border/Divider:** `#E5DDD4` — light warm beige, used for card borders, section dividers, input outlines
- **White:** `#FFFFFF` — used sparingly for text on dark backgrounds and card surfaces
- **Stat/Highlight Text on Dark:** `#FFFFFF` and `#C4A882` — white and gold on the dark section

### Typography
- **Display / Hero Headings:** Serif typeface (resembles **Playfair Display** or **Cormorant Garamond**) — very large, 72–96px on desktop, high-contrast italic and roman weight mix, generous line height 1.05, letter-spacing slightly tight at -0.02em. Used for hero headline split across 3 lines.
- **Section Headings (H2):** Same serif, regular weight, 40–52px, line height 1.15, letter-spacing -0.01em
- **Sub-headings / Card Titles (H3):** Serif, regular or medium weight, 20–26px
- **Body Copy:** Clean geometric sans-serif (resembles **DM Sans** or **Inter**), regular 400 weight, 15–17px, line height 1.65, color `#6B5E52`
- **Eyebrow Labels:** Sans-serif, uppercase, letter-spacing 0.12em, 11–12px, weight 500, color `#A89B8E`
- **Buttons:** Sans-serif, 13–14px, weight 500, letter-spacing 0.06em, uppercase or sentence case
- **Price Text:** Serif or sans-serif medium weight, 18–22px, color `#1A1410`
- **Stat Numbers:** Serif display, very large 52–64px, color `#1A1410` on light or `#FFFFFF` on dark

### Layout & Spacing
- **Max content width:** 1280px, centered with `auto` margins
- **Section vertical padding:** 96–120px top and bottom on desktop; 64px on mobile
- **Grid:** 12-column CSS grid; product cards use 4-col desktop / 2-col tablet / 1-col mobile
- **Horizontal page padding:** 40px desktop, 24px tablet, 16px mobile
- **Card gap:** 24px between product cards; 32px between feature cards
- **Border radius:** Cards use `16px`; buttons use `100px` (fully pill-shaped); image containers use `12px` or `24px` for rounded-rect; small chips/tags use `100px`
- **Section rhythm:** Each section alternates between `#FAF7F2` and `#F0EBE1` background or uses a full-bleed dark `#1A1410` section

### Component Styles

**Navbar:**
- Fixed / sticky, transparent on scroll-top, transitions to `#FAF7F2` with `box-shadow: 0 1px 0 #E5DDD4` on scroll
- Logo: serif wordmark in `#1A1410`, left-aligned
- Nav links: sans-serif 14px, weight 500, `#1A1410`, hover color `#C4A882`
- CTA button: pill shape `border-radius: 100px`, background `#1A1410`, text `#FAF7F2`, 13px, letter-spacing 0.06em, padding `10px 24px`
- Cart icon: `lucide-react` ShoppingBag icon, shows count badge in `#C4A882`

**Hero Section:**
- Full-viewport-height (`100vh`) layout
- Large background image with warm amber/golden overlay `rgba(26,20,16,0.25)`
- Headline text in white serif split into 3 stacked lines, each line on its own row, massive size (72–96px)
- Two CTA buttons side by side: primary (solid `#C4A882`, pill) and secondary (outlined white, pill)
- Tagline in sans-serif 16px white below the headline

**Product Cards:**
- Background: `#FFFFFF` or `#FAF7F2`
- Image fills top 65% of card with `border-radius: 12px 12px 0 0`; object-fit cover
- Bottom area: product name (serif 18px `#1A1410`), scent family tag (pill `#F0EBE1` background, 11px sans-serif uppercase `#A89B8E`), price (sans-serif medium 18px `#1A1410`)
- Wishlist icon (heart) overlaid top-right of image
- On hover: card lifts with `box-shadow: 0 16px 48px rgba(26,20,16,0.10)`, image scales to 1.03, transition 0.3s ease

**Buttons:**
- **Primary:** `background: #C4A882`, `color: #1A1410`, `border-radius: 100px`, `padding: 14px 32px`, `font-size: 13px`, `font-weight: 500`, `letter-spacing: 0.06em`, hover: `background: #B09068`
- **Primary Dark:** `background: #1A1410`, `color: #FAF7F2`, same radius and padding, hover: `background: #2D2420`
- **Secondary Outlined:** `border: 1.5px solid #1A1410`, `background: transparent`, `color: #1A1410`, same radius, hover: `background: #1A1410`, `color: #FAF7F2`
- **Ghost on Dark:** `border: 1.5px solid rgba(255,255,255,0.4)`, `color: #FFFFFF`, hover: `border-color: #C4A882`, `color: #C4A882`

**Stats Strip:**
- Dark background `#1A1410`
- 4 stats in a horizontal row, each: eyebrow label in `#A89B8E` 11px uppercase, giant number in serif `#FFFFFF` 56px, descriptor in `#6B5E52` 14px
- Thin `#2D2420` vertical dividers between stats

**Section Eyebrow Labels:**
- Small uppercase sans-serif tag, `#A89B8E`, letter-spacing 0.14em, with a short `1px` horizontal line `#E5DDD4` 32px wide to the left OR a small decorative dot

**Testimonial Section:**
- Large feature testimonial: full-height portrait image left (40% width), quote text right in large serif 28–32px italic, `#1A1410`; reviewer name and title in sans-serif 14px `#A89B8E`
- Mini testimonial cards in a row below: avatar circle 48px, quote in 15px sans-serif, name in 13px bold

**Blog Cards:**
- Horizontal thumbnail (16:9 ratio, `border-radius: 12px`) + title in serif 20px + subtitle in sans-serif 14px `#6B5E52` + "Read Article" link in `#C4A882` with underline on hover
- 4-column grid

**Footer:**
- Background: `#1A1410`
- Brand wordmark top-left in `#FAF7F2` serif large
- 4-column link grid: Useful Links, Legal, Social Media, Contact — all in `#A89B8E` 14px sans-serif, hover `#FFFFFF`
- Newsletter input: pill-shaped, `border: 1px solid #2D2420`, background `#2D2420`, text `#FAF7F2`, send button in `#C4A882`
- Bottom bar: `border-top: 1px solid #2D2420`, copyright in `#6B5E52` 13px

### Animation & Interaction Feel
- Smooth, slow fade-up on scroll (`opacity: 0 → 1`, `translateY(24px → 0)`, `duration: 0.6s`, `ease: cubic-bezier(0.16,1,0.3,1)`)
- Horizontal tag-ticker / marquee scrolling strip (scent family names scrolling left continuously)
- Hover states on cards: subtle lift shadow + image scale 1.03, `transition: all 0.3s ease`
- Cart drawer slides in from right with `translateX(100% → 0)`, backdrop blur overlay
- Sticky header opacity transitions on scroll
- Page transitions: instant (no full-page animation)

### Overall Aesthetic Mood
Warm organic minimalism. Elevated, editorial, natural. Cream and warm brown earth tones. Generous whitespace. Serif headlines contrasted with clean geometric sans-serif body. Photography-forward layouts. Feels like a premium boutique wellness brand — calm, confident, feminine luxury without being cold or clinical.

---

## c. Page-by-Page UI Plan

### Page 1: Homepage (`/`)

**Section 1 — Navbar (sticky)**
Logo wordmark "Lumina" in Playfair Display left. Nav links center: Shop, About, Journal. Right: Account icon, Wishlist heart icon, Cart bag icon with count badge, "Shop Now" pill CTA dark button.

**Section 2 — Hero**
Full viewport height. Background: large warm lit candle lifestyle image (placeholder: warm amber-toned flat-lay of candles). Dark overlay `rgba(26,20,16,0.3)`. White serif headline in 3 stacked lines: "Handcrafted" / "Scented" / "Candles". Tagline in 16px sans-serif white below. Two buttons: "Shop the Collection" (solid `#C4A882`) and "Our Story" (ghost outlined white). Both pill-shaped.

**Section 3 — Scent Family Marquee Strip**
Background `#1A1410`. Auto-scrolling horizontal ticker of scent family names: "Floral · Woody · Fresh · Citrus · Spicy · Gourmand · Earthy · Smoky ·" repeating indefinitely in `#C4A882` and `#FAF7F2` alternating, serif italic 18px.

**Section 4 — Stats Strip**
Background `#1A1410`. 4 stats horizontally: "98% Customer Satisfaction" / "5,000+ Candles Poured" / "10,000+ Happy Customers" / "4.9/5 Average Rating". Giant serif white numbers, small taupe labels.

**Section 5 — Featured Products ("Handpicked for Your Home")**
Background `#FAF7F2`. Eyebrow label "Our Collection". H2 serif "Handpicked for Your Home". 4-column product card grid showing 4 featured candles. Each card: image top, name, scent family tag, price, add-to-cart icon button. "View All Candles" pill button dark below grid.

**Section 6 — Brand Story Split**
Background `#F0EBE1`. Left 50%: tall lifestyle image of candle-making process, `border-radius: 24px`. Right 50%: eyebrow "Our Story", H2 "Small Batch, Big Soul", body paragraph 3 lines, "Learn More" outlined button.

**Section 7 — Scent Profile Feature**
Background `#FAF7F2`. Full-width section. Left: decorative botanical illustration or candle flat-lay image. Right: eyebrow "Why It Matters", H2 "Every Scent Tells a Story", 3 mini feature rows with icon + title + description for: "Top Notes · Middle Notes · Base Notes".

**Section 8 — Testimonials**
Background `#1A1410`. Large feature quote top (portrait image left, quote right in `#FFFFFF` serif 30px italic). Below: 4 mini testimonial cards in `#2D2420` background with rounded corners.

**Section 9 — Blog / Journal ("The Candle Journal")**
Background `#FAF7F2`. Eyebrow label "Journal". H2 "Stories Worth Savouring". 4-column blog card grid. "View All Articles" pill button.

**Section 10 — Newsletter**
Full-bleed background image (candle lifestyle warm), overlay `rgba(26,20,16,0.6)`. Center-aligned: eyebrow white label, H2 white serif "Subscribe & Stay Inspired", tagline, email input + "Subscribe" pill `#C4A882` button.

**Section 11 — Footer**
Dark `#1A1410`. Brand name top. 4-column links. Newsletter repeat. Contact info. Copyright bottom.

---

### Page 2: Product Catalogue (`/shop`)

- Sticky filter sidebar (desktop) with sections: Scent Family (checkbox pills: Floral / Woody / Fresh / Citrus / Spicy / Gourmand), Size (2oz / 4oz / 8oz), Price Range (slider `₹0–₹2000`), In Stock Only toggle. Each filter pill: background `#F0EBE1`, border `#E5DDD4`, selected state: background `#1A1410`, text `#FAF7F2`.
- Top bar: product count, active filter chips (clearable), sort dropdown (styled pill).
- 4-column product grid with same card style as homepage.
- Pagination at bottom: numbered pills, current page `#1A1410`, others `#F0EBE1`.

---

### Page 3: Product Detail Page (`/shop/[slug]`)

- Breadcrumb: "Home / Shop / Lavender Dreams 8oz" in 13px sans-serif `#A89B8E`.
- Left (55%): Image gallery — primary large image `border-radius: 16px`, 4 thumbnail images below in a row.
- Right (45%): Product name in serif 36px, scent family pill tag, star rating + review count, price in 28px. Size selector: 3 pill buttons (2oz / 4oz / 8oz) with price shown on each. Quantity stepper. "Add to Cart" full-width pill primary button. "Add to Wishlist" text link with heart icon.
- Below right: Accordion sections — Description, Scent Profile (top/middle/base notes displayed as 3 pills in `#F0EBE1`), Wax & Wick Details, Shipping & Returns.
- Full-width below: "You May Also Like" — 4 product cards.
- Full-width below: Customer Reviews section — average star rating large, rating distribution bars, review cards with avatar/name/date/stars/body.

---

### Page 4: Cart (`/cart`)

- Two-column layout: left (65%) cart items list, right (35%) sticky order summary card.
- Each item row: product image `60px` rounded, product name serif 16px, size tag, quantity stepper, line total, remove icon.
- Coupon code input row + "Apply" pill button.
- Free shipping progress bar: thin bar in `#E5DDD4`, fill in `#C4A882`, label "₹X away from free shipping".
- Order summary card: background `#F0EBE1`, `border-radius: 16px`, subtotal / discount / shipping / total rows, "Proceed to Checkout" full-width dark pill button.

---

### Page 5: Checkout (`/checkout`)

- Progress stepper top: 4 steps — Shipping / Delivery / Payment / Confirm. Current step circle filled `#1A1410`, complete step filled `#C4A882`, future step `#E5DDD4`.
- Left (60%) form area; Right (40%) sticky order summary.
- Step 1 form: First Name, Last Name, Email, Phone, Address Line 1, Address Line 2, City, State, PIN Code. Input style: `border: 1.5px solid #E5DDD4`, `border-radius: 8px`, `background: #FFFFFF`, focus `border-color: #C4A882`.
- Step 2: Two delivery option cards — Standard / Express. Card `border: 1.5px solid #E5DDD4`, selected `border-color: #1A1410`, `background: #FAF7F2`, radio dot inside.
- Step 3: "Pay with Razorpay" full-width button + COD option toggle.
- Step 4: Read-only summary. "Place Order" dark pill button.

---

### Page 6: Order Confirmation (`/order/[id]`)

- Center-aligned success layout. Large checkmark icon in `#C4A882` circle. Serif H2 "Your Order is Confirmed!". Order number in monospace `#6B5E52`. Order summary card. "Continue Shopping" + "View Order" buttons.

---

### Page 7: Account Dashboard (`/account`)

- Sidebar nav (left 280px): Account, Orders, Addresses, Wishlist, Settings. Active item: left border `3px solid #C4A882`, background `#F0EBE1`.
- Main content right: greeting H2, 2 KPI cards (Total Orders, Points/Savings), Recent Orders table, Quick Links.

---

### Page 8: Login / Register (`/auth/login`, `/auth/register`)

- Centered card `max-width: 440px`, `background: #FFFFFF`, `border-radius: 16px`, `box-shadow: 0 8px 40px rgba(26,20,16,0.08)`.
- Brand logo top center. Tab switcher: Login / Register pills.
- Form inputs matching checkout style. "Continue with Google" outlined button with Google icon. Divider "or". Submit full-width primary dark pill button.

---

### Page 9: Admin Panel (`/admin`)

- Dark sidebar `#1A1410` with logo, nav links in `#A89B8E`, active `#C4A882` with left border.
- Dashboard: 4 KPI cards in `#FAF7F2` with `border-radius: 12px`, stat number serif large, label small sans-serif.
- Products page: table with image thumbnail, name, SKU, price, stock badge, status toggle, edit/delete actions.
- Orders page: table with order #, customer, date, total, status badge (pill colored: pending `#F0EBE1`, confirmed `#C4A882`, dispatched `#1A1410` text `#FAF7F2`), action buttons.

---

## d. Component Specs

### Color Tokens
```
--color-bg-primary:      #FAF7F2
--color-bg-secondary:    #F0EBE1
--color-bg-dark:         #1A1410
--color-bg-dark-2:       #2D2420
--color-text-primary:    #1A1410
--color-text-secondary:  #6B5E52
--color-text-muted:      #A89B8E
--color-accent:          #C4A882
--color-accent-hover:    #B09068
--color-accent-deep:     #8C6D4F
--color-border:          #E5DDD4
--color-white:           #FFFFFF
```

### Typography Scale
```
--font-display: 'Playfair Display', Georgia, serif
--font-body:    'DM Sans', 'Inter', system-ui, sans-serif

--text-hero:    96px / line-height 1.0 / letter-spacing -0.02em / font-display
--text-h1:      64px / line-height 1.05 / letter-spacing -0.02em / font-display
--text-h2:      48px / line-height 1.1 / letter-spacing -0.01em / font-display
--text-h3:      28px / line-height 1.2 / letter-spacing -0.01em / font-display
--text-h4:      20px / line-height 1.3 / font-display
--text-body-lg: 17px / line-height 1.7 / font-body / weight 400
--text-body:    15px / line-height 1.65 / font-body / weight 400
--text-small:   13px / line-height 1.5 / font-body / weight 400
--text-eyebrow: 11px / line-height 1.4 / font-body / weight 500 / uppercase / letter-spacing 0.12em
--text-btn:     13px / line-height 1 / font-body / weight 500 / letter-spacing 0.06em
--text-stat:    60px / line-height 1.0 / font-display / weight 700
```

### Spacing Scale (8px base grid)
```
--space-xs:   8px
--space-sm:   16px
--space-md:   24px
--space-lg:   40px
--space-xl:   64px
--space-2xl:  96px
--space-3xl:  120px
```

### Border Radius
```
--radius-sm:   8px   (inputs, small cards)
--radius-md:   12px  (image containers)
--radius-lg:   16px  (product cards, modals)
--radius-xl:   24px  (large feature images)
--radius-pill: 100px (all buttons, tags, chips)
```

### Shadows
```
--shadow-card:  0 4px 24px rgba(26,20,16,0.06)
--shadow-hover: 0 16px 48px rgba(26,20,16,0.10)
--shadow-modal: 0 24px 80px rgba(26,20,16,0.16)
```

### Button Specs
- Primary: `bg #C4A882` · `text #1A1410` · `radius 100px` · `padding 14px 32px` · `font 13px/500/0.06em` · hover `bg #B09068`
- Primary Dark: `bg #1A1410` · `text #FAF7F2` · same sizing · hover `bg #2D2420`
- Secondary Outlined: `border 1.5px #1A1410` · `bg transparent` · `text #1A1410` · hover invert to dark
- Ghost on Dark: `border 1.5px rgba(255,255,255,0.3)` · `text #FFFFFF` · hover `border #C4A882` · `text #C4A882`
- Icon Button: `40px × 40px` · `bg #F0EBE1` · `radius 100px` · icon in `#1A1410` · hover `bg #E5DDD4`

### Input Fields
- `height: 48px` · `border: 1.5px solid #E5DDD4` · `border-radius: 8px` · `bg: #FFFFFF` · `padding: 0 16px` · `font: 15px DM Sans #1A1410` · `placeholder: #A89B8E` · focus: `border-color: #C4A882`, `outline: none`, `box-shadow: 0 0 0 3px rgba(196,168,130,0.12)`

### Product Card
- `width: 100%` (fluid in grid) · `border-radius: 16px` · `bg: #FFFFFF` · `box-shadow: var(--shadow-card)` · `overflow: hidden`
- Image: `aspect-ratio: 4/5` · `object-fit: cover` · `border-radius: 12px 12px 0 0`
- Body padding: `16px` · name: `font-display 18px #1A1410` · scent tag: `pill bg #F0EBE1 11px uppercase #A89B8E` · price: `DM Sans medium 18px #1A1410`
- Hover: `transform: translateY(-4px)` · `box-shadow: var(--shadow-hover)` · image `transform: scale(1.03)` · `transition: all 0.3s ease`

---

## e. Build Instructions for Stitch

**Step 1 — Project Setup**
Create a new Next.js 14 App Router project with TypeScript. Install and configure: Tailwind CSS (extend theme with all color tokens, font families Playfair Display + DM Sans from Google Fonts, border-radius tokens, box-shadow tokens). Install shadcn/ui (init with neutral base). Install lucide-react, framer-motion, zustand, react-hook-form, zod.

**Step 2 — Global Styles & Tokens**
In `tailwind.config.ts` define all custom colors as `lumina-*` tokens (e.g. `lumina-cream: #FAF7F2`, `lumina-gold: #C4A882`, `lumina-dark: #1A1410`). Set `fontFamily.display` to `['Playfair Display', 'Georgia', 'serif']` and `fontFamily.sans` to `['DM Sans', 'Inter', 'system-ui']`. In `globals.css` set `body { background: #FAF7F2; color: #1A1410; font-family: var(--font-sans); }`.

**Step 3 — Layout & Navbar**
Build `components/shared/Header.tsx` as a sticky header. Transparent at scroll=0, transitions to `bg-lumina-cream shadow-[0_1px_0_#E5DDD4]` on scroll >10px using `useScrollPosition` hook. Left: `<span className="font-display text-2xl tracking-tight">Lumina</span>`. Center: nav links with hover `text-lumina-gold` transition. Right: wishlist heart, cart bag (with `bg-lumina-gold` badge), "Shop Now" pill button dark. Drawer cart slides in from right on bag icon click.

**Step 4 — Homepage: Hero Section**
Full `h-screen` section with background image placeholder (warm amber candle flat-lay). Overlay `bg-[rgba(26,20,16,0.28)]`. Centered content: 3-line stacked serif headline in `text-white font-display text-[80px] leading-[1.0] tracking-tight` with the word "Scented" in italic. Tagline in `text-white/80 text-[17px] font-sans`. Two pill buttons side by side.

**Step 5 — Homepage: Marquee Strip + Stats Strip**
Marquee: `bg-lumina-dark` strip with CSS `@keyframes scrollLeft` animation. Scent family names alternating `text-lumina-gold` and `text-white` in `font-display italic text-[18px]`.
Stats: 4-column grid in `bg-lumina-dark`, each cell with eyebrow label `text-lumina-muted text-[11px] uppercase tracking-widest`, stat number `font-display text-[60px] text-white`, description `text-lumina-secondary text-[14px]`. Vertical dividers `border-r border-[#2D2420]`.

**Step 6 — Homepage: Featured Products Grid**
Section `bg-lumina-cream py-24`. Eyebrow + H2 + 4-col product card grid. Build `components/storefront/ProductCard.tsx` using specs above. Include quick-add-to-cart icon button (ShoppingBag icon) that appears on hover at bottom-right of image.

**Step 7 — Homepage: Brand Story Split + Scent Profile Feature + Testimonials + Blog + Newsletter + Footer**
Build each as separate section components following the page-by-page plan. Testimonials dark section with large feature testimonial + 4 mini cards. Blog 4-column grid. Newsletter with full-bleed background image and overlay. Footer dark with 4-column links.

**Step 8 — Catalogue Page**
Left filter sidebar (sticky, `w-[280px]`): scent family checkboxes styled as pill toggles, size toggles, price range slider (custom styled with `accent-color: #C4A882`), in-stock toggle. Right: top bar with count + active filter chips + sort dropdown. 4-col product grid with same cards. URL-based filters using `useSearchParams`.

**Step 9 — Product Detail Page**
Two-column layout `grid-cols-[55%_45%]`. Left: image gallery — primary large image + 4 thumbnail strip. Right: breadcrumb, name, scent pill, stars, price, size selector pills (3 options), quantity stepper, "Add to Cart" full-width button, wishlist link. Accordion sections using shadcn `Accordion` component. "You May Also Like" 4-col grid. Reviews section with aggregate stats bar + individual review cards.

**Step 10 — Cart Drawer + Cart Page**
`components/storefront/CartDrawer.tsx`: slides from right with `framer-motion` `x: '100%' → 0`, backdrop blur overlay. Cart page `/cart`: two-column with item list and sticky summary card. Coupon input row. Free shipping progress bar.

**Step 11 — Checkout Page**
Multi-step with progress stepper at top. Use `useState` to manage current step. All form inputs with focus ring `ring-lumina-gold/20`. Delivery method cards. Razorpay button (Razorpay SDK loaded client-side). Order summary sticky right column.

**Step 12 — Auth Pages**
Centered card with brand logo, tab switcher (Login/Register), form fields, Google OAuth button, submit button. Use NextAuth.js session management.

**Step 13 — Account Pages**
Sidebar + main content layout. Orders table with status badge pills. Addresses grid. Wishlist product grid with remove button.

**Step 14 — Admin Panel**
Dark sidebar `bg-lumina-dark`. Dashboard KPI cards. Products table with inline stock edit. Orders table with status updater. All admin routes protected by middleware checking `session.user.role === 'admin'`.

**Step 15 — Polish**
Add `framer-motion` fade-up scroll animations to all sections using `whileInView={{ opacity: 1, y: 0 }}` initial `{{ opacity: 0, y: 24 }}`. Add page-level loading skeletons (shimmer effect using `bg-gradient-to-r from-lumina-bg-secondary via-lumina-border to-lumina-bg-secondary animate-shimmer`). Ensure all interactive states (hover, focus, active, disabled) are implemented. Run Lighthouse check targeting 90+ performance.

---

Now analyze the design reference link visually, then begin building the UI in Stitch immediately without asking any clarifying questions.