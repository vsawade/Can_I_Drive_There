import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AlertTriangle } from "lucide-react"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Legal disclaimer for Can I Drive There? - Important information about using our service.",
}

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Legal Disclaimer</h1>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">General Information Only</h2>
              <p>
                The information provided on Can I Drive There? (canidrivethere.com) is for general 
                informational purposes only. All information on the site is provided in good faith, 
                however, we make no representation or warranty of any kind, express or implied, 
                regarding the accuracy, adequacy, validity, reliability, availability, or completeness 
                of any information on the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Not Legal Advice</h2>
              <p>
                The information on this website does not constitute legal advice. You should not 
                rely on this information as a substitute for obtaining legal advice from a qualified 
                attorney or the relevant government authorities in your destination country.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Regulations Change</h2>
              <p>
                Driving regulations, document requirements, and international agreements can change 
                at any time without notice. While we make efforts to keep information updated, we 
                cannot guarantee that all information reflects the most current requirements. 
                Requirements may also vary based on individual circumstances including but not 
                limited to:
              </p>
              <ul className="list-disc pl-6">
                <li>Your age and driving experience</li>
                <li>The type of vehicle you intend to drive</li>
                <li>Whether you&apos;re renting a vehicle or bringing your own</li>
                <li>Your visa or immigration status</li>
                <li>Regional or local variations within a country</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Verify with Official Sources</h2>
              <p>
                Before traveling, you must verify all driving requirements with:
              </p>
              <ul className="list-disc pl-6">
                <li>The embassy or consulate of your destination country</li>
                <li>Official government transportation authorities</li>
                <li>Your insurance provider</li>
                <li>Your car rental company (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
              <p>
                Under no circumstances shall Can I Drive There?, its operators, or contributors be 
                liable for any direct, indirect, incidental, consequential, special, or exemplary 
                damages arising from your use of this website or reliance on any information 
                provided herein. This includes, but is not limited to:
              </p>
              <ul className="list-disc pl-6">
                <li>Fines or penalties incurred while driving abroad</li>
                <li>Denial of entry or driving privileges</li>
                <li>Vehicle impoundment</li>
                <li>Insurance claim denials</li>
                <li>Any other losses or damages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">External Links</h2>
              <p>
                This website may contain links to external websites that are not provided or 
                maintained by us. We do not guarantee the accuracy, relevance, timeliness, or 
                completeness of any information on these external websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">Your Responsibility</h2>
              <p>
                By using this website, you acknowledge that:
              </p>
              <ul className="list-disc pl-6">
                <li>You are solely responsible for verifying all driving requirements</li>
                <li>You will not hold us liable for any consequences of relying on this information</li>
                <li>You understand that this is informational content only</li>
                <li>You agree to comply with all local laws and regulations</li>
              </ul>
            </section>

            <section className="rounded-lg border border-border bg-muted/30 p-6">
              <h2 className="text-xl font-semibold text-foreground">Questions?</h2>
              <p>
                If you have questions about this disclaimer or the information on our site, please 
                refer to our <Link href="/sources" className="text-primary hover:underline">Sources</Link> page 
                for official authority links, or consult directly with the relevant government 
                authorities.
              </p>
            </section>

            <p className="text-sm">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
