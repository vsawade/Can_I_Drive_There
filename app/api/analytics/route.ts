import { NextResponse } from "next/server"
import { isAdminRequestAuthorized } from "@/lib/admin-auth"
import { trackAnalytics } from "@/lib/storage"
import { withRateLimit } from "@/lib/rate-limit"
import { sanitizeCountryCode } from "@/lib/sanitize"
import type { AnalyticsEvent } from "@/lib/types"

const ALLOWED_EVENTS: AnalyticsEvent["event"][] = [
  "route_check",
  "missing_route",
  "report_click",
  "share_checklist",
  "trip_reminder",
]

export async function POST(request: Request) {
  const limited = withRateLimit(request, "analytics", {
    limit: 60,
    windowMs: 60 * 1000,
  })
  if (limited) return limited

  try {
    const body = await request.json()
    const { event, ruleFound, metadata } = body
    const originCountry = body.originCountry
      ? sanitizeCountryCode(body.originCountry)
      : undefined
    const destinationCountry = body.destinationCountry
      ? sanitizeCountryCode(body.destinationCountry)
      : undefined

    if (!event || !ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 })
    }

    const safeMetadata =
      metadata && typeof metadata === "object"
        ? (Object.fromEntries(
            Object.entries(metadata as Record<string, unknown>)
              .slice(0, 10)
              .filter(
                (entry): entry is [string, string | number | boolean] =>
                  typeof entry[1] === "string" ||
                  typeof entry[1] === "number" ||
                  typeof entry[1] === "boolean"
              )
              .map(([k, v]) => [k.slice(0, 50), v])
          ) as Record<string, string | number | boolean>)
        : undefined

    await trackAnalytics({
      event,
      originCountry,
      destinationCountry,
      ruleFound: typeof ruleFound === "boolean" ? ruleFound : undefined,
      metadata: safeMetadata,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { getAnalyticsSummary } = await import("@/lib/storage")
  const summary = await getAnalyticsSummary()
  return NextResponse.json(summary)
}
