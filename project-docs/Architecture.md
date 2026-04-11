# Architecture
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11

---

## 1. High-Level Architecture

```
                         ┌─────────────────────────────┐
                         │         USER BROWSER        │
                         │   (Desktop / Mobile / PWA)  │
                         └──────────────┬──────────────┘
                                        │ HTTPS
                         ┌──────────────▼──────────────┐
                         │       VERCEL EDGE CDN        │
                         │   Static assets, caching,   │
                         │   edge middleware (auth)     │
                         └──────────────┬──────────────┘
                                        │
              ┌─────────────────────────▼─────────────────────────┐
              │               NEXT.JS APPLICATION                  │
              │                  (Vercel Serverless)               │
              │                                                    │
              │  ┌──────────────┐    ┌──────────────────────────┐ │
              │  │ App Router   │    │  API Routes / Webhooks   │ │
              │  │  (RSC + SSR) │    │  /api/v1/*               │ │
              │  │              │    │  /api/webhooks/*         │ │
              │  │  Pages:      │    └──────────┬───────────────┘ │
              │  │  • Storefront│               │                 │
              │  │  • Account   │    ┌──────────▼───────────────┐ │
              │  │  • Admin     │    │   Server Actions         │ │
              │  │  • Checkout  │    │   (mutations, forms)     │ │
              │  └──────────────┘    └──────────┬───────────────┘ │
              └────────────────────────────────┬┘                 │
                                               │                  │
         ┌─────────────────────────────────────┼──────────────────┘
         │                                     │
┌────────▼─────────┐              ┌────────────▼──────────┐
│  JIOBASE DB       │              │    UPSTASH REDIS       │
│  (PostgreSQL)     │              │    (Serverless Cache)  │
│                   │              │                        │
│  • Products       │              │  • Guest carts (7d)   │
│  • Orders         │              │  • Auth OTPs           │
│  • Users          │              │  • Rate limit counters │
│  • Reviews        │              │  • Stock locks         │
│  • Payments       │              │  • Session cache       │
└───────────────────┘              └────────────────────────┘
         │
         │ (via Drizzle ORM)
         └── Connection pooling via JioBase connection string

         ┌────────────────────────────────────────────────────────┐
         │                 EXTERNAL SERVICES                      │
         │                                                        │
         │  Razorpay      →  Payment processing + webhooks       │
         │  Cloudinary    →  Image storage, transform, CDN        │
         │  Resend        →  Transactional emails                 │
         │  Google OAuth  →  Social login                         │
         │  Google Places →  Address autocomplete                 │
         │  Sentry        →  Error tracking                       │
         └────────────────────────────────────────────────────────┘
```

---

## 2. Folder Structure

```
lumina-candles/
├── app/                          # Next.js App Router
│   ├── (storefront)/             # Public-facing routes
│   │   ├── page.tsx              # Homepage
│   │   ├── candles/
│   │   │   ├── page.tsx          # Catalogue
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product Detail Page
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── search/
│   │       └── page.tsx
│   ├── (account)/                # Authenticated user routes
│   │   ├── layout.tsx            # Auth guard
│   │   ├── account/
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── orders/
│   │   │   ├── addresses/
│   │   │   ├── wishlist/
│   │   │   └── settings/
│   │   └── auth/
│   │       ├── login/
│   │       ├── register/
│   │       └── reset-password/
│   ├── (admin)/                  # Admin routes
│   │   ├── layout.tsx            # Admin auth guard
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard
│   │       ├── products/
│   │       ├── orders/
│   │       ├── customers/
│   │       ├── discounts/
│   │       └── analytics/
│   ├── api/
│   │   ├── v1/                   # REST API handlers
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── reviews/
│   │   │   ├── wishlist/
│   │   │   └── admin/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   └── webhooks/
│   │       └── razorpay/
│   ├── layout.tsx                # Root layout (fonts, providers, analytics)
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── storefront/               # Storefront-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ScentProfile.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CheckoutStepper.tsx
│   │   └── ReviewCard.tsx
│   ├── admin/                    # Admin panel components
│   └── shared/                   # Cross-context components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── db/
│   │   ├── index.ts              # Drizzle client + JioBase connection
│   │   ├── schema/               # All table definitions
│   │   └── queries/              # Reusable query functions
│   ├── auth/
│   │   └── config.ts             # Auth.js config
│   ├── redis/
│   │   └── client.ts             # Upstash Redis client
│   ├── razorpay/
│   │   └── client.ts             # Razorpay SDK wrapper
│   ├── cloudinary/
│   │   └── upload.ts             # Image upload helpers
│   ├── email/
│   │   ├── index.ts              # Resend client
│   │   └── templates/            # React Email templates
│   ├── validations/              # Zod schemas (shared client+server)
│   └── utils/
│       ├── currency.ts
│       ├── slug.ts
│       └── order-number.ts
│
├── store/                        # Zustand client stores
│   ├── cartStore.ts
│   └── uiStore.ts
│
├── hooks/                        # Custom React hooks
├── types/                        # Global TypeScript types
├── public/                       # Static assets
├── emails/                       # React Email template files
├── drizzle/                      # Drizzle migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                      # Playwright tests
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

---

## 3. Data Flow Patterns

### 3.1 Product Page (SSG + ISR)
```
Build time:
  Drizzle query → JioBase → generateStaticParams() → static HTML

Runtime (cache miss or revalidation):
  Request → Vercel Edge → Next.js RSC → Drizzle → JioBase
  → Server-rendered HTML → Response (cached for 60s)
```

### 3.2 Add to Cart
```
User clicks "Add to Cart"
  → Zustand optimistic update (instant UI)
  → POST /api/v1/cart/items (Server Action or API route)
    → Auth check (guest token or session)
    → Redis: update guest cart / DB: update user cart
  → Response: updated cart state
  → Zustand sync with server response
```

### 3.3 Checkout & Payment
```
1. User fills shipping form
   → POST /api/v1/checkout/validate
   → Check stock in DB (with Redis lock)

2. Shipping method selected
   → POST /api/v1/checkout/create-payment
   → Create order record (status: pending)
   → Create Razorpay order
   → Return razorpayOrderId + keyId

3. Razorpay SDK opens payment modal
   → User completes payment on Razorpay
   → Razorpay returns payment IDs to client

4. Client calls POST /api/v1/checkout/verify-payment
   → Validate HMAC signature
   → Update order status: confirmed
   → Deduct stock quantities
   → Send confirmation email (async via Resend)
   → Return success + orderNumber

5. Webhook (async backup):
   POST /api/webhooks/razorpay
   → Idempotency check (razorpayPaymentId)
   → Catch any missed payment events
```

### 3.4 Admin Order Fulfilment
```
Admin updates order status → dispatched
  → PATCH /api/v1/admin/orders/:id/status
  → DB update: status, trackingNumber, dispatchedAt
  → Trigger email (Resend): "Your order has been dispatched"
  → Return updated order
```

---

## 4. Caching Strategy

| Layer | What's Cached | TTL |
|-------|--------------|-----|
| Vercel CDN | Static assets, built pages | Indefinite (content-hash) |
| Next.js ISR | Product pages, catalogue | 60 seconds |
| Next.js fetch cache | Category list, featured products | 5 minutes |
| Redis | Guest carts, sessions | Per key (see Database.md) |
| Browser | Static assets | 1 year (immutable) |

Cache invalidation on product update: `revalidatePath('/candles')` + `revalidatePath('/candles/[slug]')` called in admin Server Actions.

---

## 5. Authentication Architecture

```
Auth.js (NextAuth v5) with two providers:

1. Credentials Provider
   - email + password (bcrypt hashed, 12 rounds)
   - Email verification required before login

2. Google OAuth Provider
   - Standard PKCE flow
   - Auto-creates user record on first login

Session Strategy: JWT
   - Short-lived access token (15 min)
   - Refresh token stored in DB (30 days)
   - Redis session cache to avoid DB hit per request

Route Protection (Middleware):
   - /account/* → redirect to /auth/login if unauthenticated
   - /admin/*   → redirect if not admin role
   - Middleware runs at Edge (Vercel) — zero cold start
```

---

## 6. Error Handling

- **API Routes:** All handlers wrapped in try/catch; errors logged to Sentry; structured JSON error responses returned
- **RSC Pages:** `error.tsx` boundaries per route segment; graceful fallback UI
- **Client:** TanStack Query handles loading/error states; toast notifications for user-facing errors
- **Payment failures:** Order status set to `payment_failed`; user redirected to retry page
- **Webhook failures:** Razorpay retries webhooks 3× with exponential backoff; idempotency key prevents double-processing

---

## 7. Scalability Considerations

- Vercel auto-scales serverless functions — no manual scaling
- JioBase connection pooling (configured via `DATABASE_URL` pool parameters)
- Redis offloads hot reads (carts, sessions) from main DB
- Image delivery fully off-loaded to Cloudinary CDN
- Background jobs (email sending) are fire-and-forget async — never block the HTTP response
- Stock locks via Redis prevent overselling under concurrent checkout load
