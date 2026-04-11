# API Reference
## Handmade Scented Candles — E-Commerce Web Store

**Version:** 1.0  
**Date:** 2026-04-11  
**Base URL:** `https://luminacandles.in/api/v1`

---

## 1. Conventions

- All requests and responses use `application/json`
- Authenticated endpoints require `Authorization: Bearer <token>` header
- Admin endpoints additionally require the user's role to be `admin`
- Dates are ISO 8601 strings (`2026-04-11T10:30:00Z`)
- Monetary values are strings with 2 decimal places (`"499.00"`)
- Pagination: `?page=1&limit=24`; response includes `meta.total`, `meta.page`, `meta.pages`
- Errors follow the format below

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 24, "total": 120, "pages": 5 }
}
```

---

## 2. Authentication

### POST `/auth/register`
Register a new customer account.

**Request Body**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "SecurePass123!"
}
```

**Response 201**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "emailVerified": null
  }
}
```

---

### POST `/auth/login`
Login with email and password (credential-based).

**Request Body**
```json
{ "email": "priya@example.com", "password": "SecurePass123!" }
```

**Response 200**
```json
{
  "success": true,
  "data": { "sessionToken": "jwt...", "user": { "id": "uuid", "name": "Priya", "role": "customer" } }
}
```

---

### POST `/auth/logout`
Invalidate the current session. Requires auth.

---

### POST `/auth/forgot-password`
Send password reset email.

**Request Body** `{ "email": "priya@example.com" }`

---

### POST `/auth/reset-password`
Reset password with token from email.

**Request Body** `{ "token": "...", "password": "NewSecure123!" }`

---

## 3. Products

### GET `/products`
List products with filtering, sorting, and pagination.

**Query Parameters**

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `24` |
| `category` | string (slug) | `floral` |
| `scentFamily` | string | `woody` |
| `minPrice` | number | `200` |
| `maxPrice` | number | `1500` |
| `inStock` | boolean | `true` |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `rating`, `best_selling` |
| `search` | string | `lavender` |

**Response 200**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Lavender Dreams",
      "slug": "lavender-dreams-8oz",
      "shortDesc": "Calming lavender with hints of vanilla",
      "scentFamily": "floral",
      "basePrice": "599.00",
      "avgRating": "4.7",
      "reviewCount": 42,
      "primaryImage": "https://res.cloudinary.com/.../lavender-8oz.webp",
      "variants": [
        { "id": "uuid", "name": "4oz", "price": "299.00", "stockQty": 12 },
        { "id": "uuid", "name": "8oz", "price": "599.00", "stockQty": 8 }
      ],
      "status": "active"
    }
  ],
  "meta": { "page": 1, "limit": 24, "total": 67, "pages": 3 }
}
```

---

### GET `/products/:slug`
Get a single product by slug with full details.

**Response 200**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Lavender Dreams",
    "slug": "lavender-dreams-8oz",
    "description": "...",
    "scentFamily": "floral",
    "topNotes": "Lavender, Bergamot",
    "middleNotes": "Jasmine",
    "baseNotes": "Vanilla, Musk",
    "waxType": "soy",
    "wickType": "cotton",
    "burnTime": "40–50 hours",
    "basePrice": "599.00",
    "images": [{ "url": "...", "altText": "...", "isPrimary": true }],
    "variants": [...],
    "category": { "id": "uuid", "name": "Floral", "slug": "floral" },
    "avgRating": "4.7",
    "reviewCount": 42,
    "metaTitle": "...",
    "metaDesc": "...",
    "relatedProducts": [...]
  }
}
```

---

### GET `/products/search`
Full-text search across product names, descriptions, and tags.

**Query:** `?q=lavender&limit=10`

---

## 4. Categories

### GET `/categories`
List all active categories.

### GET `/categories/:slug/products`
Get products under a category (same query params as `/products`).

---

## 5. Cart

### GET `/cart`
Get current cart. For guests, pass `X-Guest-Token` header. For auth users, uses session.

**Response 200**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "variantId": "uuid",
        "productName": "Lavender Dreams",
        "variantName": "8oz",
        "unitPrice": "599.00",
        "quantity": 2,
        "lineTotal": "1198.00",
        "imageUrl": "...",
        "stockQty": 8
      }
    ],
    "subtotal": "1198.00",
    "estimatedShipping": "99.00",
    "total": "1297.00",
    "freeShippingThreshold": "999.00",
    "freeShippingRemaining": "0.00"
  }
}
```

---

### POST `/cart/items`
Add an item to cart.

**Request Body**
```json
{ "variantId": "uuid", "quantity": 1 }
```

---

### PATCH `/cart/items/:itemId`
Update quantity of a cart item.

**Request Body** `{ "quantity": 3 }`

---

### DELETE `/cart/items/:itemId`
Remove an item from cart.

---

### POST `/cart/coupon`
Apply a coupon code.

**Request Body** `{ "code": "WELCOME10" }`

**Response 200**
```json
{
  "success": true,
  "data": {
    "code": "WELCOME10",
    "type": "percentage",
    "value": "10",
    "discountAmount": "119.80",
    "newTotal": "1177.20"
  }
}
```

---

## 6. Checkout & Orders

### POST `/checkout/validate`
Validate stock availability before payment. Call before creating Razorpay order.

**Request Body** `{ "items": [{ "variantId": "uuid", "quantity": 2 }] }`

---

### POST `/checkout/create-payment`
Create a Razorpay order. Requires validated cart.

**Request Body**
```json
{
  "cartId": "uuid",
  "shippingAddressId": "uuid",
  "shippingMethod": "standard",
  "couponCode": "WELCOME10"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "LC-2026-00042",
    "razorpayOrderId": "order_abc123",
    "amount": 118,
    "currency": "INR",
    "keyId": "rzp_live_..."
  }
}
```

---

### POST `/checkout/verify-payment`
Verify Razorpay payment signature and confirm order.

**Request Body**
```json
{
  "orderId": "uuid",
  "razorpayOrderId": "order_abc123",
  "razorpayPaymentId": "pay_xyz789",
  "razorpaySignature": "..."
}
```

---

### GET `/orders`
List authenticated user's orders. Requires auth.

**Query:** `?page=1&limit=10&status=dispatched`

---

### GET `/orders/:orderNumber`
Get order detail. Requires auth (own order) or admin.

---

## 7. Reviews

### GET `/products/:productId/reviews`
Get paginated reviews for a product.

**Query:** `?page=1&limit=10&sort=newest`

---

### POST `/products/:productId/reviews`
Submit a review. Requires auth. One review per product per user.

**Request Body**
```json
{ "rating": 5, "title": "Amazing scent!", "body": "Fills the whole room..." }
```

---

### PATCH `/reviews/:reviewId`
Edit own review. Requires auth.

---

### DELETE `/reviews/:reviewId`
Delete own review or any review (admin). Requires auth.

---

## 8. Wishlist

### GET `/wishlist` — Requires auth
### POST `/wishlist` — `{ "productId": "uuid" }`
### DELETE `/wishlist/:productId`

---

## 9. Admin Endpoints

All admin endpoints require `role: admin`.

### Products
- `POST /admin/products` — Create product
- `PATCH /admin/products/:id` — Update product
- `DELETE /admin/products/:id` — Soft-delete (archive)
- `POST /admin/products/:id/images` — Upload images (multipart)
- `DELETE /admin/products/:id/images/:imageId`

### Orders
- `GET /admin/orders` — `?status=&dateFrom=&dateTo=&search=`
- `GET /admin/orders/:id`
- `PATCH /admin/orders/:id/status` — `{ "status": "dispatched", "trackingNumber": "...", "trackingUrl": "..." }`
- `POST /admin/orders/:id/cancel` — `{ "reason": "..." }`
- `POST /admin/orders/:id/refund` — `{ "amount": "499.00", "reason": "..." }`

### Inventory
- `PATCH /admin/variants/:id/stock` — `{ "stockQty": 25 }`

### Discounts
- `GET /admin/discounts`
- `POST /admin/discounts`
- `PATCH /admin/discounts/:id`
- `DELETE /admin/discounts/:id`

### Analytics
- `GET /admin/analytics/summary` — `?from=2026-04-01&to=2026-04-11`
- `GET /admin/analytics/top-products` — `?limit=10&from=...&to=...`

---

## 10. Webhooks

### POST `/webhooks/razorpay`
Razorpay payment events. Validates `X-Razorpay-Signature` header.

**Handled Events**
- `payment.captured` → confirm order, reduce stock, send confirmation email
- `payment.failed` → mark order as failed
- `refund.created` → update payment record

```typescript
// Signature validation
import crypto from 'crypto';
const expected = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
  .update(rawBody)
  .digest('hex');
if (expected !== req.headers['x-razorpay-signature']) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

---

## 11. Rate Limits

| Endpoint Group | Limit |
|---------------|-------|
| Auth (login, register) | 10 req / 15 min per IP |
| Checkout | 5 req / min per IP |
| Public catalogue | 200 req / min per IP |
| Admin | 100 req / min per user |
| Webhooks | Unlimited (signature-verified) |
