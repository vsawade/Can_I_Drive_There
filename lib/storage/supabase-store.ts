import { getSupabaseAdmin } from "@/lib/supabase/server"
import type { AnalyticsEvent, ReportStatus, StoredReport } from "@/lib/types"

interface ReportRow {
  id: string
  origin_country: string
  destination_country: string
  travel_type: string
  message: string
  source_url: string | null
  status: ReportStatus
  reported_at: string
}

function mapReport(row: ReportRow): StoredReport {
  return {
    id: row.id,
    originCountry: row.origin_country,
    destinationCountry: row.destination_country,
    travelType: row.travel_type,
    message: row.message,
    sourceUrl: row.source_url,
    status: row.status,
    reportedAt: row.reported_at,
  }
}

export async function saveReport(input: {
  originCountry: string
  destinationCountry: string
  travelType: string
  message: string
  sourceUrl: string | null
}): Promise<StoredReport> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("outdated_reports")
    .insert({
      origin_country: input.originCountry,
      destination_country: input.destinationCountry,
      travel_type: input.travelType,
      message: input.message,
      source_url: input.sourceUrl,
      status: "pending",
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save report")
  }

  return mapReport(data as ReportRow)
}

export async function listReports(status?: ReportStatus): Promise<StoredReport[]> {
  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("outdated_reports")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(500)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data as ReportRow[]).map(mapReport)
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<StoredReport | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("outdated_reports")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error || !data) return null
  return mapReport(data as ReportRow)
}

export async function trackAnalytics(
  event: Omit<AnalyticsEvent, "id" | "createdAt">
): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("analytics_events").insert({
    event: event.event,
    origin_country: event.originCountry ?? null,
    destination_country: event.destinationCountry ?? null,
    rule_found: event.ruleFound ?? null,
    metadata: event.metadata ?? null,
  })

  if (error) throw new Error(error.message)
}

export async function getAnalyticsSummary() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("analytics_events")
    .select("event, origin_country, destination_country, rule_found")
    .order("created_at", { ascending: false })
    .limit(2000)

  if (error) throw new Error(error.message)

  const events = (data ?? []).map((row) => ({
    event: row.event as AnalyticsEvent["event"],
    originCountry: row.origin_country ?? undefined,
    destinationCountry: row.destination_country ?? undefined,
    ruleFound: row.rule_found ?? undefined,
  }))

  const routeChecks = events.filter((e) => e.event === "route_check")
  const missing = routeChecks.filter((e) => e.ruleFound === false)

  const pairCounts = new Map<string, number>()
  for (const event of routeChecks) {
    if (!event.originCountry || !event.destinationCountry) continue
    const key = `${event.originCountry}-${event.destinationCountry}`
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
  }

  const missingPairs = new Map<string, number>()
  for (const event of missing) {
    if (!event.originCountry || !event.destinationCountry) continue
    const key = `${event.originCountry}-${event.destinationCountry}`
    missingPairs.set(key, (missingPairs.get(key) ?? 0) + 1)
  }

  return {
    totalEvents: events.length,
    routeChecks: routeChecks.length,
    missingRoutes: missing.length,
    topPairs: [...pairCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pair, count]) => ({ pair, count })),
    topMissing: [...missingPairs.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([pair, count]) => ({ pair, count })),
  }
}

export async function saveTripReminder(input: {
  email: string
  originCountry: string
  destinationCountry: string
  tripDate: string
  stayLength: number
  travelType: string
}): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("trip_reminders").insert({
    email: input.email,
    origin_country: input.originCountry,
    destination_country: input.destinationCountry,
    trip_date: input.tripDate,
    stay_length: input.stayLength,
    travel_type: input.travelType,
  })

  if (error) throw new Error(error.message)
}

export async function getReportCounts() {
  const supabase = getSupabaseAdmin()
  const statuses: ReportStatus[] = ["pending", "reviewed", "applied"]
  const counts: Record<ReportStatus, number> = {
    pending: 0,
    reviewed: 0,
    applied: 0,
  }

  await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await supabase
        .from("outdated_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", status)

      if (!error && count !== null) counts[status] = count
    })
  )

  return counts
}
