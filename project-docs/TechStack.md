# Tech Stack
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11

---

## 1. Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                     │
│      Next.js 14 (App Router) + TypeScript           │
│      Tailwind CSS + shadcn/ui + Framer Motion       │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP / RSC
┌──────────────────────────▼──────────────────────────┐
│                   SERVER LAYER                      │
│       Next.js API Routes + Server Actions           │
│       NextAuth.js · Zod · Resend · Cloudinary       │
└──────────────────────────┬──────────────────────────┘
                           │ SDK / REST
┌──────────────────────────▼──────────────────────────┐
│                   DATA LAYER                        │
│          JioBase DB (PostgreSQL-compatible)         │
│          Drizzle ORM · Redis (Upstash)              │
└─────────────────────────────────────────────────────┘
```

---

## 2. Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x (App Router) | Full-stack React framework, SSR/SSG/ISR |
| TypeScript | 5.x | Type safety across the entire codebase |
| React | 18.x | UI component model, Server Components |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | Latest | Accessible, unstyled component library |
| Framer Motion | 11.x | Page transitions and micro-animations |
| Zustand | 4.x | Lightweight client state (cart, UI state) |
| React Hook Form | 7.x | Form state management |
| Zod | 3.x | Schema validation (shared client + server) |
| TanStack Query | 5.x | Server state, caching, and mutations |
| Lucide React | Latest | Icon set |
| next-themes | Latest | Dark / light mode theming |

### Key Next.js Patterns Used
- **App Router** with layouts, loading states, and error boundaries
- **React Server Components (RSC)** for data-fetching on product pages
- **Server Actions** for form submissions (checkout, reviews, auth)
- **ISR** (Incremental Static Regeneration) for product catalogue pages
- **Parallel Routes** for modal-based quick-view and auth flows
- **Middleware** for auth-guarded routes (`/account/*`, `/admin/*`)

---

## 3. Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 14.x | REST endpoints for client-side fetches |
| NextAuth.js (Auth.js) | 5.x | Authentication: JWT sessions, Google OAuth |
| Drizzle ORM | 0.30.x | Type-safe SQL ORM for JioBase |
| Zod | 3.x | Request/response validation |
| Resend | Latest | Transactional email delivery |
| React Email | Latest | Email template components |
| Cloudinary | 2.x | Image storage, optimisation, CDN |
| Razorpay SDK | Latest | Payment processing (India) |
| Upstash Redis | Latest | Session cache, rate limiting, cart TTL |
| Stripe (optional) | — | International payments (post-MVP) |

---

## 4. Database

| Technology | Purpose |
|-----------|---------|
| JioBase DB (PostgreSQL-compatible) | Primary relational database |
| Drizzle ORM | Schema definition, migrations, type-safe queries |
| Drizzle Kit | Migration runner and introspection CLI |
| Upstash Redis | Cart session cache, OTP cache, rate-limit counters |

See **Database.md** for full schema.

---

## 5. DevOps & Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Hosting, Edge Network, Serverless Functions, Image Optimisation |
| JioBase (managed) | PostgreSQL-compatible managed DB |
| Upstash | Serverless Redis (cache, rate limiting) |
| Cloudinary | Media storage and CDN |
| GitHub | Source control |
| GitHub Actions | CI/CD pipeline (lint → test → build → deploy) |
| Vercel Analytics | Real-user monitoring, Web Vitals |
| Sentry | Error tracking and performance monitoring |

---

## 6. Testing

| Tool | Scope |
|------|-------|
| Vitest | Unit and integration tests |
| React Testing Library | Component tests |
| Playwright | End-to-end tests (checkout flow, auth) |
| MSW (Mock Service Worker) | API mocking in tests |

### Coverage Targets
- Unit/integration: ≥ 70% on business-logic utilities and API handlers
- E2E: happy-path flows — register, browse, add-to-cart, checkout, admin order update

---

## 7. Code Quality & Tooling

| Tool | Purpose |
|------|---------|
| ESLint | Linting (next/core-web-vitals + custom rules) |
| Prettier | Code formatting |
| Husky + lint-staged | Pre-commit hooks (lint + format) |
| TypeScript strict mode | No implicit any, strict null checks |
| Bundle Analyser | `@next/bundle-analyzer` in CI |
| Dependabot | Automated dependency updates |

---

## 8. Third-Party Services

| Service | Purpose | Fallback |
|---------|---------|---------|
| Razorpay | Payments (UPI, cards, net banking) | COD |
| Google OAuth | Social login | Email/password |
| Google Places API | Address autocomplete | Manual entry |
| Resend | Transactional email | SMTP fallback |
| Cloudinary | Image hosting and CDN | Vercel Blob |
| Upstash Redis | Cache / rate limiting | In-memory (dev only) |

---

## 9. Environment Variables

All secrets are managed via Vercel Environment Variables (never committed to git).

```env
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME="Lumina Candles"

# Database (JioBase)
DATABASE_URL=
DATABASE_DIRECT_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Email
RESEND_API_KEY=
EMAIL_FROM="orders@luminacandles.in"

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Google
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=
```

---

## 10. Versioning & Branching Strategy

- **main** — production (auto-deploy via Vercel)
- **staging** — pre-production integration branch
- **feature/\*** — individual feature branches (PR → staging → main)
- Conventional Commits enforced via commitlint
- Semantic versioning on releases (CHANGELOG auto-generated)
