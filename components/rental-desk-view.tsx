"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { RequiredDocument } from "@/lib/types"

interface RentalDeskViewProps {
  documents: RequiredDocument[]
  destinationName: string
}

export function RentalDeskView({ documents, destinationName }: RentalDeskViewProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const required = documents.filter((d) => d.required)

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-card p-4 md:p-6">
      <h2 className="mb-1 text-xl font-bold">Rental desk checklist</h2>
      <p className="mb-6 text-sm text-muted-foreground">{destinationName} — tap each item as you verify it</p>
      <ul className="space-y-3">
        {required.map((doc, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => setChecked((prev) => ({ ...prev, [index]: !prev[index] }))}
              className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                checked[index]
                  ? "border-success bg-success/10"
                  : "border-border bg-background active:bg-muted"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  checked[index] ? "border-success bg-success text-white" : "border-muted-foreground"
                }`}
              >
                {checked[index] && <Check className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">{doc.type}</p>
                {doc.notes && <p className="mt-1 text-sm text-muted-foreground">{doc.notes}</p>}
                {doc.ifMissing && (
                  <p className="mt-2 text-sm font-medium text-destructive">If missing: {doc.ifMissing}</p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {required.length === 0 && (
        <p className="text-muted-foreground">No verified checklist available for this route.</p>
      )}
    </div>
  )
}
