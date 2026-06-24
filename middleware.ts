import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_SESSION_COOKIE, getAdminApiKey } from "@/lib/admin-auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next()
  }

  const adminKey = getAdminApiKey()
  if (!adminKey) {
    return NextResponse.redirect(new URL("/admin/login?error=not-configured", request.url))
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (session !== adminKey) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
