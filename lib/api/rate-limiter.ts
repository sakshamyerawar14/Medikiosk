/**
 * In-Memory Sliding Window Rate Limiter
 * Protects expensive external AI APIs (Google Gemini) from Denial of Wallet,
 * brute-force abuse, and quota exhaustion attacks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowSeconds: 60 }
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    // New or expired window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetInSeconds: options.windowSeconds,
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Extracts a client identifier from Request headers (X-Forwarded-For or remote address)
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
