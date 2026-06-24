import Link from "next/link"
import {
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  Plane,
  Car,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequirementList } from "@/components/requirement-list"
import { DataQualityBanner } from "@/components/data-quality-banner"
import { ReportOutdatedForm } from "@/components/report-outdated-form"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { ConfidenceBadge } from "@/components/confidence-badge"
import { ChecklistActions } from "@/components/checklist-actions"
import { TripReminderForm } from "@/components/trip-reminder-form"
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

function QuickVerdict({ result }: { result: DrivingCheckResponse }) {
  if (!result.ruleFound) {
    return (
      <p className="text-center text-muted-foreground">
        We don&apos;t have verified data for this route yet. Check official sources before driving.
      </p>
    )
  }

  const vehicleLabel = result.vehicleMode === "rental" ? "renting a car" : "driving your own vehicle"

  const verdicts: Record<DrivingStatus, string> = {
    Allowed: `You can likely drive in ${result.destinationCountryName} with your ${result.originCountryName} license while ${vehicleLabel}, for stays up to ${result.maxStayDays} days.`,
    "Conditionally Allowed": `You may be able to drive in ${result.destinationCountryName}, but additional documents or conditions apply. Review both legal and rental checklists below.`,
    "Needs Verification": `Requirements for this trip need official confirmation. Use the checklists as a starting point only.`,
  }

  return <p className="text-center text-muted-foreground">{verdicts[result.status]}</p>
}

export function ResultCard({ result }: ResultCardProps) {
  const hasLegalRentalSplit =
    result.ruleFound &&
    JSON.stringify(result.legalDocuments) !== JSON.stringify(result.rentalDocuments)

  return (
    <div className="space-y-6">
      <DataQualityBanner result={result} />
      <ConfidenceBadge level={result.confidence} reason={result.confidenceReason} />

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Driving in {result.destinationCountryName} with a {result.originCountryName} license
          </CardTitle>
          <CardDescription className="mt-4 space-y-3">
            <StatusBadge status={result.status} />
            <QuickVerdict result={result} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Plane className="h-4 w-4" />
              <span className="capitalize">{result.travelType} travel</span>
            </div>
            <div className="flex items-center gap-1">
              {result.vehicleMode === "rental" ? <Car className="h-4 w-4" /> : <Car className="h-4 w-4" />}
              <span className="capitalize">{result.vehicleMode === "rental" ? "Rental car" : "Own vehicle"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{result.stayLength}-day stay</span>
            </div>
            {result.originStateName && (
              <span>License state: {result.originStateName}</span>
            )}
            {result.maxStayDays > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Standard rules cover up to {result.maxStayDays} days</span>
              </div>
            )}
            {result.lastUpdated && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Last verified: {result.lastUpdated}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ReportOutdatedForm
              originCountry={result.originCountry}
              destinationCountry={result.destinationCountry}
              travelType={result.travelType}
            />
            <ChecklistActions result={result} />
          </div>
        </CardContent>
      </Card>

      {result.documents.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Document Checklists</CardTitle>
            <CardDescription>
              {hasLegalRentalSplit
                ? "Legal requirements and what rental companies typically ask for can differ"
                : "Make sure you have these documents before your trip"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasLegalRentalSplit ? (
              <Tabs defaultValue={result.vehicleMode === "rental" ? "rental" : "legal"}>
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="legal">Legal minimum</TabsTrigger>
                  <TabsTrigger value="rental">Rental typical</TabsTrigger>
                </TabsList>
                <TabsContent value="legal">
                  <RequirementList documents={result.legalDocuments} />
                </TabsContent>
                <TabsContent value="rental">
                  <RequirementList documents={result.rentalDocuments} />
                </TabsContent>
              </Tabs>
            ) : (
              <RequirementList documents={result.documents} />
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Document Checklist</CardTitle>
            <CardDescription>No verified checklist available for this route</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We intentionally leave this blank rather than guess. Visit our{" "}
              <Link href="/sources" className="text-primary hover:underline">
                official sources page
              </Link>{" "}
              or contact the embassy for {result.destinationCountryName}.
            </p>
          </CardContent>
        </Card>
      )}

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

      {result.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Official Sources</CardTitle>
            <CardDescription>Always verify with these authorities before traveling</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.sources.map((source, index) => (
                <li key={index} className="rounded-lg border border-border p-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{source.authorityName}</span>
                  </a>
                  <p className="ml-6 mt-1 text-sm text-muted-foreground">
                    Source verified: {source.verifiedAt}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="no-print">
        <TripReminderForm result={result} />
      </div>

      <DisclaimerBanner />
    </div>
  )
}
