import Link from "next/link"
import { popularRoutes } from "@/lib/data"
import { drivePath } from "@/lib/routes"
import { ArrowRight } from "lucide-react"

export function PopularRoutes() {
  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
          Popular Routes
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          Quick access to commonly searched driving requirements
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {popularRoutes.map((route) => (
            <Link
              key={`${route.origin}-${route.destination}`}
              href={drivePath(route.origin, route.destination)}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <span className="font-medium text-foreground">{route.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
