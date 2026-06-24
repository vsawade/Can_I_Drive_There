import type { DrivingRule, RequiredDocument, StateOverride } from "@/lib/types"

const DEFAULT_IF_MISSING: Record<string, string> = {
  "International Driving Permit (IDP)":
    "Rental may be denied; police may issue fines; insurance may not cover accidents.",
  Passport: "You cannot enter the country or rent a vehicle.",
  "Proof of Insurance": "Driving uninsured may result in fines, vehicle impound, or personal liability.",
  "Mexican Auto Insurance": "You may be detained, fined, or held liable for all accident costs in Mexico.",
  "Valid US Driver's License": "You cannot legally drive; rentals will be refused.",
  "Valid UK Driver's License": "You cannot legally drive; rentals will be refused.",
}

function withConsequences(doc: RequiredDocument): RequiredDocument {
  if (doc.ifMissing) return doc
  const fallback = DEFAULT_IF_MISSING[doc.type]
  return fallback ? { ...doc, ifMissing: fallback } : doc
}

function defaultRentalExtras(legal: RequiredDocument[]): RequiredDocument[] {
  const extras: RequiredDocument[] = [
    {
      type: "Credit Card for Deposit",
      required: true,
      notes: "Most rental companies require a credit card in the driver's name",
      ifMissing: "Rental counter may refuse to release the vehicle.",
    },
  ]

  const hasIdp = legal.some((d) => d.type.includes("IDP") || d.type.includes("International Driving Permit"))
  if (hasIdp) {
    extras.unshift({
      type: "International Driving Permit (IDP)",
      required: true,
      notes: "Many rental agencies require an IDP even when not legally required",
      ifMissing: "Rental counter may refuse service despite legal eligibility.",
    })
  }

  return [...legal.map(withConsequences), ...extras]
}

export function normalizeRule(rule: DrivingRule): DrivingRule {
  const ruleId =
    rule.ruleId ?? `${rule.originCountry}-${rule.destinationCountry}-${rule.travelType}`
  const legal = (rule.legalDocuments ?? rule.documents).map(withConsequences)
  const rental = (rule.rentalDocuments ?? defaultRentalExtras(legal)).map(withConsequences)

  return {
    ...rule,
    ruleId,
    version: rule.version ?? 1,
    lastVerified: rule.lastVerified ?? rule.lastUpdated,
    legalDocuments: legal,
    rentalDocuments: rental,
    documents: legal,
  }
}

export function getRuleKey(rule: DrivingRule): string {
  return `${rule.originCountry}-${rule.destinationCountry}-${rule.travelType}`
}

export function applyStateOverride(
  rule: DrivingRule,
  override: StateOverride,
  stateCode: string
): DrivingRule {
  if (!override.states.includes("*") && !override.states.includes(stateCode)) {
    return rule
  }

  const legal = [...(rule.legalDocuments ?? rule.documents)]
  const rental = [...(rule.rentalDocuments ?? rule.documents)]

  for (const doc of override.additionalDocuments) {
    const enriched = withConsequences(doc)
    if (!legal.some((d) => d.type === enriched.type)) legal.push(enriched)
    if (!rental.some((d) => d.type === enriched.type)) rental.push(enriched)
  }

  return {
    ...rule,
    legalDocuments: legal,
    rentalDocuments: rental,
    documents: legal,
    notes: [...override.additionalNotes, ...rule.notes],
  }
}
