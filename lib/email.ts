import type { TripReminderRequest } from "@/lib/types"

export async function sendTripReminderEmail(
  request: TripReminderRequest,
  checklistUrl: string,
  options: { scheduled?: boolean } = {}
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "reminders@canidrivethere.com"

  if (!apiKey) {
    return { sent: false, reason: "Email service not configured" }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: request.email,
      subject: options.scheduled
        ? `Reminder: review your driving checklist for ${request.destinationCountry}`
        : `Your driving checklist for ${request.destinationCountry}`,
      html: `
        <h2>Can I Drive There? — Trip Reminder</h2>
        <p>${
          options.scheduled
            ? "Your trip is coming up. Review your driving document checklist before you go:"
            : "Here is your driving document checklist link. We will remind you again before your trip:"
        }</p>
        <p><a href="${checklistUrl}">${checklistUrl}</a></p>
        <p>Route: ${request.originCountry} → ${request.destinationCountry}</p>
        <p>Stay: ${request.stayLength} days (${request.travelType})</p>
        <p><small>Always verify with official sources before traveling.</small></p>
      `,
    }),
  })

  if (!response.ok) {
    return { sent: false, reason: "Failed to send email" }
  }

  return { sent: true }
}
