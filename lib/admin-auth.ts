import { cookies } from "next/headers"

export const ADMIN_SESSION_COOKIE = "admin_session"

export function getAdminApiKey(): string | undefined {
  return process.env.ADMIN_API_KEY
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminKey = getAdminApiKey()
  if (!adminKey) return false

  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === adminKey
}

export function isAdminRequestAuthorized(request: Request): boolean {
  const adminKey = getAdminApiKey()
  if (!adminKey) return false

  if (request.headers.get("x-admin-key") === adminKey) {
    return true
  }

  const cookieHeader = request.headers.get("cookie") ?? ""
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))

  if (!match) return false
  const value = match.slice(ADMIN_SESSION_COOKIE.length + 1)
  return value === adminKey
}

export async function requireAdmin(): Promise<void> {
  const authed = await isAdminAuthenticated()
  if (!authed) {
    const { redirect } = await import("next/navigation")
    redirect("/admin/login")
  }
}
