const HTML_TAG = /<[^>]*>/g
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export function sanitizeText(input: string, maxLength: number): string {
  return input
    .replace(HTML_TAG, "")
    .replace(CONTROL_CHARS, "")
    .trim()
    .slice(0, maxLength)
}

export function sanitizeUrl(input: string | undefined | null): string | null {
  if (!input?.trim()) return null

  const trimmed = input.trim().slice(0, 500)

  try {
    const url = new URL(trimmed)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null
    }
    return url.toString()
  } catch {
    return null
  }
}

export function sanitizeCountryCode(code: string): string {
  return code.trim().toUpperCase().slice(0, 2)
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254)
}
