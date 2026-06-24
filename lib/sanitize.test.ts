import { describe, it, expect } from "vitest"
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize"

describe("sanitizeText", () => {
  it("strips HTML tags", () => {
    expect(sanitizeText("<script>alert(1)</script>Hello", 100)).toBe("alert(1)Hello")
  })

  it("trims and enforces max length", () => {
    expect(sanitizeText("  hello world  ", 5)).toBe("hello")
  })
})

describe("sanitizeUrl", () => {
  it("accepts https URLs", () => {
    expect(sanitizeUrl("https://gov.uk/driving")).toBe("https://gov.uk/driving")
  })

  it("rejects javascript URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull()
  })

  it("returns null for empty input", () => {
    expect(sanitizeUrl("")).toBeNull()
  })
})
