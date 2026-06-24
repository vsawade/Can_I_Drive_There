import { describe, it, expect } from "vitest"
import { checkDrivingRequirements, validateDrivingCheckInput } from "@/lib/check-driving"

describe("validateDrivingCheckInput", () => {
  it("rejects missing fields", () => {
    const result = validateDrivingCheckInput({ originCountry: "US" })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(400)
  })

  it("rejects same origin and destination", () => {
    const result = validateDrivingCheckInput({
      originCountry: "US",
      destinationCountry: "US",
      travelType: "tourist",
      stayLength: 14,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain("different")
  })

  it("rejects invalid stay length", () => {
    const result = validateDrivingCheckInput({
      originCountry: "US",
      destinationCountry: "GB",
      travelType: "tourist",
      stayLength: 999,
    })
    expect(result.ok).toBe(false)
  })

  it("rejects invalid US state", () => {
    const result = validateDrivingCheckInput({
      originCountry: "US",
      destinationCountry: "GB",
      travelType: "tourist",
      stayLength: 14,
      originState: "XX",
    })
    expect(result.ok).toBe(false)
  })
})

describe("checkDrivingRequirements", () => {
  it("returns unverified response for missing routes", () => {
    const result = checkDrivingRequirements({
      originCountry: "BR",
      destinationCountry: "DE",
      travelType: "tourist",
      stayLength: 14,
    })

    expect(result.ruleFound).toBe(false)
    expect(result.dataQuality).toBe("unverified")
    expect(result.confidence).toBe("none")
    expect(result.documents).toHaveLength(0)
    expect(result.lastUpdated).toBeNull()
  })

  it("returns verified data for known routes", () => {
    const result = checkDrivingRequirements({
      originCountry: "US",
      destinationCountry: "GB",
      travelType: "tourist",
      stayLength: 14,
    })

    expect(result.ruleFound).toBe(true)
    expect(result.dataQuality).toBe("verified")
    expect(result.documents.length).toBeGreaterThan(0)
    expect(result.ruleId).toBeTruthy()
  })

  it("flags stay exceeded", () => {
    const result = checkDrivingRequirements({
      originCountry: "US",
      destinationCountry: "AE",
      travelType: "tourist",
      stayLength: 90,
    })

    expect(result.dataQuality).toBe("stay_exceeded")
    expect(result.status).toBe("Needs Verification")
  })

  it("uses tourist fallback for business when no business rule exists", () => {
    const result = checkDrivingRequirements({
      originCountry: "US",
      destinationCountry: "GB",
      travelType: "business",
      stayLength: 14,
    })

    expect(result.ruleFound).toBe(true)
    expect(result.dataQuality).toBe("fallback_tourist")
    expect(result.confidence).toBe("low")
  })

  it("includes rental extras when vehicle mode is rental", () => {
    const result = checkDrivingRequirements({
      originCountry: "US",
      destinationCountry: "IT",
      travelType: "tourist",
      stayLength: 14,
      vehicleMode: "rental",
    })

    expect(result.rentalDocuments.some((d) => d.type.includes("Credit Card"))).toBe(true)
  })

  it("applies US state notes for IDP states", () => {
    const result = checkDrivingRequirements({
      originCountry: "US",
      destinationCountry: "GB",
      travelType: "tourist",
      stayLength: 14,
      originState: "FL",
    })

    expect(result.originStateName).toBe("Florida")
    expect(result.notes.some((n) => n.includes("Florida"))).toBe(true)
  })
})
