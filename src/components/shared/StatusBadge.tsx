import type { BookingStatus } from '@/types/domain'

const STATUS_STYLES: Record<BookingStatus, string> = {
  // Warm/waiting — nothing has happened yet.
  pending: 'bg-gold-500/15 text-gold-600',
  // In progress — we've reached out.
  contacted: 'bg-teal-600/15 text-teal-700',
  // Locked in — the strongest, most "done" treatment.
  confirmed: 'bg-teal-900 text-sand-50',
  // Needs attention / didn't happen.
  cancelled: 'bg-coral-500/15 text-coral-500',
  // Neutral — in the past, no action needed.
  completed: 'bg-charcoal-500/10 text-charcoal-500',
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
