# Features Specification
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11

---

## Feature Priority Legend

| Priority | Label | Description |
|----------|-------|-------------|
| P0 | MVP Core | Must ship at launch |
| P1 | MVP Extended | Ship in first 2 sprints post-launch |
| P2 | Growth | Ship within 3 months |
| P3 | Future | Roadmap / nice-to-have |

---

## 1. Storefront & Discovery

### 1.1 Homepage — P0
- Hero banner with featured collection or seasonal campaign
- "New Arrivals" horizontal scroll section
- "Best Sellers" product grid (4–8 products)
- "Shop by Scent Family" category tiles (e.g. Floral, Woody, Fresh, Spicy)
- Brand story / USP section ("Why Handmade?")
- Newsletter signup bar
- Instagram feed embed (latest 6 posts)
- Footer with links, contact, social icons

### 1.2 Product Catalogue — P0
- Responsive grid layout (2 cols mobile / 3 cols tablet / 4 cols desktop)
- Lazy-loaded product cards with image, name, price, star rating, stock badge
- Sticky filter sidebar (desktop) / drawer filter (mobile)
- Filter options: Scent Family · Size · Price Range · Rating · In Stock Only
- Sort options: Featured · Newest · Price ↑ · Price ↓ · Best Selling · Rating
- Active filter chips with individual clear + "Clear All"
- URL-driven filters (shareable, deep-linkable)
- Pagination with configurable page size (12 / 24 / 48)
- Quick-view modal with add-to-cart from listing

### 1.3 Search — P0
- Global search bar (header) with keyboard shortcut (⌘K / Ctrl+K)
- Instant search suggestions (product names, categories)
- Full search results page with same filters as catalogue
- Search analytics (top queries, no-results queries) — tracked internally

### 1.4 Product Detail Page (PDP) — P0
- Image gallery: primary large image + thumbnails, zoom on hover, swipe on mobile
- Product title, brand tagline, star rating with review count
- Scent profile section: Top notes / Middle notes / Base notes (visual)
- Product details: Wax type · Wick · Burn time · Volume · Dimensions
- Variant selector: Size (2oz / 4oz / 8oz) with price difference displayed
- Quantity stepper (min 1, max stock qty)
- "Add to Cart" CTA (disabled + tooltip when out of stock)
- "Add to Wishlist" icon toggle
- Social share buttons (Pinterest, WhatsApp, copy link)
- Accordion sections: Description · Ingredients · Care Instructions · Shipping Info
- "You May Also Like" recommendations (4 products)
- Customer Reviews section (see §4.3)

---

## 2. Shopping Cart

### 2.1 Cart UX — P0
- Slide-out drawer cart triggered from header icon
- Cart item: image, name, size, quantity stepper, unit price, line total, remove
- Running subtotal, estimated shipping (cheapest method), order total
- "View Full Cart" link → `/cart` page
- Empty cart state with "Continue Shopping" CTA
- Cart count badge on header icon (persists across pages)

### 2.2 Cart Persistence — P0
- Guest: cart stored in localStorage + cookie
- Logged-in: cart synced to DB (merge on login)
- Cart survives browser close and device switch (for logged-in users)

### 2.3 Promotions in Cart — P1
- Coupon code input field with validation
- Discount applied: shows crossed-out price and savings amount
- Free shipping threshold progress bar ("Add ₹X more for free shipping!")
- Error messages: invalid code / expired / already used / minimum order not met

---

## 3. Checkout

### 3.1 Checkout Flow — P0
Multi-step checkout with progress indicator:

**Step 1 — Contact & Shipping Address**
- Email (pre-filled for logged-in users)
- First name, Last name
- Phone number
- Address line 1, Address line 2 (optional)
- City, State, PIN code, Country
- Address autocomplete (Google Places API)
- Save address checkbox (for logged-in users)

**Step 2 — Delivery Method**
- Standard Delivery: 3–5 business days (₹ flat rate or free above threshold)
- Express Delivery: 1–2 business days (₹ premium rate)
- Estimated delivery date displayed per option

**Step 3 — Payment**
- Razorpay integration: UPI, Cards, Net Banking, Wallets
- Cash on Delivery (COD) toggle with extra fee disclosure
- Order summary sidebar (always visible on desktop)
- SSL / secure badge

**Step 4 — Review & Confirm**
- Summary of all details before payment
- "Place Order" button triggers payment intent
- Loading state and error handling

**Step 5 — Order Confirmation**
- Success page with order number, items, and ETA
- Email confirmation sent automatically
- "Continue Shopping" + "View Order" links

### 3.2 Guest Checkout — P0
- Full checkout without account creation
- Post-purchase prompt: "Create an account to track your order"

### 3.3 Gift Options — P2
- Gift wrapping checkbox (flat fee)
- Personalised message card (text input, 150 char limit)
- "Ship as gift" option hides invoice in package

---

## 4. User Accounts

### 4.1 Authentication — P0
- Email + password registration with email verification
- Login with "Remember Me" option
- Google OAuth (one-click sign-in)
- Password strength indicator on registration
- Forgot password → email reset link (expires in 1 hour)
- Session management with JWT + refresh tokens

### 4.2 Account Dashboard — P0
- Overview: recent orders, saved addresses, wishlist count
- Order History: table with order #, date, items, total, status, tracking link
- Reorder button on past orders
- Address Book: add, edit, delete addresses; set default
- Profile Settings: name, email, password change
- Communication Preferences: marketing email toggle

### 4.3 Reviews & Ratings — P1
- Star rating (1–5) + written review form on PDP
- One review per product per user
- Edit / delete own review
- Review helpful voting ("Was this helpful?")
- Store owner reply to review
- Moderation: flag for review

### 4.4 Wishlist — P1
- Add / remove from PDP and catalogue quick-view
- Wishlist page with product cards, move to cart, share link
- Persistent (DB-backed) for logged-in users

---

## 5. Orders & Fulfilment

### 5.1 Order Status Lifecycle — P0
`Pending` → `Confirmed` → `Processing` → `Dispatched` → `Delivered` → `Completed`
Also: `Cancelled` · `Refund Requested` · `Refunded`

### 5.2 Order Notifications — P0
- Email: Order Confirmed, Order Dispatched (with tracking link), Order Delivered
- In-app: status badge in Order History

### 5.3 Returns & Refunds — P1
- Customer submits return request from Order History
- Reason selection: Damaged · Wrong Item · Changed Mind · Other
- Admin reviews and approves/rejects
- Refund processed back to original payment method

---

## 6. Admin Panel

### 6.1 Dashboard — P0
- KPI cards: Today's Revenue · Orders · New Customers · Low Stock Count
- Revenue chart: 7-day sparkline, selectable range (7d / 30d / 90d)
- Recent orders table
- Low stock alerts list (qty ≤ threshold)

### 6.2 Product Management — P0
- Product list with search, filter by category/status, bulk actions
- Create / Edit product form:
  - Title, description (rich text), slug (auto-generated, editable)
  - Category, tags, scent family
  - Variants: size + price + SKU + stock qty per variant
  - Image upload (drag-and-drop, reorder, set primary)
  - Status: Draft / Active / Archived
- Duplicate product action
- Bulk update: status, category

### 6.3 Order Management — P0
- Order list with filters: status, date range, search by order # / customer
- Order detail: customer info, items, payment, shipping, timeline, notes
- Actions: Mark as Processing / Dispatched (+ tracking number input) / Delivered
- Cancel order with reason
- Initiate refund (partial or full)
- Print packing slip (PDF)

### 6.4 Inventory Management — P0
- Stock level per variant visible in product list
- Inline quick-edit stock quantity
- Low-stock threshold setting per product (global default + per-product override)
- Email alert when stock ≤ threshold

### 6.5 Discount Codes — P1
- Create code: percentage (%) or fixed (₹) discount
- Minimum order value condition
- Usage limit (total uses + per-customer limit)
- Expiry date
- Applicable to: all products / specific categories / specific products
- Enable / disable without deleting

### 6.6 Analytics — P1
- Sales report: revenue, orders, AOV by date range
- Top products by revenue and units sold
- Traffic sources (UTM-based)
- Conversion funnel (sessions → cart → checkout → purchase)
- Customer cohort: new vs returning

---

## 7. Marketing & SEO

### 7.1 SEO — P0
- Dynamic `<title>`, `<meta description>`, Open Graph, Twitter Card tags
- JSON-LD structured data: Product, BreadcrumbList, Organization
- Canonical URLs
- XML sitemap auto-generated at `/sitemap.xml`
- `robots.txt`
- Human-readable, keyword-rich URLs (e.g. `/candles/lavender-dreams-8oz`)

### 7.2 Email Marketing — P1
- Newsletter signup (Mailchimp / Brevo integration)
- Welcome email sequence
- Abandoned cart recovery email (trigger: 1 hour after cart abandonment)
- Post-purchase review request email (trigger: 7 days after delivery)

### 7.3 Promotions — P2
- Seasonal sale banners (configurable start/end date)
- "Limited Edition" and "Low Stock" badges on product cards
- Flash sale countdown timer on PDP

---

## 8. Performance & Reliability

### 8.1 Performance — P0
- Next.js Image component with automatic WebP conversion and lazy loading
- Static generation (SSG) for product pages with ISR (revalidate every 60s)
- Server components for data-heavy pages
- Edge caching via Vercel CDN
- Code splitting and dynamic imports for heavy components
- Bundle analyser in CI to catch size regressions

### 8.2 Accessibility — P0
- Keyboard navigable: all interactive elements focusable and operable
- ARIA labels on icons, modals, form inputs
- Sufficient colour contrast (WCAG AA ≥ 4.5:1 for text)
- Screen reader announcements for cart updates and form errors
- Skip-to-content link in header
