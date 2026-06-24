import { Check, X, Info, AlertTriangle } from "lucide-react"
import type { RequiredDocument } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RequirementListProps {
  documents: RequiredDocument[]
  showConsequences?: boolean
}

export function RequirementList({ documents, showConsequences = true }: RequirementListProps) {
  return (
    <TooltipProvider>
      <ul className="space-y-3">
        {documents.map((doc, index) => (
          <li
            key={index}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                doc.required
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {doc.required ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`font-medium ${
                    doc.required ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {doc.type}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    doc.required
                      ? "bg-success/20 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {doc.required ? "Required" : "Optional"}
                </span>
                {doc.notes && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{doc.notes}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {doc.notes && (
                <p className="mt-1 text-sm text-muted-foreground">{doc.notes}</p>
              )}
              {showConsequences && doc.ifMissing && (
                <div className="mt-2 flex items-start gap-2 rounded-md bg-destructive/5 px-2 py-1.5 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>If missing: {doc.ifMissing}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </TooltipProvider>
  )
}
