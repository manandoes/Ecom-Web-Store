import { Redis } from "@upstash/redis";

// Only create a real Redis client if credentials are configured
const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : (null as unknown as Redis); // Rate limiter has its own no-op fallback
