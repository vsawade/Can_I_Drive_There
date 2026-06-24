import {
  findDrivingRuleWithFallback,
  getCountryByCode,
  getRelatedRoutes,
  getStateOverrideForRule,
} from "@/lib/data"
import { calculateConfidence } from "@/lib/confidence"
import { applyStateOverride } from "@/lib/rule-loader"
import { isStaleDate } from "@/lib/staleness"
import { getUsStateByCode } from "@/lib/us-states"
import type { DrivingCheckRequest, DrivingCheckResponse, RequiredDocument } from "@/lib/types"

export type CheckDrivingResult =
  | { ok: true; data: DrivingCheckResponse }
  | { ok: false; error: string; status: number }

export function validateDrivingCheckInput(
  body: Partial<DrivingCheckRequest>
): { ok: false; error: string; status: number } | { ok: true; input: DrivingCheckRequest } {
  const {
    originCountry,
    destinationCountry,
    travelType,
    stayLength,
    originState,
    vehicleMode,
    driverAge,
  } = body

  if (!originCountry || !destinationCountry || !travelType || stayLength === undefined) {
    return { ok: false, error: "Missing required fields", status: 400 }
  }

  if (!Number.isFinite(stayLength) || stayLength < 1 || stayLength > 365) {
    return { ok: false, error: "Stay length must be between 1 and 365 days", status: 400 }
  }

  if (travelType !== "tourist" && travelType !== "business") {
    return { ok: false, error: "Invalid travel type", status: 400 }
  }

  if (vehicleMode && vehicleMode !== "rental" && vehicleMode !== "own") {
    return { ok: false, error: "Invalid vehicle mode", status: 400 }
  }

  if (originCountry === destinationCountry) {
    return { ok: false, error: "Origin and destination must be different", status: 400 }
  }

  if (originState && originCountry === "US" && !getUsStateByCode(originState)) {
    return { ok: false, error: "Invalid US state code", status: 400 }
  }

  if (driverAge !== undefined && (!Number.isFinite(driverAge) || driverAge < 16 || driverAge > 99)) {
    return { ok: false, error: "Driver age must be between 16 and 99", status: 400 }
  }

  const origin = getCountryByCode(originCountry)
  const destination = getCountryByCode(destinationCountry)

  if (!origin || !destination) {
    return { ok: false, error: "Invalid country code", status: 400 }
  }

  return {
    ok: true,
    input: {
      originCountry,
      destinationCountry,
      travelType,
      stayLength,
      originState,
      vehicleMode: vehicleMode ?? "rental",
      driverAge,
    },
  }
}

function pickDocuments(
  rule: { legalDocuments?: RequiredDocument[]; rentalDocuments?: RequiredDocument[]; documents: RequiredDocument[] },
  vehicleMode: "rental" | "own"
): { legal: RequiredDocument[]; rental: RequiredDocument[]; active: RequiredDocument[] } {
  const legal = rule.legalDocuments ?? rule.documents
  const rental = rule.rentalDocuments ?? legal
  const active = vehicleMode === "rental" ? rental : legal
  return { legal, rental, active }
}

export function checkDrivingRequirements(input: DrivingCheckRequest): DrivingCheckResponse {
  const origin = getCountryByCode(input.originCountry)!
  const destination = getCountryByCode(input.destinationCountry)!
  const vehicleMode = input.vehicleMode ?? "rental"
  const usState = input.originState ? getUsStateByCode(input.originState) : undefined

  let { rule, fallbackUsed } = findDrivingRuleWithFallback(
    input.originCountry,
    input.destinationCountry,
    input.travelType
  )

  if (rule && input.originState) {
    const override = getStateOverrideForRule(rule)
    if (override) {
      rule = applyStateOverride(rule, override, input.originState)
    }
  }

  if (!rule) {
    const confidence = calculateConfidence(undefined, "unverified", false)
    return {
      ruleId: null,
      status: "Needs Verification",
      documents: [],
      legalDocuments: [],
      rentalDocuments: [],
      notes: [
        "We do not have verified requirements for this license and destination combination yet.",
        "The checklist below is intentionally empty — we will not guess document requirements.",
        "Check official embassy or transport authority websites before you travel.",
        "If you find the answer, use “Report outdated info” so we can add this route.",
      ],
      sources: [],
      lastUpdated: null,
      maxStayDays: 0,
      originCountryName: origin.name,
      destinationCountryName: destination.name,
      originCountry: input.originCountry,
      destinationCountry: input.destinationCountry,
      originState: input.originState,
      originStateName: usState?.name,
      vehicleMode,
      driverAge: input.driverAge,
      travelType: input.travelType,
      stayLength: input.stayLength,
      dataQuality: "unverified",
      ruleFound: false,
      isStale: false,
      confidence: confidence.level,
      confidenceReason: confidence.reason,
      relatedRoutes: getRelatedRoutes(input.originCountry, input.destinationCountry),
    }
  }

  let adjustedStatus = rule.status
  const additionalNotes = [...rule.notes]
  let dataQuality: DrivingCheckResponse["dataQuality"] = fallbackUsed
    ? "fallback_tourist"
    : "verified"

  if (fallbackUsed) {
    additionalNotes.unshift(
      "No business-travel rule exists for this route. Showing tourist requirements as a starting point — confirm business use with official authorities."
    )
  }

  if (input.stayLength > rule.maxStayDays && rule.maxStayDays > 0) {
    adjustedStatus = "Needs Verification"
    dataQuality = "stay_exceeded"
    additionalNotes.push(
      `Your planned stay of ${input.stayLength} days exceeds the ${rule.maxStayDays}-day limit covered by standard tourist rules. Additional permits or local licensing may be required.`
    )
  }

  if (input.driverAge !== undefined && input.driverAge < 21 && vehicleMode === "rental") {
    additionalNotes.push(
      "Most rental companies require drivers to be at least 21 (sometimes 25 for premium vehicles), regardless of legal driving age."
    )
  }

  if (usState?.idpRequiredAbroad && input.originCountry === "US") {
    additionalNotes.push(
      `${usState.name} recommends or requires an IDP for international driving — check AAA/AATA before departure.`
    )
  }

  if (vehicleMode === "own" && input.destinationCountry === "MX") {
    additionalNotes.push(
      "Driving your own vehicle to Mexico requires a temporary import permit (TIP) beyond the border zone."
    )
  }

  const isStale = isStaleDate(rule.lastUpdated)
  if (isStale) {
    additionalNotes.push(
      "This route data may be outdated. Please verify with official sources before traveling."
    )
  }

  const { legal, rental, active } = pickDocuments(rule, vehicleMode)
  const confidence = calculateConfidence(rule, dataQuality, true)

  return {
    ruleId: rule.ruleId ?? null,
    status: adjustedStatus,
    documents: active,
    legalDocuments: legal,
    rentalDocuments: rental,
    notes: additionalNotes,
    sources: rule.sources,
    lastUpdated: rule.lastUpdated,
    maxStayDays: rule.maxStayDays,
    originCountryName: origin.name,
    destinationCountryName: destination.name,
    originCountry: input.originCountry,
    destinationCountry: input.destinationCountry,
    originState: input.originState,
    originStateName: usState?.name,
    vehicleMode,
    driverAge: input.driverAge,
    travelType: input.travelType,
    stayLength: input.stayLength,
    dataQuality,
    ruleFound: true,
    isStale,
    confidence: confidence.level,
    confidenceReason: confidence.reason,
    relatedRoutes: [],
  }
}

export function runDrivingCheck(body: Partial<DrivingCheckRequest>): CheckDrivingResult {
  const validation = validateDrivingCheckInput(body)
  if (!validation.ok) {
    return validation
  }

  return { ok: true, data: checkDrivingRequirements(validation.input) }
}
