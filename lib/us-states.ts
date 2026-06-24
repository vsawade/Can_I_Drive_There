export interface UsState {
  code: string
  name: string
  idpRequiredAbroad: boolean
}

export const usStates: UsState[] = [
  { code: "AL", name: "Alabama", idpRequiredAbroad: false },
  { code: "AK", name: "Alaska", idpRequiredAbroad: false },
  { code: "AZ", name: "Arizona", idpRequiredAbroad: false },
  { code: "AR", name: "Arkansas", idpRequiredAbroad: false },
  { code: "CA", name: "California", idpRequiredAbroad: false },
  { code: "CO", name: "Colorado", idpRequiredAbroad: false },
  { code: "CT", name: "Connecticut", idpRequiredAbroad: false },
  { code: "DE", name: "Delaware", idpRequiredAbroad: false },
  { code: "FL", name: "Florida", idpRequiredAbroad: true },
  { code: "GA", name: "Georgia", idpRequiredAbroad: false },
  { code: "HI", name: "Hawaii", idpRequiredAbroad: false },
  { code: "ID", name: "Idaho", idpRequiredAbroad: false },
  { code: "IL", name: "Illinois", idpRequiredAbroad: true },
  { code: "IN", name: "Indiana", idpRequiredAbroad: false },
  { code: "IA", name: "Iowa", idpRequiredAbroad: false },
  { code: "KS", name: "Kansas", idpRequiredAbroad: false },
  { code: "KY", name: "Kentucky", idpRequiredAbroad: false },
  { code: "LA", name: "Louisiana", idpRequiredAbroad: false },
  { code: "ME", name: "Maine", idpRequiredAbroad: false },
  { code: "MD", name: "Maryland", idpRequiredAbroad: false },
  { code: "MA", name: "Massachusetts", idpRequiredAbroad: true },
  { code: "MI", name: "Michigan", idpRequiredAbroad: false },
  { code: "MN", name: "Minnesota", idpRequiredAbroad: false },
  { code: "MS", name: "Mississippi", idpRequiredAbroad: false },
  { code: "MO", name: "Missouri", idpRequiredAbroad: false },
  { code: "MT", name: "Montana", idpRequiredAbroad: false },
  { code: "NE", name: "Nebraska", idpRequiredAbroad: false },
  { code: "NV", name: "Nevada", idpRequiredAbroad: false },
  { code: "NH", name: "New Hampshire", idpRequiredAbroad: false },
  { code: "NJ", name: "New Jersey", idpRequiredAbroad: false },
  { code: "NM", name: "New Mexico", idpRequiredAbroad: false },
  { code: "NY", name: "New York", idpRequiredAbroad: false },
  { code: "NC", name: "North Carolina", idpRequiredAbroad: false },
  { code: "ND", name: "North Dakota", idpRequiredAbroad: false },
  { code: "OH", name: "Ohio", idpRequiredAbroad: false },
  { code: "OK", name: "Oklahoma", idpRequiredAbroad: false },
  { code: "OR", name: "Oregon", idpRequiredAbroad: false },
  { code: "PA", name: "Pennsylvania", idpRequiredAbroad: false },
  { code: "RI", name: "Rhode Island", idpRequiredAbroad: false },
  { code: "SC", name: "South Carolina", idpRequiredAbroad: false },
  { code: "SD", name: "South Dakota", idpRequiredAbroad: false },
  { code: "TN", name: "Tennessee", idpRequiredAbroad: false },
  { code: "TX", name: "Texas", idpRequiredAbroad: true },
  { code: "UT", name: "Utah", idpRequiredAbroad: false },
  { code: "VT", name: "Vermont", idpRequiredAbroad: false },
  { code: "VA", name: "Virginia", idpRequiredAbroad: true },
  { code: "WA", name: "Washington", idpRequiredAbroad: false },
  { code: "WV", name: "West Virginia", idpRequiredAbroad: false },
  { code: "WI", name: "Wisconsin", idpRequiredAbroad: false },
  { code: "WY", name: "Wyoming", idpRequiredAbroad: false },
  { code: "DC", name: "District of Columbia", idpRequiredAbroad: false },
]

export function getUsStateByCode(code: string): UsState | undefined {
  return usStates.find((s) => s.code === code)
}
