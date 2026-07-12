import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  success: boolean;
  /** Maximum number of requests allowed in the window. */
  limit: number;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  reset: number;
}

// ---------------------------------------------------------------------------
// Development mock
// ---------------------------------------------------------------------------

/**
 * In development mode we skip actual Redis calls so that the app works
 * without Upstash credentials set up locally.
 */
const isDev = process.env.NODE_ENV === "development";

function createMockRateLimiter(): { limit: (_id: string) => Promise<RateLimitResult> } {
  return {
    async limit(_id: string): Promise<RateLimitResult> {
      return {
        success: true,
        limit: Infinity,
        remaining: Infinity,
        reset: Date.now() + 60_000,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Redis client (shared, lazy singleton)
// ---------------------------------------------------------------------------

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables.",
    );
  }

  return new Redis({ url, token });
}

// ---------------------------------------------------------------------------
// Rate limiter factory
// ---------------------------------------------------------------------------

type RateLimiterInstance = ReturnType<typeof Ratelimit.prototype.limit> extends Promise<infer R>
  ? { limit: (id: string) => Promise<R> }
  : never;

function createRateLimiter(
  requests: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
): { limit: (id: string) => Promise<RateLimitResult> } {
  if (isDev) {
    return createMockRateLimiter();
  }

  const ratelimiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  return {
    async limit(id: string): Promise<RateLimitResult> {
      const result = await ratelimiter.limit(id);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Pre-configured rate limiters
// ---------------------------------------------------------------------------

/**
 * Contact form submissions: 5 requests per IP per hour.
 * Prevents spam while allowing legitimate re-submissions.
 */
export const contactRateLimit = createRateLimiter(5, "1 h");

/**
 * Project like actions: 10 requests per IP per minute.
 * Prevents rapid like-spam while allowing burst clicking.
 */
export const likeRateLimit = createRateLimiter(10, "1 m");

/**
 * General API endpoints: 100 requests per IP per minute.
 * Provides a broad ceiling for all other API routes.
 */
export const apiRateLimit = createRateLimiter(100, "1 m");

// ---------------------------------------------------------------------------
// Helper — get client identifier for rate limiting
// ---------------------------------------------------------------------------

/**
 * Derives a stable rate-limit key from the incoming request.
 * Falls back through x-forwarded-for → x-real-ip → "anonymous".
 *
 * @param request - The incoming Next.js Request object.
 * @returns A string identifier suitable for use as a rate-limit key.
 */
export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; use the first IP.
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "anonymous";
}

/**
 * Builds a standardised rate-limit response with appropriate headers.
 *
 * @param result    - The result returned by a rate limiter.
 * @param namespace - Optional namespace to prefix to the Retry-After header.
 * @returns A 429 Response if the limit was exceeded, otherwise null.
 */
export function buildRateLimitResponse(
  result: RateLimitResult,
  namespace = "global",
): Response | null {
  if (result.success) return null;

  const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} second${retryAfterSeconds !== 1 ? "s" : ""}.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Namespace": namespace,
      },
    },
  );
}
