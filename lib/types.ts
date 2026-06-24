export interface Country {
  code: string
  name: string
}

export interface RequiredDocument {
  type: string
  required: boolean
  notes?: string
  ifMissing?: string
}

export interface Source {
  authorityName: string
  url: string
  verifiedAt: string
}

export type DrivingStatus = "Allowed" | "Conditionally Allowed" | "Needs Verification"

export type DataQuality =
  | "verified"
  | "unverified"
  | "stay_exceeded"
  | "partial"
  | "fallback_tourist"

export type ConfidenceLevel = "high" | "medium" | "low" | "none"

export type VehicleMode = "rental" | "own"

export type ReportStatus = "pending" | "reviewed" | "applied"

export interface DrivingRule {
  ruleId?: string
  version?: number
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
  maxStayDays: number
  status: DrivingStatus
  documents: RequiredDocument[]
  legalDocuments?: RequiredDocument[]
  rentalDocuments?: RequiredDocument[]
  notes: string[]
  sources: Source[]
  lastUpdated: string
  lastVerified?: string
}

export interface StateOverride {
  ruleKey: string
  states: string[]
  additionalDocuments: RequiredDocument[]
  additionalNotes: string[]
}

export interface DrivingCheckRequest {
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
  stayLength: number
  originState?: string
  vehicleMode?: VehicleMode
  driverAge?: number
}

export interface RelatedRoute {
  origin: string
  destination: string
  label: string
}

export interface DrivingCheckResponse {
  ruleId: string | null
  status: DrivingStatus
  documents: RequiredDocument[]
  legalDocuments: RequiredDocument[]
  rentalDocuments: RequiredDocument[]
  notes: string[]
  sources: Source[]
  lastUpdated: string | null
  maxStayDays: number
  originCountryName: string
  destinationCountryName: string
  originCountry: string
  destinationCountry: string
  originState?: string
  originStateName?: string
  vehicleMode: VehicleMode
  driverAge?: number
  travelType: "tourist" | "business"
  stayLength: number
  dataQuality: DataQuality
  ruleFound: boolean
  isStale: boolean
  confidence: ConfidenceLevel
  confidenceReason: string
  relatedRoutes: RelatedRoute[]
}

export interface OutdatedReportRequest {
  originCountry: string
  destinationCountry: string
  travelType?: "tourist" | "business"
  message: string
  sourceUrl?: string
}

export interface StoredReport {
  id: string
  originCountry: string
  destinationCountry: string
  travelType: string
  message: string
  sourceUrl: string | null
  status: ReportStatus
  reportedAt: string
}

export interface AnalyticsEvent {
  id: string
  event: "route_check" | "missing_route" | "report_click" | "share_checklist" | "trip_reminder"
  originCountry?: string
  destinationCountry?: string
  ruleFound?: boolean
  metadata?: Record<string, string | number | boolean>
  createdAt: string
}

export interface TripReminderRequest {
  email: string
  originCountry: string
  destinationCountry: string
  tripDate: string
  stayLength: number
  travelType: "tourist" | "business"
}

export interface RulesDatabase {
  countries: Country[]
  rules: DrivingRule[]
  stateOverrides: StateOverride[]
}
