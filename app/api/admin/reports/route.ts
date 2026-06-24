import { NextResponse } from "next/server"
import { isAdminRequestAuthorized } from "@/lib/admin-auth"
import { listReports, updateReportStatus } from "@/lib/storage"
import type { ReportStatus } from "@/lib/types"

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") as ReportStatus | null
  const reports = await listReports(status ?? undefined)
  return NextResponse.json({ reports })
}

export async function PATCH(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { id, status } = body as { id?: string; status?: ReportStatus }

  if (!id || !status || !["pending", "reviewed", "applied"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const updated = await updateReportStatus(id, status)
  if (!updated) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }

  return NextResponse.json({ report: updated })
}
