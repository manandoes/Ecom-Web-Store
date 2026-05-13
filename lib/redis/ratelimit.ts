import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./client";

// Check if Redis is configured
const isRedisConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a no-op rate limiter that always allows requests when Redis is not configured
const createNoopLimiter = () => ({
  limit: async (_identifier: string) => ({
    success: true,
    limit: 0,
    remaining: 0,
    reset: 0,
    pending: Promise.resolve(),
  }),
});

// Rate limit for authentication attempts (register, login)
// 5 requests per minute per IP
export const authRateLimit = isRedisConfigured
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/auth",
    })
  : createNoopLimiter();

// Rate limit for checkout and order creation
// 10 requests per minute per IP
export const checkoutRateLimit = isRedisConfigured
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit/checkout",
    })
  : createNoopLimiter();
