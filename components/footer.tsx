import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Can I Drive There? All rights reserved.
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/disclaimer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Disclaimer
            </Link>
            <Link
              href="/sources"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sources
            </Link>
            <Link
              href="/drive/from/us"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse routes
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          This site provides general information only. Always verify driving requirements 
          with official authorities before traveling.
        </p>
      </div>
    </footer>
  )
}
