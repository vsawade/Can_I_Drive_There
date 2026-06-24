import { NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  limit: number
  windowMs: number
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown"
  return request.headers.get("x-real-ip") ?? "unknown"
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true }
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count += 1
  return { allowed: true }
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  )
}

export function withRateLimit(
  request: Request,
  route: string,
  config: RateLimitConfig
): NextResponse | null {
  const ip = getClientIp(request)
  const result = checkRateLimit(`${route}:${ip}`, config)

  if (!result.allowed && result.retryAfterSeconds) {
    return rateLimitResponse(result.retryAfterSeconds)
  }

  return null
}

/** @internal Test helper */
export function resetRateLimitStore() {
  store.clear()
}
