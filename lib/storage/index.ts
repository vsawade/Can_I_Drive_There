import { getStorageBackend } from "@/lib/supabase/server"
import type { AnalyticsEvent, ReportStatus, StoredReport, StoredTripReminder } from "@/lib/types"
import * as fileStore from "./file-store"
import * as supabaseStore from "./supabase-store"

function store() {
  return getStorageBackend() === "supabase" ? supabaseStore : fileStore
}

export async function saveReport(input: {
  originCountry: string
  destinationCountry: string
  travelType: string
  message: string
  sourceUrl: string | null
}): Promise<StoredReport> {
  return store().saveReport(input)
}

export async function listReports(status?: ReportStatus): Promise<StoredReport[]> {
  return store().listReports(status)
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus
): Promise<StoredReport | null> {
  return store().updateReportStatus(id, status)
}

export async function trackAnalytics(
  event: Omit<AnalyticsEvent, "id" | "createdAt">
): Promise<void> {
  return store().trackAnalytics(event)
}

export async function getAnalyticsSummary() {
  return store().getAnalyticsSummary()
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
  return store().saveTripReminder(input)
}

export async function listDueTripReminders(
  today: string,
  limit = 50
): Promise<StoredTripReminder[]> {
  return store().listDueTripReminders(today, limit)
}

export async function markTripReminderSent(
  id: string,
  sentAt: string,
  lastError?: string | null
): Promise<void> {
  return store().markTripReminderSent(id, sentAt, lastError)
}

export async function markTripReminderFailed(id: string, lastError: string): Promise<void> {
  return store().markTripReminderFailed(id, lastError)
}

export async function getReportCounts(): Promise<Record<ReportStatus, number>> {
  if (getStorageBackend() === "supabase" && "getReportCounts" in supabaseStore) {
    return supabaseStore.getReportCounts()
  }

  const reports = await fileStore.listReports()
  return {
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    applied: reports.filter((r) => r.status === "applied").length,
  }
}

export { getStorageBackend }
