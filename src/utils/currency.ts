/** Formats a numeric KES amount as "KSh 45,000" — no decimals, since nightly
 * rates and fees in this business are always whole shillings. */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount)
}
