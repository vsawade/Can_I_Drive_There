import { ImageResponse } from "next/og"
import { getCountryByCode } from "@/lib/data"

export const runtime = "edge"
export const alt = "Can I Drive There?"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface OgProps {
  params: Promise<{ origin: string; destination: string }>
}

export default async function OgImage({ params }: OgProps) {
  const { origin, destination } = await params
  const originCountry = getCountryByCode(origin.toUpperCase())
  const destCountry = getCountryByCode(destination.toUpperCase())

  const title = originCountry && destCountry
    ? `${originCountry.name} license → ${destCountry.name}`
    : "International Driving Requirements"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: 60,
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 16 }}>Can I Drive There?</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.2, maxWidth: 900 }}>{title}</div>
        <div style={{ fontSize: 24, marginTop: 24, opacity: 0.85 }}>
          Documents, IDP rules & official sources
        </div>
      </div>
    ),
    { ...size }
  )
}
