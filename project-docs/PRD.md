# Product Requirements Document (PRD)
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11  
**Stack:** Next.js 14 · TypeScript · JioBase DB

---

## 1. Executive Summary

A full-stack e-commerce platform for a handmade scented candle brand. The store enables customers to browse, discover, and purchase artisan candles online, while giving the store owner a robust admin panel to manage products, orders, inventory, and promotions. The platform prioritises brand aesthetics, mobile-first UX, and a streamlined checkout experience.

---

## 2. Goals & Objectives

| Goal | Metric |
|------|--------|
| Launch MVP within 8 weeks | All P0 features shipped |
| Convert visitors to buyers | ≥ 3% conversion rate |
| Retain customers | ≥ 25% repeat purchase rate within 90 days |
| Operational efficiency | Order processing < 2 minutes for owner |
| Performance | Core Web Vitals all "Good" (LCP < 2.5s, CLS < 0.1) |

---

## 3. User Personas

### 3.1 Shopper (Primary)
- **Age:** 24–45, predominantly female
- **Device:** Mobile first (≥ 65% mobile traffic)
- **Goals:** Discover unique scents, gift shopping, read reviews, fast checkout
- **Pain Points:** Slow sites, unclear scent descriptions, hidden shipping costs

### 3.2 Gift Buyer (Secondary)
- **Goals:** Gift wrapping, personalised message cards, estimated delivery dates
- **Pain Points:** Uncertainty around delivery timing, no gifting options

### 3.3 Store Owner / Admin
- **Goals:** Manage products and stock, view orders, run promotions, see revenue reports
- **Pain Points:** Complex dashboards, manual stock updates, no mobile admin access

---

## 4. Scope

### 4.1 In Scope (MVP)
- Product catalogue with search, filter, and sort
- Product detail pages with scent notes, burn time, size options
- Shopping cart (persistent across sessions)
- Checkout with address, shipping method, and payment
- User accounts (register, login, order history, saved addresses)
- Guest checkout
- Order confirmation emails
- Admin panel (products, orders, inventory, basic analytics)
- Responsive design (mobile, tablet, desktop)
- SEO-optimised pages

### 4.2 Out of Scope (Post-MVP)
- Subscription boxes
- Wholesale / B2B portal
- AI scent recommendation engine
- Native mobile app
- Multi-currency / multi-language
- Loyalty points system

---

## 5. User Stories

### Shopper
- As a shopper, I can browse all candles with photos, prices, and short descriptions.
- As a shopper, I can filter by scent family, size, price range, and availability.
- As a shopper, I can read detailed scent notes, burn time, ingredients, and reviews.
- As a shopper, I can add items to a cart and update quantities.
- As a shopper, I can check out as a guest or registered user.
- As a shopper, I can select shipping method and see total cost before paying.
- As a shopper, I can receive an order confirmation email.
- As a shopper, I can track my order status.

### Registered User
- As a user, I can create an account and log in securely.
- As a user, I can view my past orders and reorder easily.
- As a user, I can save multiple shipping addresses.
- As a user, I can write and edit product reviews.
- As a user, I can add products to a wishlist.

### Admin
- As an admin, I can add, edit, and delete products with images, variants, and stock.
- As an admin, I can view and manage all orders (fulfil, cancel, refund).
- As an admin, I can create and manage discount codes.
- As an admin, I can see a revenue dashboard with daily/weekly/monthly views.
- As an admin, I can receive low-stock alerts.

---

## 6. Functional Requirements

### F-01: Product Catalogue
- Grid and list view toggle
- Pagination or infinite scroll (configurable)
- Faceted filtering: scent family, size (2oz / 4oz / 8oz), price, in-stock only
- Sort by: featured, price (asc/desc), newest, best-selling, rating
- Quick-add to cart from catalogue view

### F-02: Product Detail Page
- Multiple high-res images with zoom and carousel
- Scent notes (top, middle, base)
- Burn time, wax type, wick type, volume
- Size/variant selector with per-variant pricing and stock
- Quantity selector
- Add to Cart + Add to Wishlist
- Customer reviews with star ratings and pagination
- Related products section

### F-03: Cart
- Slide-out drawer cart (desktop) + full cart page
- Persistent via localStorage + DB sync for logged-in users
- Coupon/discount code input
- Estimated shipping preview
- Free shipping threshold banner

### F-04: Checkout
- Step flow: Shipping → Delivery Method → Payment → Review → Confirm
- Address autocomplete (Google Places API)
- Shipping methods: Standard (3–5 days), Express (1–2 days)
- Payment: Razorpay (primary), with Cash on Delivery option
- Order summary sidebar
- Email confirmation on successful order

### F-05: User Accounts
- Email/password registration with email verification
- OAuth login (Google)
- Password reset via email
- Profile management: name, email, password, addresses
- Order history with status indicators
- Wishlist management

### F-06: Admin Panel
- Dashboard: revenue, orders, top products, low-stock alerts
- Products CRUD: with image upload (drag-and-drop), variant management
- Orders: list with filters, detail view, status updates, notes
- Customers: list and individual profiles
- Discounts: percentage or fixed amount, single-use or multi-use codes
- Basic reports: sales by date range, revenue by product

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | First Contentful Paint < 1.5s on 4G |
| Availability | 99.9% uptime SLA |
| Scalability | Handle 10,000 concurrent users |
| Accessibility | WCAG 2.1 AA compliance |
| SEO | SSR/SSG for all public pages, structured data (JSON-LD) |
| Security | OWASP Top 10 mitigations; see Security.md |
| Browser Support | Last 2 versions of Chrome, Firefox, Safari, Edge |

---

## 8. Constraints & Assumptions

- Hosting on Vercel (frontend) + managed JioBase (database)
- Payment gateway: Razorpay (India-first)
- Single store owner (no multi-vendor)
- Inventory managed manually by owner (no supplier integrations)
- Images stored in Cloudinary or Vercel Blob

---

## 9. Success Metrics

- **Conversion Rate:** ≥ 3% visitors → purchase
- **Cart Abandonment:** ≤ 65%
- **Page Load (LCP):** < 2.5 seconds
- **Order Processing Time:** < 2 minutes end-to-end
- **Customer Satisfaction (CSAT):** ≥ 4.2 / 5 average review

---

## 10. Timeline (MVP)

| Week | Milestone |
|------|-----------|
| 1–2 | Project setup, DB schema, auth, base UI components |
| 3–4 | Product catalogue, PDP, cart |
| 5–6 | Checkout, payments, order confirmation |
| 7 | Admin panel, image uploads, email notifications |
| 8 | QA, performance tuning, staging deploy |
| Post-MVP | Wishlist, reviews, analytics, discount codes |
