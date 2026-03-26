"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ResultCard } from "@/components/result-card"
import { Spinner } from "@/components/ui/spinner"
import type { DrivingCheckResponse } from "@/lib/types"

const fetcher = async (url: string, body: object) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export function ResultsContent() {
  const searchParams = useSearchParams()
  
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const type = searchParams.get("type") as "tourist" | "business" | null
  const days = searchParams.get("days")

  const isValid = origin && destination && type && days

  const { data, error, isLoading } = useSWR<DrivingCheckResponse>(
    isValid ? ["/api/check-driving", { originCountry: origin, destinationCountry: destination, travelType: type, stayLength: parseInt(days) }] : null,
    ([url, body]) => fetcher(url, body)
  )

  if (!isValid) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Missing Information</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Please go back and fill out all the required fields.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="mt-4 text-muted-foreground">Checking requirements...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Something Went Wrong</h2>
          <p className="mt-2 text-center text-muted-foreground">
            We couldn&apos;t retrieve the driving requirements. Please try again.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Check Another Destination
        </Link>
      </Button>
      <ResultCard result={data} />
    </div>
  )
}
