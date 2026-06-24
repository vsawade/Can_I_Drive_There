import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, getAdminApiKey } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const adminKey = getAdminApiKey()
  if (!adminKey) {
    return NextResponse.json({ error: "Admin access is not configured" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { key } = body as { key?: string }

    if (!key || key !== adminKey) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_SESSION_COOKIE, adminKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
