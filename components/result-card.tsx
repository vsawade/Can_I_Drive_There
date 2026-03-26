import { CheckCircle, AlertTriangle, HelpCircle, ExternalLink, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RequirementList } from "@/components/requirement-list"
import type { DrivingCheckResponse, DrivingStatus } from "@/lib/types"

interface ResultCardProps {
  result: DrivingCheckResponse
}

function StatusBadge({ status }: { status: DrivingStatus }) {
  const config = {
    Allowed: {
      icon: CheckCircle,
      bg: "bg-success/20",
      text: "text-success",
      label: "Allowed to Drive",
    },
    "Conditionally Allowed": {
      icon: AlertTriangle,
      bg: "bg-warning/20",
      text: "text-warning-foreground",
      label: "Conditionally Allowed",
    },
    "Needs Verification": {
      icon: HelpCircle,
      bg: "bg-muted",
      text: "text-muted-foreground",
      label: "Verification Required",
    },
  }

  const { icon: Icon, bg, text, label } = config[status]

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${bg}`}>
      <Icon className={`h-5 w-5 ${text}`} />
      <span className={`font-semibold ${text}`}>{label}</span>
    </div>
  )
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Driving from {result.originCountryName} to {result.destinationCountryName}
          </CardTitle>
          <CardDescription className="mt-4">
            <StatusBadge status={result.status} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {result.maxStayDays > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Valid for up to {result.maxStayDays} days</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {result.lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Card */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Make sure you have these documents before your trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequirementList documents={result.documents} />
        </CardContent>
      </Card>

      {/* Notes Card */}
      {result.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sources Card */}
      {result.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Official Sources</CardTitle>
            <CardDescription>
              Verify this information with official authorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{source.authorityName}</span>
                  </a>
                  <p className="ml-6 text-sm text-muted-foreground">
                    Verified: {source.verifiedAt}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
