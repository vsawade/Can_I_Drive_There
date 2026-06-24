import type { Metadata } from "next"
import Link from "next/link"
import { getCoverageStats } from "@/lib/data"
import { getAnalyticsSummary, getReportCounts, getStorageBackend } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Data Status",
  robots: { index: false, follow: false },
}

export default async function AdminDataStatusPage() {
  const coverage = getCoverageStats()
  const backend = getStorageBackend()

  let reportCounts = { pending: 0, reviewed: 0, applied: 0 }
  let analytics: Awaited<ReturnType<typeof getAnalyticsSummary>> | null = null

  try {
    reportCounts = await getReportCounts()
    analytics = await getAnalyticsSummary()
  } catch {
    // storage unavailable
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold">Can I Drive There? Admin</span>
          <div className="flex items-center gap-2">
            <Badge variant={backend === "supabase" ? "default" : "secondary"}>
              Storage: {backend}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/reports">Reports queue</Link>
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Data & analytics status</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Verified routes</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{coverage.verifiedRoutes}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Unique pairs</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{coverage.uniquePairs}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Coverage</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{coverage.coveragePercent}%</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Pending reports</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{reportCounts.pending}</CardContent>
          </Card>
        </div>

        {analytics && (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Top searched routes</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {analytics.topPairs.map(({ pair, count }) => (
                    <li key={pair} className="flex justify-between">
                      <span>{pair}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </li>
                  ))}
                  {analytics.topPairs.length === 0 && (
                    <li className="text-muted-foreground">No data yet</li>
                  )}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top missing routes</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {analytics.topMissing.map(({ pair, count }) => (
                    <li key={pair} className="flex justify-between">
                      <span>{pair}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </li>
                  ))}
                  {analytics.topMissing.length === 0 && (
                    <li className="text-muted-foreground">No data yet</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
