import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DrivingForm } from "@/components/driving-form"
import { TrustSection } from "@/components/trust-section"
import { PopularRoutes } from "@/components/popular-routes"
import { DisclaimerBanner } from "@/components/disclaimer-banner"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Can I Drive There?
              </h1>
              <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                Planning to drive abroad? Check what documents and permits you need 
                to legally drive in your destination country.
              </p>
              <DrivingForm />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <TrustSection />

        {/* Popular Routes */}
        <PopularRoutes />

        {/* Disclaimer Section */}
        <section className="py-8">
          <div className="mx-auto max-w-2xl px-4">
            <DisclaimerBanner />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
