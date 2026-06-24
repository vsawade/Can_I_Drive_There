import Link from "next/link"
import { MapPinOff } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <MapPinOff className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Route not found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t find that country or driving route. Check the country codes in the
            URL, or search from the homepage.
          </p>
          <Button asChild>
            <Link href="/">Check driving requirements</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
