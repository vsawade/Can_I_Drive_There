const STALE_THRESHOLD_MONTHS = 6

export function isStaleDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return false

  const threshold = new Date()
  threshold.setMonth(threshold.getMonth() - STALE_THRESHOLD_MONTHS)

  return date < threshold
}

export function formatStalenessMessage(dateString: string): string {
  return `This information was last verified on ${dateString}. Regulations may have changed since then.`
}

export { STALE_THRESHOLD_MONTHS }
