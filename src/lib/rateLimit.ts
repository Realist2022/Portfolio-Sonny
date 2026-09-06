/**
 * A fixed-window, in-memory rate limiter.
 *
 * Deliberately simple: the CV Guestimator endpoints wake a GPU on Modal, so the
 * job here is to stop one visitor (or a scraper) from running up a bill, not to
 * be a precise distributed quota.
 *
 * CAVEAT: the counters live in this process. A serverless or multi-instance
 * deploy gives each instance its own map, so the effective limit is
 * `limit x instances`. If that ever matters, swap the Map for Redis/Upstash —
 * the call sites don't change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

// Hung off globalThis so the counters survive Next's dev-mode hot reloads;
// a module-level Map would reset on every save and make the limit meaningless
// while developing.
const store: Map<string, Bucket> = ((
  globalThis as typeof globalThis & { __rateLimitBuckets?: Map<string, Bucket> }
).__rateLimitBuckets ??= new Map());

/** Drop expired buckets so the map can't grow without bound. */
function prune(now: number): void {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Epoch ms when the current window ends. */
  resetAt: number;
  /** Whole seconds until the window ends, for a Retry-After header. */
  retryAfterSeconds: number;
}

function evaluate(
  key: string,
  limit: number,
  windowMs: number,
  consume: boolean
): RateLimitResult {
  const now = Date.now();
  if (store.size > 5000) prune(now);

  const existing = store.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  if (consume) {
    bucket.count += 1;
    store.set(key, bucket);
  }

  const used = consume ? bucket.count : bucket.count + 1;
  return {
    allowed: used <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/**
 * Would the next request be allowed? Does not spend anything.
 *
 * Callers check this up front, then `rateLimit` once the request turns out to
 * be one worth charging for — so a visitor who picks the wrong file type gets
 * an error instead of losing a slot they never used.
 */
export function peekRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  return evaluate(key, limit, windowMs, false);
}

/** Spend one request against `key`'s window. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  return evaluate(key, limit, windowMs, true);
}

/**
 * Best-effort client IP.
 *
 * Behind a proxy (Vercel, nginx, Cloudflare) the socket address is the proxy's,
 * so the forwarding headers are all there is. They are spoofable by a direct
 * caller, which is another reason this is a cost guard rather than a security
 * control.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
