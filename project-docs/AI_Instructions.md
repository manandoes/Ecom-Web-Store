# AI Instructions
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11  
**Purpose:** Instructions and context for AI coding assistants (Claude, Copilot, Cursor, etc.) working on this codebase

---

## 1. Project Identity

You are helping build **Lumina Candles** — a full-stack e-commerce store for handmade scented candles. The project is a **Next.js 14 App Router** application written entirely in **TypeScript**, using **JioBase** (PostgreSQL-compatible) as the primary database via **Drizzle ORM**, and deployed on **Vercel**.

---

## 2. Tech Stack Quick Reference

When generating code, always use:

- **Framework:** Next.js 14, App Router (not Pages Router)
- **Language:** TypeScript with strict mode. No `any` types.
- **Styling:** Tailwind CSS utility classes only. No inline styles. No CSS modules.
- **Components:** shadcn/ui primitives for base components (Button, Input, Dialog, etc.)
- **Icons:** `lucide-react` exclusively
- **State:** Zustand for client state; TanStack Query (React Query) for server state
- **Forms:** React Hook Form + Zod resolver
- **Validation:** Zod schemas, defined in `lib/validations/` and shared between client and server
- **Database:** Drizzle ORM against JioBase. All queries in `lib/db/queries/`. Never write raw SQL unless absolutely necessary.
- **Auth:** Auth.js v5 (NextAuth). Session accessed via `auth()` in server components and `useSession()` on client.
- **Email:** Resend SDK + React Email templates in `emails/`
- **Images:** `next/image` for all image rendering. Cloudinary for storage and transformation.
- **Payments:** Razorpay SDK (server-side only for secret operations)
- **Animation:** Framer Motion for transitions and micro-animations
- **Cache:** Upstash Redis for sessions, rate limits, guest carts

---

## 3. Code Style & Conventions

### 3.1 File Naming
- React components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities, hooks, config: `camelCase.ts` (e.g., `useCart.ts`, `formatCurrency.ts`)
- API route files: `route.ts` inside the appropriate `app/api/` segment
- Server Actions: `actions.ts` co-located with the page that uses them, or in `lib/actions/`

### 3.2 TypeScript
- Always define explicit return types on functions
- Use `interface` for object shapes that represent entities; `type` for unions, intersections, and utility types
- All DB table types inferred from Drizzle schema using `InferSelectModel` and `InferInsertModel`
- Never use `as any` or `@ts-ignore` — fix the type properly

```typescript
// Good
import { type InferSelectModel } from 'drizzle-orm';
import { products } from '@/lib/db/schema';
type Product = InferSelectModel<typeof products>;

// Bad
const product: any = await getProduct(id);
```

### 3.3 Component Structure

```typescript
// Standard component structure
import { type FC } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (variantId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // hooks first
  // derived state
  // event handlers
  // render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### 3.4 Server Components vs Client Components
- **Default to Server Components.** Only add `'use client'` when you need:
  - `useState`, `useEffect`, `useRef`, or other React hooks
  - Browser APIs (window, localStorage, etc.)
  - Event handlers on interactive elements
  - Third-party client libraries (Framer Motion, etc.)
- Pass data down from Server Components to Client Components via props
- Never fetch data inside a Client Component when a Server Component can do it

### 3.5 API Routes

```typescript
// app/api/v1/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = querySchema.parse(Object.fromEntries(searchParams));
    const data = await getProducts(query);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', details: error.errors } },
        { status: 400 }
      );
    }
    console.error('[GET /products]', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR' } }, { status: 500 });
  }
}
```

### 3.6 Server Actions

```typescript
// 'use server' at top of file
'use server';
import { auth } from '@/lib/auth/config';
import { revalidatePath } from 'next/cache';

export async function addToWishlist(productId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorised');

  await db.insert(wishlistItems).values({ userId: session.user.id, productId });
  revalidatePath('/account/wishlist');
}
```

### 3.7 Database Queries

```typescript
// lib/db/queries/products.ts
import { db } from '@/lib/db';
import { products, productVariants, productImages } from '@/lib/db/schema';
import { eq, and, gte, lte, ilike } from 'drizzle-orm';

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.status, 'active')),
    with: {
      variants: { where: eq(productVariants.isActive, true), orderBy: (v, { asc }) => [asc(v.sortOrder)] },
      images: { orderBy: (i, { asc }) => [asc(i.sortOrder)] },
      category: true,
    },
  });
}
```

---

## 4. Domain Knowledge

When writing product-related code or copy, be aware of these domain terms:

- **Scent family:** The broad category of a scent (Floral, Woody, Fresh, Citrus, Spicy, Gourmand)
- **Top notes:** The initial scent impression (evaporates quickly — first 15 min)
- **Middle notes:** The heart of the fragrance (lasts 30–60 min after lighting)
- **Base notes:** The lingering, deep undertone (wax and warm throw)
- **Burn time:** Total hours a candle burns at its stated size
- **Cold throw:** How a candle smells unlit
- **Hot throw:** How strongly the scent fills a room when burning
- **Wax types used:** Soy wax (most common, eco-friendly), Coconut wax (premium), Beeswax (natural), Paraffin (budget)
- **Wick types:** Cotton (clean burn), Wood wick (crackling sound, wider melt pool)
- **Sizes:** 2oz (travel/sample), 4oz (small room), 8oz (medium room), 16oz (large room)

---

## 5. Business Rules

Encode these rules in your logic:

1. **Stock validation at checkout:** Always check live stock in DB at payment time, not just at add-to-cart time. Use Redis lock to prevent overselling.
2. **Price authority:** Prices are set server-side from the DB. Never trust the price sent from the client.
3. **Order number format:** `LC-{YEAR}-{5-digit-sequential}` (e.g., `LC-2026-00042`)
4. **Free shipping threshold:** ₹999 subtotal (after discount) for standard shipping
5. **Guest cart TTL:** 7 days in Redis; merged into user cart on login
6. **Review eligibility:** Users can only review a product they have purchased and the order must be in `delivered` or `completed` status
7. **Low stock threshold:** Default 5 units; configurable per variant. Alert sent when stock falls to or below threshold.
8. **Admin-only fields:** `adminNotes`, `cancelReason` on orders are never returned in customer-facing API responses
9. **Discount code usage:** Increment `usedCount` only after payment is confirmed, not at checkout creation
10. **Refund flow:** Partial or full refund via Razorpay API; update `payments.refundId` and `payments.refundAmount`

---

## 6. Folder Context

When generating files, place them in the correct directory:

| What you're creating | Where it goes |
|---------------------|---------------|
| New page | `app/(storefront)/[route]/page.tsx` |
| New API endpoint | `app/api/v1/[resource]/route.ts` |
| Reusable UI component | `components/storefront/` or `components/shared/` |
| Admin UI component | `components/admin/` |
| DB query function | `lib/db/queries/[entity].ts` |
| Zod validation schema | `lib/validations/[entity].ts` |
| Server Action | `lib/actions/[entity].ts` or co-located `actions.ts` |
| Email template | `emails/[TemplateName].tsx` (React Email) |
| Zustand store | `store/[name]Store.ts` |
| Custom hook | `hooks/use[Name].ts` |
| Type definitions | `types/[name].ts` |
| DB schema | `lib/db/schema/[name].ts` |

---

## 7. What NOT to Do

- **Do not use the Pages Router** (`pages/` directory). This project uses App Router only.
- **Do not use `getServerSideProps` or `getStaticProps`** — use RSC data fetching patterns.
- **Do not use `useEffect` to fetch data** — use Server Components or TanStack Query.
- **Do not hardcode prices, shipping rates, or thresholds** — read from DB or environment config.
- **Do not expose `RAZORPAY_KEY_SECRET` to client** — it must only appear in server-side code.
- **Do not use `alert()` or `console.log` in production code** — use toast notifications and structured logging.
- **Do not write raw SQL strings** with user input — always use Drizzle parameterised queries.
- **Do not import server-only code in client components** — use `server-only` package to enforce this.
- **Do not use `localStorage` directly** — abstract into a utility or use the cart store.
- **Do not skip Zod validation** on API route inputs, even if the type "looks right".

---

## 8. Testing Instructions

When writing tests:

- **Unit tests (Vitest):** Test pure functions in `lib/utils/`, Zod schemas, business logic helpers
- **Integration tests (Vitest + MSW):** Test API handlers with mocked DB and external services
- **E2E tests (Playwright):** Test critical user journeys
  - User registers and logs in
  - User browses catalogue and adds item to cart
  - User checks out with Razorpay test card
  - Admin updates order status

Mock patterns:
```typescript
// Mocking Drizzle in tests
vi.mock('@/lib/db', () => ({
  db: {
    query: { products: { findFirst: vi.fn() } }
  }
}));
```

---

## 9. Commit Message Convention

Follow **Conventional Commits**:

```
feat: add wishlist functionality
fix: correct stock decrement on order confirmation
chore: update shadcn/ui to latest
refactor: extract product query to lib/db/queries
test: add E2E test for checkout flow
docs: update API.md with review endpoints
```

---

## 10. Asking for Clarification

If a task is ambiguous, ask about:

1. **Which environment** — production data or mock/seed data?
2. **Auth required?** — customer-facing or admin-only?
3. **SSR vs CSR** — should this be a Server Component or Client Component?
4. **New vs update** — creating a new feature or modifying existing behaviour?

For anything affecting payments, stock levels, or user PII — always confirm before implementing destructive or irreversible operations.
