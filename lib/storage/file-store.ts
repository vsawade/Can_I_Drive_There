import { promises as fs } from "fs"
import path from "path"
import type { AnalyticsEvent, ReportStatus, StoredReport, StoredTripReminder } from "@/lib/types"

const DATA_DIR = path.join(process.cwd(), ".data")

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export async function saveReport(input: {
  originCountry: string
  destinationCountry: string
  travelType: string
  message: string
  sourceUrl: string | null
}): Promise<StoredReport> {
  const reports = await readJsonFile<StoredReport[]>("reports.json", [])
  const report: StoredReport = {
    id: createId("report"),
    ...input,
    status: "pending",
    reportedAt: new Date().toISOString(),
  }
  reports.unshift(report)
  await writeJsonFile("reports.json", reports.slice(0, 500))
  return report
}

export async function listReports(status?: ReportStatus): Promise<StoredReport[]> {
  const reports = await readJsonFile<StoredReport[]>("reports.json", [])
  if (!status) return reports
  return reports.filter((r) => r.status === status)
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<StoredReport | null> {
  const reports = await readJsonFile<StoredReport[]>("reports.json", [])
  const index = reports.findIndex((r) => r.id === id)
  if (index === -1) return null
  reports[index] = { ...reports[index], status }
  await writeJsonFile("reports.json", reports)
  return reports[index]
}

export async function trackAnalytics(
  event: Omit<AnalyticsEvent, "id" | "createdAt">
): Promise<void> {
  const events = await readJsonFile<AnalyticsEvent[]>("analytics.json", [])
  events.unshift({
    id: createId("evt"),
    createdAt: new Date().toISOString(),
    ...event,
  })
  await writeJsonFile("analytics.json", events.slice(0, 2000))
}

export async function getAnalyticsSummary() {
  const events = await readJsonFile<AnalyticsEvent[]>("analytics.json", [])
  const routeChecks = events.filter((e) => e.event === "route_check")
  const missing = routeChecks.filter((e) => e.ruleFound === false)

  const pairCounts = new Map<string, number>()
  for (const event of routeChecks) {
    if (!event.originCountry || !event.destinationCountry) continue
    const key = `${event.originCountry}-${event.destinationCountry}`
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
  }

  const topPairs = [...pairCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([pair, count]) => ({ pair, count }))

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
    topPairs,
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
  reminderDate: string
  stayLength: number
  travelType: string
}): Promise<StoredTripReminder> {
  const reminders = await readJsonFile<StoredTripReminder[]>("reminders.json", [])
  const reminder: StoredTripReminder = {
    id: createId("reminder"),
    email: input.email,
    originCountry: input.originCountry,
    destinationCountry: input.destinationCountry,
    tripDate: input.tripDate,
    reminderDate: input.reminderDate,
    stayLength: input.stayLength,
    travelType: input.travelType as StoredTripReminder["travelType"],
    createdAt: new Date().toISOString(),
    sentAt: null,
    lastError: null,
  }
  reminders.unshift(reminder)
  await writeJsonFile("reminders.json", reminders.slice(0, 200))
  return reminder
}

export async function listDueTripReminders(
  today: string,
  limit = 50
): Promise<StoredTripReminder[]> {
  const reminders = await readJsonFile<StoredTripReminder[]>("reminders.json", [])
  return reminders
    .filter((reminder) => !reminder.sentAt && reminder.reminderDate <= today)
    .slice(0, limit)
}

export async function markTripReminderSent(
  id: string,
  sentAt: string,
  lastError: string | null = null
): Promise<void> {
  const reminders = await readJsonFile<StoredTripReminder[]>("reminders.json", [])
  const index = reminders.findIndex((reminder) => reminder.id === id)
  if (index === -1) return

  reminders[index] = {
    ...reminders[index],
    sentAt,
    lastError,
  }
  await writeJsonFile("reminders.json", reminders)
}

export async function markTripReminderFailed(id: string, lastError: string): Promise<void> {
  const reminders = await readJsonFile<StoredTripReminder[]>("reminders.json", [])
  const index = reminders.findIndex((reminder) => reminder.id === id)
  if (index === -1) return

  reminders[index] = {
    ...reminders[index],
    lastError,
  }
  await writeJsonFile("reminders.json", reminders)
}
