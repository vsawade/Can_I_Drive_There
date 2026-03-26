export interface Country {
  code: string
  name: string
}

export interface RequiredDocument {
  type: string
  required: boolean
  notes?: string
}

export interface Source {
  authorityName: string
  url: string
  verifiedAt: string
}

export type DrivingStatus = "Allowed" | "Conditionally Allowed" | "Needs Verification"

export interface DrivingRule {
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
  maxStayDays: number
  status: DrivingStatus
  documents: RequiredDocument[]
  notes: string[]
  sources: Source[]
  lastUpdated: string
}

export interface DrivingCheckRequest {
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
  stayLength: number
}

export interface DrivingCheckResponse {
  status: DrivingStatus
  documents: RequiredDocument[]
  notes: string[]
  sources: Source[]
  lastUpdated: string
  maxStayDays: number
  originCountryName: string
  destinationCountryName: string
}
