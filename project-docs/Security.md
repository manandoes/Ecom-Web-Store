# Security
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11

---

## 1. Security Principles

- **Least privilege** — every component and service has only the permissions it needs
- **Defence in depth** — multiple layers of controls; no single point of failure
- **Fail secure** — errors default to denial, not permissiveness
- **Zero trust** — all requests are authenticated and validated regardless of origin

---

## 2. Authentication & Session Security

### 2.1 Password Handling
- Passwords hashed with **bcrypt** at cost factor 12 before storage
- Password never logged, returned in API responses, or stored in plain text
- Minimum password requirements: 8+ chars, at least one uppercase, one number
- Password strength meter shown during registration

### 2.2 Session Management
- **JWT strategy** with Auth.js v5
- Access tokens expire in **15 minutes**
- Refresh tokens expire in **30 days**, stored hashed in DB
- Refresh tokens are rotated on each use (sliding expiry)
- Sessions invalidated on logout (token blacklisted in Redis until natural expiry)
- `httpOnly` cookies for session tokens — not accessible via JavaScript

### 2.3 OAuth Security
- Google OAuth uses PKCE (Proof Key for Code Exchange)
- State parameter validated to prevent CSRF during OAuth flow
- OAuth `redirect_uri` whitelisted to production domain only

### 2.4 Brute Force Protection
- Login: max **5 failed attempts per 15 minutes per IP** → temporary lockout
- Rate limiting implemented via Upstash Redis counters at Vercel Edge Middleware
- Account lockout notification email sent to user after 5 failures

---

## 3. API Security

### 3.1 Input Validation
- All API request bodies validated with **Zod schemas** before processing
- Validation runs server-side; client-side validation is UX-only
- Reject unknown fields with `z.strictObject()` on sensitive endpoints
- SQL injection impossible via **Drizzle ORM parameterised queries** (no raw string interpolation)

### 3.2 Authentication on Routes
- All non-public routes require a valid session
- Admin routes verify `user.role === 'admin'` server-side (not just client-side)
- Resource ownership checked: users can only access their own orders, reviews, addresses

```typescript
// Example: server-side ownership check
const order = await db.query.orders.findFirst({
  where: and(
    eq(orders.id, orderId),
    eq(orders.userId, session.user.id)  // ownership enforced in query
  )
});
if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
```

### 3.3 CSRF Protection
- Next.js Server Actions have built-in CSRF protection (origin validation)
- API routes that mutate state require `Content-Type: application/json` header
- SameSite=Lax cookie policy prevents cross-origin cookie submission

### 3.4 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST `/auth/login` | 5 req | 15 min per IP |
| POST `/auth/register` | 3 req | 1 hour per IP |
| POST `/auth/forgot-password` | 3 req | 1 hour per email |
| POST `/checkout/*` | 5 req | 1 min per IP |
| POST `/reviews` | 3 req | 10 min per user |
| Public catalogue GET | 200 req | 1 min per IP |

Implementation using Upstash Ratelimit SDK:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15m"),
});
const { success } = await ratelimit.limit(ip);
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

---

## 4. Payment Security

### 4.1 Razorpay Integration
- Razorpay secret key **never exposed to client** — stored server-side only
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is the only key sent to the browser (public key)
- Payment amounts calculated and verified **server-side only** — client never sets the final amount
- Razorpay payment signature verified using HMAC-SHA256 on every payment confirmation

```typescript
// Payment verification — always server-side
const expectedSig = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  .digest('hex');

if (expectedSig !== razorpaySignature) {
  throw new Error('Payment signature verification failed');
}
```

### 4.2 Webhook Security
- Razorpay webhook secret stored as `RAZORPAY_WEBHOOK_SECRET` env variable
- Every webhook request signature validated before processing
- Idempotency enforced: payment event processed at most once (checked via `razorpay_payment_id` in DB)

### 4.3 PCI-DSS Compliance
- No card data ever touches our servers — Razorpay is the PCI-DSS-compliant processor
- Card data collected and tokenised entirely within Razorpay's hosted checkout
- We store only Razorpay payment IDs, never raw card numbers

---

## 5. Data Security

### 5.1 Sensitive Data Handling
- Email addresses stored plain text (needed for communication)
- Passwords stored as bcrypt hashes (never reversible)
- Payment data stored as Razorpay IDs only (no raw card data)
- PII (name, address, phone) encrypted at rest by JioBase (provider-level encryption)

### 5.2 Environment Variables
- All secrets in Vercel Environment Variables (never in source code)
- `.env.local` is `.gitignored` — never committed
- Separate env sets for `development`, `preview`, and `production`
- Secret rotation procedure: update in Vercel dashboard + redeploy

### 5.3 Database Security
- JioBase connection string uses SSL (`sslmode=require`)
- DB user has minimal permissions: SELECT, INSERT, UPDATE, DELETE on app tables only — no DROP, ALTER, CREATE
- Direct DB access not exposed publicly — accessible only from Vercel serverless function IPs
- Connection pooling configured to limit max connections per instance

---

## 6. Frontend Security

### 6.1 Content Security Policy (CSP)
```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://res.cloudinary.com;
  connect-src 'self' https://api.razorpay.com https://vitals.vercel-insights.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://api.razorpay.com;
`;
```

### 6.2 HTTP Security Headers
```typescript
// next.config.ts headers
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}
```

### 6.3 XSS Prevention
- React's JSX escapes all dynamic content by default
- `dangerouslySetInnerHTML` never used with user-provided data
- Rich text editor (product descriptions) uses DOMPurify to sanitise HTML before render
- `next/image` prevents hotlink abuse

---

## 7. File Upload Security

- Image uploads go directly to **Cloudinary** via signed upload URL — files never pass through our server
- Signed upload URLs generated server-side with expiry (60 seconds)
- Cloudinary configured to accept only `jpg`, `png`, `webp` MIME types
- File size limit: 5MB per image, max 8 images per product
- Cloudinary scans uploads for malware (built-in feature)

---

## 8. Admin Security

- Admin routes protected at both middleware (Edge) and handler level
- Admin session has shorter absolute timeout: 4 hours (vs 30 days for customers)
- All admin mutations logged to an audit log table (`admin_audit_log`)
- Sensitive admin actions (mass delete, refund) require re-authentication

---

## 9. Dependency Security

- `npm audit` runs in CI — build fails on high/critical vulnerabilities
- Dependabot enabled for automated security patch PRs
- Only well-maintained packages from trusted publishers
- `package-lock.json` committed and integrity-checked in CI

---

## 10. Incident Response

| Scenario | Response |
|----------|---------|
| Suspected data breach | Rotate all secrets immediately, notify affected users within 72 hours, notify JioBase support |
| Payment fraud detected | Disable COD, contact Razorpay support, flag affected orders |
| DDoS / abuse | Tighten rate limits in Redis, enable Vercel DDoS protection, review logs |
| Compromised admin account | Invalidate all sessions, force password reset, review audit log |

Security issues can be reported to: **security@luminacandles.in**
