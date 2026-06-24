import type { MetadataRoute } from "next"
import { countries, getUniqueRoutePairs } from "@/lib/data"
import { hubFromPath, hubInPath, toRouteSlug } from "@/lib/routes"

const BASE_URL = "https://canidrivethere.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/sources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  const routePages: MetadataRoute.Sitemap = getUniqueRoutePairs().map(({ origin, destination }) => ({
    url: `${BASE_URL}/drive/${toRouteSlug(origin)}/${toRouteSlug(destination)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const hubPages: MetadataRoute.Sitemap = countries.flatMap((c) => [
    {
      url: `${BASE_URL}${hubFromPath(c.code)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}${hubInPath(c.code)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ])

  return [...staticPages, ...routePages, ...hubPages]
}
