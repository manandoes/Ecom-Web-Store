# Deployment
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11

---

## 1. Infrastructure Overview

| Service | Provider | Purpose |
|---------|---------|---------|
| Frontend + API | Vercel | Next.js hosting, serverless functions, edge middleware |
| Database | JioBase (managed) | PostgreSQL-compatible primary database |
| Cache | Upstash | Serverless Redis |
| Media | Cloudinary | Image storage + CDN |
| Email | Resend | Transactional email |
| Payments | Razorpay | Payment processing |
| DNS | Cloudflare (recommended) | DNS management + DDoS protection |
| Monitoring | Sentry + Vercel Analytics | Error tracking + RUM |

---

## 2. Environments

| Environment | Branch | URL | Purpose |
|------------|--------|-----|---------|
| Development | local | `localhost:3000` | Local dev with `.env.local` |
| Preview | `feature/*` | Auto-generated Vercel URL | PR previews, feature review |
| Staging | `staging` | `staging.luminacandles.in` | Integration testing, UAT |
| Production | `main` | `luminacandles.in` | Live store |

Each environment has its own set of environment variables configured in Vercel's dashboard (Development / Preview / Production scopes).

---

## 3. CI/CD Pipeline (GitHub Actions)

### 3.1 Pipeline Overview

```
Push / PR
    │
    ▼
┌─────────────────┐
│   lint-and-type │  ESLint + TypeScript type check
└────────┬────────┘
         │ pass
         ▼
┌─────────────────┐
│      test       │  Vitest unit + integration tests
└────────┬────────┘
         │ pass
         ▼
┌─────────────────┐
│     build       │  next build (validates compilation)
└────────┬────────┘
         │ pass
         ▼
┌─────────────────┐     ┌──────────────────────────────────┐
│    e2e-test     │────►│  Playwright (staging DB snapshot) │
└────────┬────────┘     └──────────────────────────────────┘
         │ pass
         ▼
┌─────────────────┐
│     deploy      │  Vercel deploy (preview or production)
└─────────────────┘
```

### 3.2 Workflow File

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  lint-and-type:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_STAGING }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          # ... other required env vars

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: e2e
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 4. Database Migrations

Migrations are managed with **Drizzle Kit** and run as part of deployment.

### 4.1 Migration Workflow

```bash
# 1. Modify schema files in lib/db/schema/
# 2. Generate migration file
npx drizzle-kit generate

# 3. Review generated SQL in drizzle/ folder
# 4. Apply to staging first
DATABASE_URL=$STAGING_URL npx drizzle-kit migrate

# 5. After staging validation, apply to production
DATABASE_URL=$PROD_URL npx drizzle-kit migrate
```

### 4.2 Automated Migration in CI

For non-destructive migrations (add columns, add tables), migrations run automatically before deployment:

```bash
# In Vercel Build Command (package.json)
"build": "npx drizzle-kit migrate && next build"
```

Destructive migrations (drop column, drop table) are run manually with a maintenance window.

### 4.3 Rollback Strategy

- All migrations are version-controlled in `drizzle/` folder
- Drizzle generates both `up` and `down` SQL
- For emergency rollback: run the corresponding `down` migration
- DB snapshots taken automatically by JioBase before any migration

---

## 5. Vercel Configuration

### 5.1 `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" }
  ]
}
```

Region `bom1` = Mumbai — closest Vercel region for Indian users.

### 5.2 `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: { allowedOrigins: ['luminacandles.in'] },
  },
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
```

---

## 6. DNS & Domain Setup

```
luminacandles.in         A / CNAME → Vercel (76.76.21.21)
www.luminacandles.in     CNAME → cname.vercel-dns.com
staging.luminacandles.in CNAME → cname.vercel-dns.com (Vercel preview)
```

SSL certificates managed automatically by Vercel (Let's Encrypt).

---

## 7. Monitoring & Alerting

### 7.1 Sentry
- Integrated in `instrumentation.ts` (Next.js 14 instrumentation hook)
- Alerts: Slack notification on new issues or error spike (> 10 errors / 5 min)
- Performance tracing: API response times, DB query durations
- Release tracking: new Sentry release created on every production deploy

### 7.2 Vercel Analytics
- Web Vitals tracked automatically (LCP, CLS, FID, TTFB)
- Real-user monitoring from Indian users
- Custom events: `add_to_cart`, `checkout_started`, `order_completed`

### 7.3 Uptime Monitoring
- Betterstack (recommended) pinging `luminacandles.in/api/health` every 1 minute
- Alert via SMS + email on downtime > 1 minute
- Status page at `status.luminacandles.in`

### 7.4 Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);  // DB check
    return Response.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() });
  } catch {
    return Response.json({ status: 'error' }, { status: 503 });
  }
}
```

---

## 8. Backup & Disaster Recovery

| Asset | Backup Frequency | Retention | Location |
|-------|-----------------|-----------|---------|
| JioBase DB | Daily automated snapshot | 7 days | JioBase managed |
| Cloudinary images | Continuous (persistent) | Indefinite | Cloudinary |
| Source code | Every commit | Indefinite | GitHub |

**RTO (Recovery Time Objective):** < 1 hour for DB restore  
**RPO (Recovery Point Objective):** < 24 hours (daily snapshots)

---

## 9. Deployment Runbook

### First Deploy (Initial Setup)

```bash
# 1. Clone repository
git clone git@github.com:org/lumina-candles.git
cd lumina-candles

# 2. Install dependencies
npm ci

# 3. Set up environment variables
cp .env.example .env.local
# Fill in all values

# 4. Run database migrations
npx drizzle-kit migrate

# 5. Seed initial data (categories, sample products)
npx tsx scripts/seed.ts

# 6. Run local dev server
npm run dev

# 7. Connect Vercel project
vercel link

# 8. Set environment variables in Vercel
vercel env add DATABASE_URL production
# ... repeat for all env vars

# 9. Deploy to production
vercel --prod
```

### Hotfix Deploy

```bash
git checkout main
git checkout -b hotfix/issue-description
# Make fix
git add . && git commit -m "fix: description"
git push origin hotfix/issue-description
# Open PR → merge to main → auto-deploy triggers
```

---

## 10. Performance Optimisation Checklist (Pre-Launch)

- [ ] Run `npm run build` and check bundle sizes with `@next/bundle-analyzer`
- [ ] Verify all images served as WebP/AVIF via Cloudinary
- [ ] Check Lighthouse score ≥ 90 on mobile for homepage and PDP
- [ ] Verify ISR is working (check `x-nextjs-cache: HIT` header on product pages)
- [ ] Test checkout flow end-to-end with Razorpay test keys
- [ ] Confirm all emails send correctly (order confirmation, dispatch, reset password)
- [ ] Run Playwright E2E suite against staging
- [ ] Check Sentry is receiving events
- [ ] Verify Vercel Analytics collecting Web Vitals
- [ ] Test mobile experience on iOS Safari and Android Chrome
