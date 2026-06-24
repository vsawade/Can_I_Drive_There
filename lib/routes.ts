export function toRouteSlug(code: string): string {
  return code.toLowerCase()
}

export function fromRouteSlug(slug: string): string {
  return slug.toUpperCase()
}

export interface DrivePathOptions {
  days?: number
  type?: "tourist" | "business"
  state?: string
  vehicle?: "rental" | "own"
  age?: number
  view?: "standard" | "desk"
}

export function drivePath(
  origin: string,
  destination: string,
  options?: DrivePathOptions
): string {
  const path = `/drive/${toRouteSlug(origin)}/${toRouteSlug(destination)}`
  if (!options) return path

  const params = new URLSearchParams()
  if (options.days !== undefined) params.set("days", String(options.days))
  if (options.type) params.set("type", options.type)
  if (options.state) params.set("state", options.state)
  if (options.vehicle) params.set("vehicle", options.vehicle)
  if (options.age !== undefined) params.set("age", String(options.age))
  if (options.view) params.set("view", options.view)

  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export function hubFromPath(origin: string): string {
  return `/drive/from/${toRouteSlug(origin)}`
}

export function hubInPath(destination: string): string {
  return `/drive/in/${toRouteSlug(destination)}`
}

export function parseDriveSearchParams(searchParams: Record<string, string | undefined>) {
  return {
    stayLength: Math.min(365, Math.max(1, parseInt(searchParams.days ?? "14", 10) || 14)),
    travelType: searchParams.type === "business" ? ("business" as const) : ("tourist" as const),
    originState: searchParams.state?.toUpperCase(),
    vehicleMode: searchParams.vehicle === "own" ? ("own" as const) : ("rental" as const),
    driverAge: searchParams.age ? parseInt(searchParams.age, 10) : undefined,
    viewMode: searchParams.view === "desk" ? ("desk" as const) : ("standard" as const),
  }
}
