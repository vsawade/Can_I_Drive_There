import type { Country } from "@/lib/types"
import countriesData from "@/data/countries.json"

export const countries: Country[] = countriesData

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code)
}

export function getCountryName(code: string): string {
  return getCountryByCode(code)?.name ?? code
}
