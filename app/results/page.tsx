import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { ResultsContent } from "./results-content"
import { Spinner } from "@/components/ui/spinner"

export const metadata: Metadata = {
  title: "Driving Requirements Results",
  description: "View your international driving requirements and document checklist.",
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="mt-4 text-muted-foreground">Checking requirements...</p>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-2xl px-4">
          <Suspense fallback={<LoadingState />}>
            <ResultsContent />
          </Suspense>
          <div className="mt-8">
            <DisclaimerBanner compact />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
