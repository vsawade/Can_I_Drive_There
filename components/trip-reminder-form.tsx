"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DrivingCheckResponse } from "@/lib/types"

interface TripReminderFormProps {
  result: DrivingCheckResponse
}

export function TripReminderForm({ result }: TripReminderFormProps) {
  const [email, setEmail] = useState("")
  const [tripDate, setTripDate] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/trip-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          originCountry: result.originCountry,
          destinationCountry: result.destinationCountry,
          tripDate,
          stayLength: result.stayLength,
          travelType: result.travelType,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus("error")
        setMessage(data.error || "Failed to save reminder")
        return
      }
      setStatus("success")
      setMessage(data.message)
      setEmail("")
      setTripDate("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Email me this checklist
        </CardTitle>
        <CardDescription>
          Get a reminder before your trip with a link back to this checklist
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <p className="text-sm text-success">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="reminder-email">Email</Label>
              <Input
                id="reminder-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="reminder-date">Trip start date</Label>
              <Input
                id="reminder-date"
                type="date"
                required
                min={minDateStr}
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Saving..." : "Send reminder"}
            </Button>
          </form>
        )}
        {status === "error" && <p className="mt-2 text-sm text-destructive">{message}</p>}
      </CardContent>
    </Card>
  )
}
