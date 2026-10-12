interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Sliding window in-memory rate limiter
 * @param identifier User ID or IP address
 * @param limit Max allowed requests within window
 * @param windowMs Time window in milliseconds (default 10 minutes)
 */
export function checkRateLimit(
  identifier: string,
  limit = 8,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  let record = rateLimitMap.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(identifier, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(resetSeconds, 1),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
