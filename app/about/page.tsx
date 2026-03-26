import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, FileCheck, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Can I Drive There? and how we help travelers understand international driving requirements.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground">About Can I Drive There?</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Making international driving requirements simple and accessible for everyone.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground">
                Navigating international driving requirements can be confusing and time-consuming. 
                Different countries have different rules about who can drive, what documents are 
                required, and how long foreign licenses are valid. Can I Drive There? aims to 
                simplify this process by providing clear, source-backed information in one place.
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Globe className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-semibold">Global Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Information for popular travel destinations worldwide
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <FileCheck className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-semibold">Clear Checklists</h3>
                  <p className="text-sm text-muted-foreground">
                    Easy-to-follow document requirements
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Users className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-1 font-semibold">For Travelers</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by travelers, for travelers
                  </p>
                </CardContent>
              </Card>
            </div>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">How It Works</h2>
              <ol className="list-inside list-decimal space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Select your license country</strong> - 
                  Tell us where your driving license was issued
                </li>
                <li>
                  <strong className="text-foreground">Choose your destination</strong> - 
                  Select the country you plan to drive in
                </li>
                <li>
                  <strong className="text-foreground">Specify your trip details</strong> - 
                  Let us know if it&apos;s for tourism or business, and how long you&apos;ll stay
                </li>
                <li>
                  <strong className="text-foreground">Get your results</strong> - 
                  Receive a clear checklist of required documents and important notes
                </li>
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Limitations</h2>
              <p className="mb-4 text-muted-foreground">
                While we strive to provide accurate and up-to-date information, there are some 
                important limitations to keep in mind:
              </p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Regulations change frequently and may not be immediately reflected here</li>
                <li>Individual circumstances may affect eligibility (age, experience, etc.)</li>
                <li>Some countries have complex regional variations not fully covered</li>
                <li>This is informational only - always verify with official authorities</li>
              </ul>
            </section>

            <section className="rounded-lg bg-primary/5 p-6">
              <h2 className="mb-2 text-xl font-semibold text-foreground">Ready to check?</h2>
              <p className="mb-4 text-muted-foreground">
                Find out what documents you need for your next international driving adventure.
              </p>
              <Button asChild>
                <Link href="/">
                  Check Requirements
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
