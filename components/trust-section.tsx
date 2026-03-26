import { CheckCircle, Clock, Globe, Shield } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Information for popular travel destinations worldwide",
  },
  {
    icon: Shield,
    title: "Source-Backed",
    description: "Data sourced from official government authorities",
  },
  {
    icon: Clock,
    title: "Regularly Updated",
    description: "Requirements reviewed and updated frequently",
  },
  {
    icon: CheckCircle,
    title: "Clear Checklists",
    description: "Easy-to-follow document requirements",
  },
]

export function TrustSection() {
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
