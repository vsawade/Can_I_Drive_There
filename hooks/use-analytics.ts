"use client"

import { useEffect } from "react"

interface TrackEventInput {
  event: "route_check" | "missing_route" | "report_click" | "share_checklist" | "trip_reminder"
  originCountry?: string
  destinationCountry?: string
  ruleFound?: boolean
  metadata?: Record<string, string | number | boolean>
}

export function trackEvent(input: TrackEventInput) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => {})
}

export function useRouteAnalytics(
  originCountry: string,
  destinationCountry: string,
  ruleFound: boolean
) {
  useEffect(() => {
    trackEvent({
      event: ruleFound ? "route_check" : "missing_route",
      originCountry,
      destinationCountry,
      ruleFound,
    })
  }, [originCountry, destinationCountry, ruleFound])
}
