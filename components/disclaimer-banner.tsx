import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DisclaimerBannerProps {
  compact?: boolean
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>
          For informational purposes only.{" "}
          <Link href="/disclaimer" className="underline hover:text-foreground">
            Read full disclaimer
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Important Notice</h4>
          <p className="text-sm text-muted-foreground">
            The information provided on this website is for general informational purposes only. 
            Driving regulations change frequently and may vary based on individual circumstances. 
            Always verify requirements with official government authorities before traveling.
          </p>
          <Link
            href="/disclaimer"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            Read full disclaimer
          </Link>
        </div>
      </div>
    </div>
  )
}
