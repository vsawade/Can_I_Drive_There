import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Sources",
  description: "Official sources and authorities for international driving requirements information.",
}

const sources = [
  {
    region: "United Kingdom",
    authorities: [
      {
        name: "UK Government - DVLA",
        url: "https://www.gov.uk/driving-in-the-uk",
        description: "Official UK driving regulations and foreign license information",
      },
      {
        name: "UK Foreign Office Travel Advice",
        url: "https://www.gov.uk/foreign-travel-advice",
        description: "Travel advisories including driving abroad guidance",
      },
    ],
  },
  {
    region: "European Union",
    authorities: [
      {
        name: "German Federal Ministry of Transport",
        url: "https://www.bmvi.de/",
        description: "German transportation and driving regulations",
      },
      {
        name: "French Government - Service-Public.fr",
        url: "https://www.service-public.fr/",
        description: "French administrative services including driving rules",
      },
      {
        name: "DGT - Spanish Traffic Authority",
        url: "https://www.dgt.es/",
        description: "Spain&apos;s official traffic and driving authority",
      },
      {
        name: "Italian Ministry of Transport",
        url: "https://www.mit.gov.it/",
        description: "Italian transportation regulations",
      },
    ],
  },
  {
    region: "North America",
    authorities: [
      {
        name: "US State Department",
        url: "https://travel.state.gov/",
        description: "US travel information and driving abroad guidance",
      },
      {
        name: "US Embassy in Mexico",
        url: "https://mx.usembassy.gov/",
        description: "Information for US citizens driving in Mexico",
      },
      {
        name: "US Customs and Border Protection",
        url: "https://www.cbp.gov/",
        description: "Border crossing and vehicle import regulations",
      },
    ],
  },
  {
    region: "Asia & Pacific",
    authorities: [
      {
        name: "Japan Automobile Federation (JAF)",
        url: "https://english.jaf.or.jp/",
        description: "Japanese driving regulations and IDP information",
      },
    ],
  },
  {
    region: "Middle East",
    authorities: [
      {
        name: "UAE Ministry of Interior",
        url: "https://www.moi.gov.ae/",
        description: "UAE driving and traffic regulations",
      },
    ],
  },
  {
    region: "International Organizations",
    authorities: [
      {
        name: "American Automobile Association (AAA)",
        url: "https://www.aaa.com/",
        description: "International Driving Permit issuer for US residents",
      },
      {
        name: "International Driving Permit - Geneva Convention (1949)",
        url: "https://www.unece.org/",
        description: "UN Convention on Road Traffic",
      },
    ],
  },
]

export default function SourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-foreground">Official Sources</h1>
            <p className="text-lg text-muted-foreground">
              We gather information from official government authorities and recognized 
              international organizations. Always verify requirements directly with these 
              sources before traveling.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">Important Note</h2>
                <p className="text-sm text-muted-foreground">
                  External links lead to official government and authority websites. We are not 
                  responsible for the content on external sites. Always verify you&apos;re on the 
                  official website before submitting any personal information.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {sources.map((group) => (
              <Card key={group.region}>
                <CardHeader>
                  <CardTitle>{group.region}</CardTitle>
                  <CardDescription>
                    Official authorities for {group.region.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {group.authorities.map((authority) => (
                      <li key={authority.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <a
                          href={authority.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-2"
                        >
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <span className="font-medium text-foreground group-hover:text-primary group-hover:underline">
                              {authority.name}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              {authority.description}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-lg bg-muted/30 p-6 text-center">
            <h2 className="mb-2 text-lg font-semibold text-foreground">Missing a Source?</h2>
            <p className="text-muted-foreground">
              If you know of an official source that should be included here, or if you notice 
              outdated information, please let us know so we can improve our database.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
