import { Shield, ShieldAlert, ShieldQuestion, ShieldX } from "lucide-react"
import type { ConfidenceLevel } from "@/lib/types"

const config: Record<
  ConfidenceLevel,
  { icon: typeof Shield; label: string; className: string }
> = {
  high: {
    icon: Shield,
    label: "High confidence",
    className: "bg-success/15 text-success border-success/30",
  },
  medium: {
    icon: ShieldAlert,
    label: "Medium confidence",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
  },
  low: {
    icon: ShieldQuestion,
    label: "Low confidence",
    className: "bg-muted text-muted-foreground border-border",
  },
  none: {
    icon: ShieldX,
    label: "No verified data",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

interface ConfidenceBadgeProps {
  level: ConfidenceLevel
  reason: string
}

export function ConfidenceBadge({ level, reason }: ConfidenceBadgeProps) {
  const { icon: Icon, label, className } = config[level]

  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <div className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm opacity-90">{reason}</p>
    </div>
  )
}
