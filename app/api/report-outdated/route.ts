import { NextResponse } from "next/server"
import { saveReport } from "@/lib/storage"
import { getCountryByCode } from "@/lib/data"
import { withRateLimit } from "@/lib/rate-limit"
import { sanitizeCountryCode, sanitizeText, sanitizeUrl } from "@/lib/sanitize"
import type { OutdatedReportRequest } from "@/lib/types"

export async function POST(request: Request) {
  const limited = withRateLimit(request, "report-outdated", {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  })
  if (limited) return limited

  try {
    const body: OutdatedReportRequest = await request.json()
    const originCountry = sanitizeCountryCode(body.originCountry ?? "")
    const destinationCountry = sanitizeCountryCode(body.destinationCountry ?? "")
    const message = sanitizeText(body.message ?? "", 2000)
    const sourceUrl = sanitizeUrl(body.sourceUrl)
    const travelType = body.travelType === "business" ? "business" : "tourist"

    if (!originCountry || !destinationCountry || !message) {
      return NextResponse.json(
        { error: "Origin, destination, and message are required" },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please provide more detail (at least 10 characters)" },
        { status: 400 }
      )
    }

    const origin = getCountryByCode(originCountry)
    const destination = getCountryByCode(destinationCountry)

    if (!origin || !destination) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 })
    }

    const report = await saveReport({
      originCountry,
      destinationCountry,
      travelType,
      message,
      sourceUrl,
    })

    return NextResponse.json({
      success: true,
      id: report.id,
      message: "Thank you. Your report has been received and will be reviewed.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
