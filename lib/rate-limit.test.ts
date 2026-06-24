import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit, resetRateLimitStore } from "@/lib/rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore()
  })

  it("allows requests under the limit", () => {
    const config = { limit: 3, windowMs: 60_000 }
    expect(checkRateLimit("test-ip", config).allowed).toBe(true)
    expect(checkRateLimit("test-ip", config).allowed).toBe(true)
    expect(checkRateLimit("test-ip", config).allowed).toBe(true)
  })

  it("blocks requests over the limit", () => {
    const config = { limit: 2, windowMs: 60_000 }
    checkRateLimit("test-ip", config)
    checkRateLimit("test-ip", config)
    const result = checkRateLimit("test-ip", config)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })
})
