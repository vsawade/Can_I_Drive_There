import { getCoverageStats } from "@/lib/data"
import { CheckCircle, Clock, Globe, Shield } from "lucide-react"

export function TrustSection() {
  const { uniquePairs, totalCountries, coveragePercent } = getCoverageStats()

  const features = [
    {
      icon: Globe,
      title: "Growing Coverage",
      description: `${uniquePairs} verified country pairs across ${totalCountries} countries (${coveragePercent}% of all combinations)`,
    },
    {
      icon: Shield,
      title: "Source-Backed",
      description: "Every verified route links to official government or embassy sources",
    },
    {
      icon: Clock,
      title: "Freshness Warnings",
      description: "We flag data older than 6 months so you know when to double-check",
    },
    {
      icon: CheckCircle,
      title: "No Guessing",
      description: "If we don't have data for a route, we say so — we won't invent a checklist",
    },
  ]

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">
          Why Use Can I Drive There?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-lg border border-border bg-card p-6 text-center"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
