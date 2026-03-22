const WINDOW_MS = 60_000;

const sessionMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(sessionId: string, maxRequests: number = 30): boolean {
  const now = Date.now();
  const entry = sessionMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    sessionMap.set(sessionId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// Cleanup old entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessionMap) {
    if (now > value.resetAt) sessionMap.delete(key);
  }
}, 60_000);
