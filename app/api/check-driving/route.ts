import { NextResponse } from "next/server"
import { runDrivingCheck } from "@/lib/check-driving"
import type { DrivingCheckRequest } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: DrivingCheckRequest = await request.json()
    const result = runDrivingCheck(body)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json(result.data)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
