import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { countries, drivingRules, getCountryByCode } from "@/lib/data"
import { drivePath, hubInPath, toRouteSlug } from "@/lib/routes"

interface HubInPageProps {
  params: Promise<{ destination: string }>
}

export async function generateStaticParams() {
  return countries.map((c) => ({ destination: toRouteSlug(c.code) }))
}

export async function generateMetadata({ params }: HubInPageProps): Promise<Metadata> {
  const { destination } = await params
  const country = getCountryByCode(destination.toUpperCase())
  if (!country) return { title: "Driving In" }

  return {
    title: `Driving in ${country.name} With a Foreign License`,
    description: `See which foreign licenses are covered for driving in ${country.name} and what documents you need.`,
  }
}

export default async function HubInPage({ params }: HubInPageProps) {
  const { destination } = await params
  const destCode = destination.toUpperCase()
  const country = getCountryByCode(destCode)
  if (!country) notFound()

  const origins = drivingRules
    .filter((r) => r.destinationCountry === destCode && r.travelType === "tourist")
    .reduce<{ code: string; name: string }[]>((acc, rule) => {
      if (acc.some((d) => d.code === rule.originCountry)) return acc
      const origin = getCountryByCode(rule.originCountry)
      if (origin) acc.push({ code: origin.code, name: origin.name })
      return acc
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-3xl font-bold">Driving in {country.name} with a foreign license</h1>
          <p className="mb-8 text-muted-foreground">
            Select your license country to see verified requirements for driving in {country.name}.
          </p>
          <div className="grid gap-3">
            {origins.map((origin) => (
              <Link
                key={origin.code}
                href={drivePath(origin.code, destCode)}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50"
              >
                <span className="font-medium">{origin.name} license in {country.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
          {origins.length === 0 && (
            <p className="text-muted-foreground">No verified routes for {country.name} yet.</p>
          )}
          <div className="mt-8 text-sm text-muted-foreground">
            Browse all destinations in{" "}
            <Link href={hubInPath("JP")} className="text-primary hover:underline">
              other countries
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
