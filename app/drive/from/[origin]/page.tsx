import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { countries, drivingRules, getCountryByCode } from "@/lib/data"
import { drivePath, hubFromPath, toRouteSlug } from "@/lib/routes"

interface HubFromPageProps {
  params: Promise<{ origin: string }>
}

export async function generateStaticParams() {
  return countries.map((c) => ({ origin: toRouteSlug(c.code) }))
}

export async function generateMetadata({ params }: HubFromPageProps): Promise<Metadata> {
  const { origin } = await params
  const country = getCountryByCode(origin.toUpperCase())
  if (!country) return { title: "Driving From" }

  return {
    title: `Driving Abroad With a ${country.name} License`,
    description: `Browse verified driving requirements for ${country.name} license holders traveling internationally.`,
  }
}

export default async function HubFromPage({ params }: HubFromPageProps) {
  const { origin } = await params
  const originCode = origin.toUpperCase()
  const country = getCountryByCode(originCode)
  if (!country) notFound()

  const destinations = drivingRules
    .filter((r) => r.originCountry === originCode && r.travelType === "tourist")
    .reduce<{ code: string; name: string }[]>((acc, rule) => {
      if (acc.some((d) => d.code === rule.destinationCountry)) return acc
      const dest = getCountryByCode(rule.destinationCountry)
      if (dest) acc.push({ code: dest.code, name: dest.name })
      return acc
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-3xl font-bold">Driving abroad with a {country.name} license</h1>
          <p className="mb-8 text-muted-foreground">
            Verified routes for {country.name} license holders. Select a destination to see document requirements.
          </p>
          <div className="grid gap-3">
            {destinations.map((dest) => (
              <Link
                key={dest.code}
                href={drivePath(originCode, dest.code)}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50"
              >
                <span className="font-medium">Drive in {dest.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
          {destinations.length === 0 && (
            <p className="text-muted-foreground">No verified routes from {country.name} yet.</p>
          )}
          <div className="mt-8 text-sm text-muted-foreground">
            Also browse by{" "}
            <Link href={hubFromPath("US")} className="text-primary hover:underline">
              other license countries
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
