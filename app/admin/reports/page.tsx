import type { Metadata } from "next"
import { ReportsPanel } from "@/components/admin/reports-panel"
import { getStorageBackend } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Admin Reports",
  robots: { index: false, follow: false },
}

export default function AdminReportsPage() {
  const backend = getStorageBackend()

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold">Can I Drive There? Admin</span>
          <Badge variant={backend === "supabase" ? "default" : "secondary"}>
            Storage: {backend}
          </Badge>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <ReportsPanel />
      </main>
    </div>
  )
}
