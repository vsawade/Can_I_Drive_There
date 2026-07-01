import { NextResponse } from "next/server"
import { sendTripReminderEmail } from "@/lib/email"
import {
  listDueTripReminders,
  markTripReminderFailed,
  markTripReminderSent,
  trackAnalytics,
} from "@/lib/storage"
import { drivePath } from "@/lib/routes"

export const dynamic = "force-dynamic"

function toDateString(date: Date) {
  return date.toISOString().split("T")[0]
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const authorization = request.headers.get("authorization")
  if (authorization === `Bearer ${secret}`) return true

  return request.headers.get("x-cron-secret") === secret
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = toDateString(new Date())
  const dueReminders = await listDueTripReminders(today)
  let sent = 0
  let failed = 0

  for (const reminder of dueReminders) {
    const checklistUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://canidrivethere.com"}${drivePath(reminder.originCountry, reminder.destinationCountry, { days: reminder.stayLength, type: reminder.travelType })}`
    const emailResult = await sendTripReminderEmail(reminder, checklistUrl, { scheduled: true })

    if (emailResult.sent) {
      sent += 1
      await markTripReminderSent(reminder.id, new Date().toISOString())
      await trackAnalytics({
        event: "trip_reminder",
        originCountry: reminder.originCountry,
        destinationCountry: reminder.destinationCountry,
        metadata: { scheduled: true, sent: true },
      })
    } else {
      failed += 1
      await markTripReminderFailed(reminder.id, emailResult.reason ?? "Failed to send email")
    }
  }

  return NextResponse.json({
    success: true,
    checkedDate: today,
    due: dueReminders.length,
    sent,
    failed,
  })
}
