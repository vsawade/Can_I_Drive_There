import { isStaleDate } from "@/lib/staleness"
import type { ConfidenceLevel, DataQuality, DrivingRule } from "@/lib/types"

export function calculateConfidence(
  rule: DrivingRule | undefined,
  dataQuality: DataQuality,
  ruleFound: boolean
): { level: ConfidenceLevel; reason: string } {
  if (!ruleFound || !rule) {
    return {
      level: "none",
      reason: "No verified data exists for this route.",
    }
  }

  if (dataQuality === "fallback_tourist") {
    return {
      level: "low",
      reason: "Business-travel rules unavailable — showing tourist requirements as a fallback.",
    }
  }

  if (dataQuality === "stay_exceeded") {
    return {
      level: "medium",
      reason: "Standard rules may not cover your planned stay length.",
    }
  }

  const sourceCount = rule.sources.length
  const stale = isStaleDate(rule.lastUpdated)

  if (stale) {
    return {
      level: "low",
      reason: `Last verified ${rule.lastUpdated}. Regulations may have changed.`,
    }
  }

  if (sourceCount >= 2) {
    return {
      level: "high",
      reason: `${sourceCount} official sources, verified ${rule.lastUpdated}.`,
    }
  }

  if (sourceCount === 1) {
    return {
      level: "medium",
      reason: `1 official source, verified ${rule.lastUpdated}.`,
    }
  }

  return {
    level: "low",
    reason: "Limited source coverage for this route.",
  }
}
