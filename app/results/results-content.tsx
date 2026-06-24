"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { drivePath } from "@/lib/routes"
import { Spinner } from "@/components/ui/spinner"

export function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")
  const type = searchParams.get("type") as "tourist" | "business" | null
  const days = searchParams.get("days")
  const state = searchParams.get("state")
  const vehicle = searchParams.get("vehicle") as "rental" | "own" | null
  const age = searchParams.get("age")

  useEffect(() => {
    if (origin && destination && type && days) {
      router.replace(
        drivePath(origin, destination, {
          days: parseInt(days, 10),
          type,
          state: state ?? undefined,
          vehicle: vehicle ?? undefined,
          age: age ? parseInt(age, 10) : undefined,
        })
      )
    }
  }, [origin, destination, type, days, state, vehicle, age, router])

  if (!origin || !destination || !type || !days) {
    router.replace("/")
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="mt-4 text-muted-foreground">Redirecting...</p>
    </div>
  )
}
