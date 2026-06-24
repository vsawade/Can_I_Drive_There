"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Smartphone, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResultCard } from "@/components/result-card"
import { InlineSearchForm } from "@/components/inline-search-form"
import { RentalDeskView } from "@/components/rental-desk-view"
import { useRouteAnalytics } from "@/hooks/use-analytics"
import { drivePath } from "@/lib/routes"
import type { DrivingCheckResponse } from "@/lib/types"

interface DrivingResultsClientProps {
  result: DrivingCheckResponse
  viewMode: "standard" | "desk"
}

export function DrivingResultsClient({ result, viewMode }: DrivingResultsClientProps) {
  const router = useRouter()
  useRouteAnalytics(result.originCountry, result.destinationCountry, result.ruleFound)

  const toggleDeskMode = () => {
    router.push(
      drivePath(result.originCountry, result.destinationCountry, {
        days: result.stayLength,
        type: result.travelType,
        state: result.originState,
        vehicle: result.vehicleMode,
        age: result.driverAge,
        view: viewMode === "desk" ? "standard" : "desk",
      })
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
        <Button variant="ghost" asChild className="-ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Check Another Destination
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={toggleDeskMode}>
          {viewMode === "desk" ? (
            <>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Standard view
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              Rental desk mode
            </>
          )}
        </Button>
      </div>

      <div className="mb-6 no-print">
        <InlineSearchForm
          originCountry={result.originCountry}
          destinationCountry={result.destinationCountry}
          travelType={result.travelType}
          stayLength={result.stayLength}
          originState={result.originState}
          vehicleMode={result.vehicleMode}
          driverAge={result.driverAge}
          compact
        />
      </div>

      {viewMode === "desk" ? (
        <RentalDeskView documents={result.documents} destinationName={result.destinationCountryName} />
      ) : (
        <ResultCard result={result} />
      )}
    </>
  )
}
