import { NextResponse } from "next/server"
import { findDrivingRule, getCountryByCode } from "@/lib/data"
import type { DrivingCheckRequest, DrivingCheckResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: DrivingCheckRequest = await request.json()
    const { originCountry, destinationCountry, travelType, stayLength } = body

    // Validate inputs
    if (!originCountry || !destinationCountry || !travelType || stayLength === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const origin = getCountryByCode(originCountry)
    const destination = getCountryByCode(destinationCountry)

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Invalid country code" },
        { status: 400 }
      )
    }

    const rule = findDrivingRule(originCountry, destinationCountry, travelType)

    if (!rule) {
      // Return a default "Needs Verification" response when no data exists
      const response: DrivingCheckResponse = {
        status: "Needs Verification",
        documents: [
          { type: "Valid Driver's License", required: true },
          { type: "Passport", required: true },
          { type: "International Driving Permit (IDP)", required: true, notes: "Recommended when traveling internationally" },
        ],
        notes: [
          "We don't have specific data for this country combination",
          "Please verify requirements with official authorities before traveling",
        ],
        sources: [],
        lastUpdated: new Date().toISOString().split("T")[0],
        maxStayDays: 0,
        originCountryName: origin.name,
        destinationCountryName: destination.name,
      }
      return NextResponse.json(response)
    }

    // Check if stay length exceeds max allowed
    let adjustedStatus = rule.status
    const additionalNotes = [...rule.notes]

    if (stayLength > rule.maxStayDays && rule.maxStayDays > 0) {
      adjustedStatus = "Needs Verification"
      additionalNotes.push(
        `Your planned stay of ${stayLength} days exceeds the maximum ${rule.maxStayDays} days covered by standard rules. Additional permits may be required.`
      )
    }

    const response: DrivingCheckResponse = {
      status: adjustedStatus,
      documents: rule.documents,
      notes: additionalNotes,
      sources: rule.sources,
      lastUpdated: rule.lastUpdated,
      maxStayDays: rule.maxStayDays,
      originCountryName: origin.name,
      destinationCountryName: destination.name,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
