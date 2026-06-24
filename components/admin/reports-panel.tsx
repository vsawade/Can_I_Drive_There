"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCountryByCode } from "@/lib/countries"
import { drivePath } from "@/lib/routes"
import type { ReportStatus, StoredReport } from "@/lib/types"

const statusLabels: Record<ReportStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  applied: "Applied",
}

const statusVariant: Record<ReportStatus, "default" | "secondary" | "outline"> = {
  pending: "default",
  reviewed: "secondary",
  applied: "outline",
}

export function ReportsPanel() {
  const [reports, setReports] = useState<StoredReport[]>([])
  const [filter, setFilter] = useState<ReportStatus | "all">("pending")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const query = filter === "all" ? "" : `?status=${filter}`
      const res = await fetch(`/api/admin/reports${query}`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to load reports")
      const data = await res.json()
      setReports(data.reports)
    } catch {
      setError("Could not load reports")
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const updateStatus = async (id: string, status: ReportStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error("Update failed")
      await loadReports()
    } catch {
      setError("Failed to update report status")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Outdated report queue</h1>
          <p className="text-muted-foreground">Review user-submitted corrections and update route data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadReports} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as ReportStatus | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/data-status">Data status →</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Loading reports...</p>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No reports in this queue.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const origin = getCountryByCode(report.originCountry)
            const destination = getCountryByCode(report.destinationCountry)

            return (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">
                        {origin?.name ?? report.originCountry} →{" "}
                        {destination?.name ?? report.destinationCountry}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {report.travelType} · reported {new Date(report.reportedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={statusVariant[report.status]}>{statusLabels[report.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm">{report.message}</p>
                  {report.sourceUrl && (
                    <a
                      href={report.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Official source provided
                    </a>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={report.status}
                      onValueChange={(value) => updateStatus(report.id, value as ReportStatus)}
                      disabled={updatingId === report.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={drivePath(report.originCountry, report.destinationCountry, {
                          type: report.travelType as "tourist" | "business",
                        })}
                        target="_blank"
                      >
                        View route
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
