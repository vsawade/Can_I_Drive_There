import Link from "next/link"
import { AlertTriangle, Database, Info } from "lucide-react"
import { drivePath } from "@/lib/routes"
import type { DrivingCheckResponse } from "@/lib/types"

interface DataQualityBannerProps {
  result: DrivingCheckResponse
}

export function DataQualityBanner({ result }: DataQualityBannerProps) {
  if (result.dataQuality === "unverified") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex gap-3">
          <Database className="h-5 w-5 shrink-0 text-destructive" />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">No verified data for this route</h4>
            <p className="text-sm text-muted-foreground">
              We do not have source-backed requirements for driving from{" "}
              {result.originCountryName} to {result.destinationCountryName}. We will not show a
              guessed checklist — always verify with official authorities.
            </p>
            <Link href="/sources" className="text-sm font-medium text-primary hover:underline">
              Browse official sources →
            </Link>
            {result.relatedRoutes.length > 0 && (
              <div className="pt-1">
                <p className="text-sm text-muted-foreground">Similar routes we do cover:</p>
                <ul className="mt-1 space-y-1">
                  {result.relatedRoutes.map((route) => (
                    <li key={`${route.origin}-${route.destination}`}>
                      <Link
                        href={drivePath(route.origin, route.destination)}
                        className="text-sm text-primary hover:underline"
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (result.dataQuality === "fallback_tourist") {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 shrink-0 text-warning-foreground" />
          <p className="text-sm text-muted-foreground">
            Business-travel rules are not available for this route. Showing tourist requirements as
            a starting point — confirm business driving with official authorities.
          </p>
        </div>
      </div>
    )
  }

  if (result.dataQuality === "stay_exceeded") {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
          <p className="text-sm text-muted-foreground">
            Your {result.stayLength}-day stay may exceed standard visitor limits. Additional
            permits or local licensing may be required.
          </p>
        </div>
      </div>
    )
  }

  if (result.isStale && result.lastUpdated) {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
          <p className="text-sm text-muted-foreground">
            Last verified on {result.lastUpdated}. Regulations may have changed — confirm with
            official sources before traveling.
          </p>
        </div>
      </div>
    )
  }

  return null
}
