import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DrivingResultsClient } from "@/components/driving-results-client"
import { checkDrivingRequirements } from "@/lib/check-driving"
import { getCountryByCode, getUniqueRoutePairs } from "@/lib/data"
import { parseDriveSearchParams, toRouteSlug } from "@/lib/routes"

interface DrivePageProps {
  params: Promise<{ origin: string; destination: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export async function generateStaticParams() {
  return getUniqueRoutePairs().map(({ origin, destination }) => ({
    origin: toRouteSlug(origin),
    destination: toRouteSlug(destination),
  }))
}

export async function generateMetadata({ params }: DrivePageProps): Promise<Metadata> {
  const { origin, destination } = await params
  const originCode = origin.toUpperCase()
  const destCode = destination.toUpperCase()
  const originCountry = getCountryByCode(originCode)
  const destCountry = getCountryByCode(destCode)

  if (!originCountry || !destCountry) {
    return { title: "Driving Requirements" }
  }

  const title = `Driving in ${destCountry.name} with a ${originCountry.name} License`
  const description = `Can you drive in ${destCountry.name} with a ${originCountry.name} license? Check required documents, IDP rules, and official sources.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  }
}

export default async function DrivePage({ params, searchParams }: DrivePageProps) {
  const { origin, destination } = await params
  const resolvedSearchParams = await searchParams

  const originCode = origin.toUpperCase()
  const destCode = destination.toUpperCase()

  if (!getCountryByCode(originCode) || !getCountryByCode(destCode)) {
    notFound()
  }

  const { stayLength, travelType, originState, vehicleMode, driverAge, viewMode } =
    parseDriveSearchParams(resolvedSearchParams)

  const result = checkDrivingRequirements({
    originCountry: originCode,
    destinationCountry: destCode,
    travelType,
    stayLength,
    originState,
    vehicleMode,
    driverAge,
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Can I drive in ${result.destinationCountryName} with a ${result.originCountryName} license?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: result.ruleFound
            ? `Status: ${result.status}. Confidence: ${result.confidence}. ${result.documents.filter((d) => d.required).map((d) => d.type).join(", ")}.`
            : "We do not have verified data for this route. Check official sources before traveling.",
        },
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <DrivingResultsClient result={result} viewMode={viewMode} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
