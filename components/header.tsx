import Link from "next/link"
import { Car } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Can I Drive There?
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/sources"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sources
          </Link>
          <Link
            href="/disclaimer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  )
}
