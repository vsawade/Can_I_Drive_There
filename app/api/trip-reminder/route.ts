import { NextResponse } from "next/server"
import { sendTripReminderEmail } from "@/lib/email"
import { saveTripReminder, trackAnalytics } from "@/lib/storage"
import { getCountryByCode } from "@/lib/data"
import { drivePath } from "@/lib/routes"
import { withRateLimit } from "@/lib/rate-limit"
import { sanitizeCountryCode, sanitizeEmail } from "@/lib/sanitize"
import type { TripReminderRequest } from "@/lib/types"

export async function POST(request: Request) {
  const limited = withRateLimit(request, "trip-reminder", {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  })
  if (limited) return limited

  try {
    const body: TripReminderRequest = await request.json()
    const email = sanitizeEmail(body.email ?? "")
    const originCountry = sanitizeCountryCode(body.originCountry ?? "")
    const destinationCountry = sanitizeCountryCode(body.destinationCountry ?? "")
    const { tripDate, stayLength, travelType } = body

    if (!email || !originCountry || !destinationCountry || !tripDate || !stayLength) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (!getCountryByCode(originCountry) || !getCountryByCode(destinationCountry)) {
      return NextResponse.json({ error: "Invalid country code" }, { status: 400 })
    }

    if (!Number.isFinite(stayLength) || stayLength < 1 || stayLength > 365) {
      return NextResponse.json({ error: "Invalid stay length" }, { status: 400 })
    }

    const trip = new Date(tripDate)
    if (Number.isNaN(trip.getTime()) || trip < new Date()) {
      return NextResponse.json({ error: "Trip date must be in the future" }, { status: 400 })
    }

    const normalizedTravelType = travelType === "business" ? "business" : "tourist"

    await saveTripReminder({
      email,
      originCountry,
      destinationCountry,
      tripDate,
      stayLength,
      travelType: normalizedTravelType,
    })

    const checklistUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://canidrivethere.com"}${drivePath(originCountry, destinationCountry, { days: stayLength, type: normalizedTravelType })}`

    const emailResult = await sendTripReminderEmail(
      {
        email,
        originCountry,
        destinationCountry,
        tripDate,
        stayLength,
        travelType: normalizedTravelType,
      },
      checklistUrl
    )

    await trackAnalytics({
      event: "trip_reminder",
      originCountry,
      destinationCountry,
      metadata: { emailSent: emailResult.sent },
    })

    return NextResponse.json({
      success: true,
      emailSent: emailResult.sent,
      message: emailResult.sent
        ? "Reminder saved. Check your email for your checklist link."
        : "Reminder saved. Email delivery is not configured — bookmark your checklist link.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
