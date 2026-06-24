"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface ReportOutdatedFormProps {
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
}

export function ReportOutdatedForm({
  originCountry,
  destinationCountry,
  travelType,
}: ReportOutdatedFormProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/report-outdated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCountry,
          destinationCountry,
          travelType,
          message,
          sourceUrl: sourceUrl || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMessage(data.error || "Failed to submit report")
        return
      }

      setStatus("success")
      setMessage("")
      setSourceUrl("")
    } catch {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="mr-2 h-4 w-4" />
          Report outdated info
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report outdated information</DialogTitle>
          <DialogDescription>
            Help us keep requirements accurate. Tell us what changed and share an official
            source if you have one.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="rounded-lg bg-success/10 p-4 text-sm text-success">
            Thank you. Your report has been received and will be reviewed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-message">What is outdated or incorrect?</Label>
              <Textarea
                id="report-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., Italy now requires an IDP for all US license holders..."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-source">Official source URL (optional)</Label>
              <Input
                id="report-source"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Submitting..." : "Submit report"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
