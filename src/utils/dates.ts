export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffMs = end.getTime() - start.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  const start = new Date(checkIn).toLocaleDateString('en-KE', opts)
  const end = new Date(checkOut).toLocaleDateString('en-KE', opts)
  return `${start} – ${end}`
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/** True if [aStart, aEnd) overlaps [bStart, bEnd). */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}
