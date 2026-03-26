import type { Country, DrivingRule } from "./types"

export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  { code: "AE", name: "United Arab Emirates" },
]

export const drivingRules: DrivingRule[] = [
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
      { authorityName: "UK Government - DVLA", url: "https://www.gov.uk/driving-in-the-uk", verifiedAt: "2024-01-15" },
    ],
    lastUpdated: "2024-01-15",
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
      { authorityName: "German Federal Ministry of Transport", url: "https://www.bmvi.de/", verifiedAt: "2024-01-10" },
    ],
    lastUpdated: "2024-01-10",
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
      { authorityName: "Japan Automobile Federation (JAF)", url: "https://english.jaf.or.jp/", verifiedAt: "2024-02-01" },
    ],
    lastUpdated: "2024-02-01",
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
      { authorityName: "US Embassy in Mexico", url: "https://mx.usembassy.gov/", verifiedAt: "2024-01-20" },
    ],
    lastUpdated: "2024-01-20",
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
      { authorityName: "French Government - Service-Public.fr", url: "https://www.service-public.fr/", verifiedAt: "2024-01-12" },
    ],
    lastUpdated: "2024-01-12",
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
      { authorityName: "DGT - Spanish Traffic Authority", url: "https://www.dgt.es/", verifiedAt: "2024-01-18" },
    ],
    lastUpdated: "2024-01-18",
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
      { authorityName: "Italian Ministry of Transport", url: "https://www.mit.gov.it/", verifiedAt: "2024-01-08" },
    ],
    lastUpdated: "2024-01-08",
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
      { authorityName: "US State Department", url: "https://travel.state.gov/", verifiedAt: "2024-01-22" },
    ],
    lastUpdated: "2024-01-22",
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
      { authorityName: "Japan Automobile Federation (JAF)", url: "https://english.jaf.or.jp/", verifiedAt: "2024-02-01" },
    ],
    lastUpdated: "2024-02-01",
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
      { authorityName: "US Customs and Border Protection", url: "https://www.cbp.gov/", verifiedAt: "2024-01-25" },
    ],
    lastUpdated: "2024-01-25",
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
      { authorityName: "UAE Ministry of Interior", url: "https://www.moi.gov.ae/", verifiedAt: "2024-01-30" },
    ],
    lastUpdated: "2024-01-30",
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
      { authorityName: "German Embassy", url: "https://www.germany.info/", verifiedAt: "2024-01-10" },
    ],
    lastUpdated: "2024-01-10",
  },
]

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
