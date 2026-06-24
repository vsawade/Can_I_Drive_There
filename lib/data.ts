import type { Country, DrivingRule, StateOverride } from "./types"
import countriesData from "@/data/countries.json"
import stateOverridesData from "@/data/state-overrides.json"
import { normalizeRule, getRuleKey } from "./rule-loader"

export const countries: Country[] = countriesData
export const stateOverrides: StateOverride[] = stateOverridesData

const rawDrivingRules: DrivingRule[] = [
  // US to various countries
  {
    originCountry: "US",
    destinationCountry: "GB",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended but not required for US license holders" },
      { type: "Proof of Insurance", required: true, notes: "Usually included with rental cars" },
    ],
    notes: [
      "Drive on the left side of the road",
      "Speed limits are in miles per hour",
      "Valid for up to 12 months from arrival",
    ],
    sources: [
      { authorityName: "UK Government - DVLA", url: "https://www.gov.uk/driving-in-the-uk", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "US",
    destinationCountry: "DE",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Required for stays over 6 months" },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "No speed limit on certain Autobahn sections",
      "Strict blood alcohol limit of 0.05%",
      "Winter tires required in winter conditions",
    ],
    sources: [
      { authorityName: "German Federal Ministry of Transport", url: "https://www.bmvi.de/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "US",
    destinationCountry: "JP",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Must be issued under 1949 Geneva Convention" },
      { type: "Japanese Translation of License", required: false, notes: "Alternative to IDP if license is from certain countries" },
    ],
    notes: [
      "Drive on the left side of the road",
      "IDP valid for up to 1 year",
      "Strict traffic laws with heavy penalties",
      "Parking regulations strictly enforced",
    ],
    sources: [
      { authorityName: "Japan Automobile Federation (JAF)", url: "https://english.jaf.or.jp/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "US",
    destinationCountry: "MX",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport or Passport Card", required: true },
      { type: "Mexican Auto Insurance", required: true, notes: "US insurance is NOT valid in Mexico" },
      { type: "Vehicle Registration", required: true, notes: "If driving your own vehicle" },
      { type: "Temporary Vehicle Import Permit", required: true, notes: "Required if traveling beyond border zone" },
    ],
    notes: [
      "Mexican auto insurance is mandatory",
      "Border zone driving may have different requirements",
      "Toll roads (cuotas) are common",
    ],
    sources: [
      { authorityName: "US Embassy in Mexico", url: "https://mx.usembassy.gov/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // UK to various countries
  {
    originCountry: "GB",
    destinationCountry: "FR",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid UK Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Required since Brexit for stays over 90 days" },
      { type: "GB Sticker", required: true, notes: "UK registration plates must display GB identifier" },
      { type: "Warning Triangle", required: true },
      { type: "Reflective Vest", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "Headlight beam deflectors may be needed",
      "Crit'Air sticker required for some cities",
    ],
    sources: [
      { authorityName: "French Government - Service-Public.fr", url: "https://www.service-public.fr/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "GB",
    destinationCountry: "ES",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Allowed",
    documents: [
      { type: "Valid UK Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended but not required for short stays" },
      { type: "V5C Vehicle Registration", required: true, notes: "If driving your own vehicle" },
      { type: "Warning Triangles (2)", required: true },
      { type: "Reflective Vest", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "Minimum driving age is 18",
      "Some cities have low emission zones",
    ],
    sources: [
      { authorityName: "DGT - Spanish Traffic Authority", url: "https://www.dgt.es/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // Germany to other countries
  {
    originCountry: "DE",
    destinationCountry: "IT",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid German Driver's License", required: true },
      { type: "ID Card or Passport", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Green Card Insurance", required: false, notes: "Recommended for proof of insurance" },
    ],
    notes: [
      "EU license fully valid",
      "ZTL zones in city centers require permits",
      "Highway tolls apply",
    ],
    sources: [
      { authorityName: "Italian Ministry of Transport", url: "https://www.mit.gov.it/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // Australia to other countries
  {
    originCountry: "AU",
    destinationCountry: "US",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid Australian Driver's License", required: true },
      { type: "Passport with ESTA or Visa", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended, required in some states" },
    ],
    notes: [
      "Drive on the right side of the road",
      "Requirements vary by state",
      "Some states require IDP alongside license",
    ],
    sources: [
      { authorityName: "US State Department", url: "https://travel.state.gov/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "AU",
    destinationCountry: "JP",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid Australian Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Must be 1949 Geneva Convention format" },
    ],
    notes: [
      "Both countries drive on the left",
      "IDP valid for up to 1 year",
      "Japan has strict parking regulations",
    ],
    sources: [
      { authorityName: "Japan Automobile Federation (JAF)", url: "https://english.jaf.or.jp/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // Canada to US (common route)
  {
    originCountry: "CA",
    destinationCountry: "US",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Allowed",
    documents: [
      { type: "Valid Canadian Driver's License", required: true },
      { type: "Passport or NEXUS Card", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Canadian Insurance Card", required: true, notes: "Check coverage extends to US" },
    ],
    notes: [
      "Both countries drive on the right",
      "Check your insurance covers US driving",
      "Some states have specific requirements",
    ],
    sources: [
      { authorityName: "US Customs and Border Protection", url: "https://www.cbp.gov/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // UAE example
  {
    originCountry: "US",
    destinationCountry: "AE",
    travelType: "tourist",
    maxStayDays: 30,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport with Valid Visa", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "US license accepted for tourists" },
    ],
    notes: [
      "Drive on the right side of the road",
      "Salik (toll) system in Dubai",
      "Zero tolerance for alcohol while driving",
      "Rental cars typically include basic insurance",
    ],
    sources: [
      { authorityName: "UAE Ministry of Interior", url: "https://www.moi.gov.ae/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // Business travel example
  {
    originCountry: "US",
    destinationCountry: "DE",
    travelType: "business",
    maxStayDays: 90,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended for business use" },
      { type: "Business Visa or ETIAS", required: true, notes: "Verify visa requirements for business activities" },
    ],
    notes: [
      "Short-term business visitors can use US license",
      "Company car arrangements may have additional requirements",
      "Verify rental policies for business use",
    ],
    sources: [
      { authorityName: "German Embassy", url: "https://www.germany.info/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  // High-traffic routes
  {
    originCountry: "US",
    destinationCountry: "FR",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended; some rental agencies request it" },
      { type: "Proof of Insurance", required: true },
      { type: "Warning Triangle", required: true },
      { type: "Reflective Vest", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "Crit'Air emissions sticker required in some cities",
      "Blood alcohol limit is 0.05%",
    ],
    sources: [
      { authorityName: "French Government - Service-Public.fr", url: "https://www.service-public.fr/", verifiedAt: "2025-11-01" },
    ],
    lastUpdated: "2025-11-01",
  },
  {
    originCountry: "US",
    destinationCountry: "IT",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Required alongside US license" },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "ZTL (limited traffic zones) in historic city centers require permits",
      "Toll roads (autostrade) are common",
      "Headlights must be on in tunnels",
    ],
    sources: [
      { authorityName: "Italian Ministry of Transport", url: "https://www.mit.gov.it/", verifiedAt: "2025-10-15" },
    ],
    lastUpdated: "2025-10-15",
  },
  {
    originCountry: "US",
    destinationCountry: "ES",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended for rentals" },
      { type: "Proof of Insurance", required: true },
      { type: "Warning Triangles (2)", required: true },
      { type: "Reflective Vest", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "Some cities have low-emission zones",
      "Minimum driving age is 18",
    ],
    sources: [
      { authorityName: "DGT - Spanish Traffic Authority", url: "https://www.dgt.es/", verifiedAt: "2025-10-20" },
    ],
    lastUpdated: "2025-10-20",
  },
  {
    originCountry: "US",
    destinationCountry: "CA",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport or Enhanced ID", required: true },
      { type: "Vehicle Registration", required: true, notes: "If driving your own vehicle" },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "Both countries drive on the right",
      "Check that your US insurance covers Canada",
      "Winter tire requirements in some provinces",
    ],
    sources: [
      { authorityName: "Government of Canada - Travel", url: "https://travel.gc.ca/", verifiedAt: "2025-09-01" },
    ],
    lastUpdated: "2025-09-01",
  },
  {
    originCountry: "US",
    destinationCountry: "AU",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport with ETA", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended; required in some states" },
    ],
    notes: [
      "Drive on the left side of the road",
      "Rules vary by Australian state and territory",
      "Some states require IDP in addition to US license",
    ],
    sources: [
      { authorityName: "Australian Government - Smartraveller", url: "https://www.smartraveller.gov.au/", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "US",
    destinationCountry: "BR",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid US Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Required alongside US license" },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "IDP must be obtained before entering Brazil",
      "Road conditions vary significantly by region",
    ],
    sources: [
      { authorityName: "US Embassy in Brazil", url: "https://br.usembassy.gov/", verifiedAt: "2025-09-15" },
    ],
    lastUpdated: "2025-09-15",
  },
  {
    originCountry: "GB",
    destinationCountry: "DE",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid UK Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true, notes: "Required for UK license holders since Brexit" },
      { type: "GB Sticker", required: true },
      { type: "Warning Triangle", required: true },
      { type: "First Aid Kit", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "Environmental zones (Umweltzone) require stickers in some cities",
      "Winter tires mandatory in winter conditions",
    ],
    sources: [
      { authorityName: "German Federal Ministry of Transport", url: "https://www.bmvi.de/", verifiedAt: "2025-10-05" },
    ],
    lastUpdated: "2025-10-05",
  },
  {
    originCountry: "GB",
    destinationCountry: "IT",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid UK Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: true },
      { type: "GB Sticker", required: true },
    ],
    notes: [
      "Drive on the right side of the road",
      "ZTL zones in city centers require permits",
      "IDP required for UK license holders",
    ],
    sources: [
      { authorityName: "Italian Ministry of Transport", url: "https://www.mit.gov.it/", verifiedAt: "2025-10-05" },
    ],
    lastUpdated: "2025-10-05",
  },
  {
    originCountry: "GB",
    destinationCountry: "US",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid UK Driver's License", required: true },
      { type: "Passport with ESTA or Visa", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended; required in some US states" },
    ],
    notes: [
      "Drive on the right side of the road",
      "Requirements vary by US state",
      "Some states require IDP alongside foreign license",
    ],
    sources: [
      { authorityName: "US State Department", url: "https://travel.state.gov/", verifiedAt: "2025-09-20" },
    ],
    lastUpdated: "2025-09-20",
  },
  {
    originCountry: "CA",
    destinationCountry: "GB",
    travelType: "tourist",
    maxStayDays: 90,
    status: "Conditionally Allowed",
    documents: [
      { type: "Valid Canadian Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Recommended for rentals" },
    ],
    notes: [
      "Drive on the left side of the road",
      "Valid for up to 12 months as a visitor",
      "Insurance required for any vehicle you drive",
    ],
    sources: [
      { authorityName: "UK Government - DVLA", url: "https://www.gov.uk/driving-in-the-uk", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "CA",
    destinationCountry: "MX",
    travelType: "tourist",
    maxStayDays: 180,
    status: "Allowed",
    documents: [
      { type: "Valid Canadian Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "Mexican Auto Insurance", required: true, notes: "Canadian insurance is NOT valid in Mexico" },
      { type: "Temporary Vehicle Import Permit", required: true, notes: "Required beyond the border zone" },
    ],
    notes: [
      "Mexican auto insurance is mandatory",
      "Temporary import permit needed for most destinations",
      "Toll roads (cuotas) are common",
    ],
    sources: [
      { authorityName: "Government of Canada - Travel", url: "https://travel.gc.ca/", verifiedAt: "2025-09-10" },
    ],
    lastUpdated: "2025-09-10",
  },
  {
    originCountry: "DE",
    destinationCountry: "FR",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid German Driver's License", required: true },
      { type: "ID Card or Passport", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Proof of Insurance", required: true },
      { type: "Warning Triangle", required: true },
      { type: "Reflective Vest", required: true },
    ],
    notes: [
      "EU license fully valid within Schengen",
      "Crit'Air sticker required in some French cities",
      "Headlight beam deflectors may be needed",
    ],
    sources: [
      { authorityName: "French Government - Service-Public.fr", url: "https://www.service-public.fr/", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "DE",
    destinationCountry: "ES",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid German Driver's License", required: true },
      { type: "ID Card or Passport", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "EU license fully valid",
      "Some Spanish cities have low-emission zones",
      "Toll roads on major highways",
    ],
    sources: [
      { authorityName: "DGT - Spanish Traffic Authority", url: "https://www.dgt.es/", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "FR",
    destinationCountry: "DE",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid French Driver's License", required: true },
      { type: "ID Card or Passport", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Proof of Insurance", required: true },
      { type: "Warning Triangle", required: true },
    ],
    notes: [
      "EU license fully valid",
      "Environmental zones in German cities may require stickers",
      "No general speed limit on some Autobahn sections",
    ],
    sources: [
      { authorityName: "German Federal Ministry of Transport", url: "https://www.bmvi.de/", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "AU",
    destinationCountry: "GB",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid Australian Driver's License", required: true },
      { type: "Passport", required: true },
      { type: "International Driving Permit (IDP)", required: false, notes: "Not required but recommended" },
    ],
    notes: [
      "Both countries drive on the left",
      "Valid for up to 12 months from arrival",
      "Insurance required for any vehicle",
    ],
    sources: [
      { authorityName: "UK Government - DVLA", url: "https://www.gov.uk/driving-in-the-uk", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
  {
    originCountry: "IT",
    destinationCountry: "FR",
    travelType: "tourist",
    maxStayDays: 365,
    status: "Allowed",
    documents: [
      { type: "Valid Italian Driver's License", required: true },
      { type: "ID Card or Passport", required: true },
      { type: "Vehicle Registration", required: true },
      { type: "Proof of Insurance", required: true },
    ],
    notes: [
      "EU license fully valid",
      "Crit'Air sticker may be required in some cities",
      "Toll roads (péage) are common",
    ],
    sources: [
      { authorityName: "French Government - Service-Public.fr", url: "https://www.service-public.fr/", verifiedAt: "2025-10-01" },
    ],
    lastUpdated: "2025-10-01",
  },
]

export const drivingRules: DrivingRule[] = rawDrivingRules.map(normalizeRule)

export function getStateOverrideForRule(rule: DrivingRule): StateOverride | undefined {
  const key = getRuleKey(rule)
  return stateOverrides.find((o) => o.ruleKey === key)
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code)
}

export function findDrivingRule(
  originCountry: string,
  destinationCountry: string,
  travelType: "tourist" | "business"
): DrivingRule | undefined {
  return drivingRules.find(
    (rule) =>
      rule.originCountry === originCountry &&
      rule.destinationCountry === destinationCountry &&
      rule.travelType === travelType
  )
}

export function findDrivingRuleWithFallback(
  originCountry: string,
  destinationCountry: string,
  travelType: "tourist" | "business"
): { rule: DrivingRule | undefined; fallbackUsed: boolean } {
  const exact = findDrivingRule(originCountry, destinationCountry, travelType)
  if (exact) return { rule: exact, fallbackUsed: false }

  if (travelType === "business") {
    const tourist = findDrivingRule(originCountry, destinationCountry, "tourist")
    if (tourist) return { rule: tourist, fallbackUsed: true }
  }

  return { rule: undefined, fallbackUsed: false }
}

export function getUniqueRoutePairs(): { origin: string; destination: string }[] {
  const seen = new Set<string>()
  const pairs: { origin: string; destination: string }[] = []

  for (const rule of drivingRules) {
    const key = `${rule.originCountry}-${rule.destinationCountry}`
    if (!seen.has(key)) {
      seen.add(key)
      pairs.push({ origin: rule.originCountry, destination: rule.destinationCountry })
    }
  }

  return pairs
}

export function getCoverageStats() {
  const uniquePairs = getUniqueRoutePairs().length
  const totalCountries = countries.length
  const possiblePairs = totalCountries * (totalCountries - 1)

  return {
    verifiedRoutes: drivingRules.length,
    uniquePairs,
    totalCountries,
    possiblePairs,
    coveragePercent: Math.round((uniquePairs / possiblePairs) * 100),
  }
}

export function getRelatedRoutes(
  originCountry: string,
  destinationCountry: string
) {
  return drivingRules
    .filter(
      (rule) =>
        rule.originCountry === originCountry ||
        rule.destinationCountry === destinationCountry
    )
    .reduce<{ origin: string; destination: string; label: string }[]>((acc, rule) => {
      const key = `${rule.originCountry}-${rule.destinationCountry}`
      if (
        acc.some((r) => `${r.origin}-${r.destination}` === key) ||
        (rule.originCountry === originCountry && rule.destinationCountry === destinationCountry)
      ) {
        return acc
      }

      const origin = getCountryByCode(rule.originCountry)
      const dest = getCountryByCode(rule.destinationCountry)
      if (!origin || !dest) return acc

      acc.push({
        origin: rule.originCountry,
        destination: rule.destinationCountry,
        label: `${origin.name} → ${dest.name}`,
      })
      return acc
    }, [])
    .slice(0, 4)
}

export const popularRoutes = [
  { origin: "US", destination: "GB", label: "US license in the UK" },
  { origin: "US", destination: "JP", label: "US license in Japan" },
  { origin: "US", destination: "FR", label: "US license in France" },
  { origin: "US", destination: "IT", label: "US license in Italy" },
  { origin: "US", destination: "MX", label: "US license in Mexico" },
  { origin: "GB", destination: "FR", label: "UK license in France" },
  { origin: "CA", destination: "US", label: "Canadian license in the US" },
  { origin: "AU", destination: "JP", label: "Australian license in Japan" },
]
