/**
 * Minimal in-memory fixed-window rate limiter. Good enough for a single
 * long-running container (this app's actual deployment — see
 * docker-compose.prod.yml) but resets on restart and doesn't share state
 * across replicas. Revisit if this ever runs as more than one instance.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Opportunistic sweep so `buckets` doesn't grow forever across a long
// container lifetime. unref() so it never keeps the process alive on its own.
const SWEEP_INTERVAL_MS = 10 * 60_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, SWEEP_INTERVAL_MS).unref?.();

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  const limited = bucket.count > max;
  return { limited, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}

/** nginx sets both of these on every request (see the skzic.co.za vhost); x-forwarded-for wins since it's the standard header, x-real-ip is the fallback. */
export function clientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
