"use client"

import { useState } from "react"
import { Copy, Printer, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/hooks/use-analytics"
import type { DrivingCheckResponse } from "@/lib/types"

interface ChecklistActionsProps {
  result: DrivingCheckResponse
}

function buildChecklistText(result: DrivingCheckResponse): string {
  const lines = [
    `Can I Drive There? — Checklist`,
    `${result.originCountryName} → ${result.destinationCountryName}`,
    `Status: ${result.status} | Confidence: ${result.confidence}`,
    "",
    "Documents:",
    ...result.documents.map(
      (d) => `- [${d.required ? "x" : " "}] ${d.type}${d.notes ? ` (${d.notes})` : ""}`
    ),
    "",
    "Notes:",
    ...result.notes.map((n) => `- ${n}`),
    "",
    "Always verify with official sources before traveling.",
  ]
  return lines.join("\n")
}

export function ChecklistActions({ result }: ChecklistActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildChecklistText(result))
    setCopied(true)
    trackEvent({ event: "share_checklist", originCountry: result.originCountry, destinationCountry: result.destinationCountry })
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: `Driving in ${result.destinationCountryName}`,
        text: buildChecklistText(result),
        url,
      })
      trackEvent({ event: "share_checklist", originCountry: result.originCountry, destinationCountry: result.destinationCountry })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="flex flex-wrap gap-2 no-print">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? "Copied" : "Copy checklist"}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  )
}
