import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types/domain'

export interface AdminCustomer {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
  bookingCount: number
}

export async function getAllCustomersForAdmin(search?: string): Promise<AdminCustomer[]> {
  let query = supabase
    .from('profiles')
    .select('id, full_name, phone, role, created_at')
    .order('created_at', { ascending: false })

  if (search) query = query.ilike('full_name', `%${search}%`)

  const { data: profiles, error } = await query
  if (error) throw error

  const rows = (profiles ?? []) as unknown as Omit<AdminCustomer, 'bookingCount'>[]
  if (rows.length === 0) return []

  // Booking counts per customer, aggregated client-side — same approach
  // as getPopularProperties in stats.service.ts, and for the same reason:
  // no GROUP BY without a Postgres RPC via the JS query builder, and fine
  // at this scale.
  const { data: bookingRows, error: bookingsError } = await supabase
    .from('bookings')
    .select('customer_id')
    .in(
      'customer_id',
      rows.map((r) => r.id),
    )
  if (bookingsError) throw bookingsError

  const counts = new Map<string, number>()
  for (const row of (bookingRows ?? []) as unknown as { customer_id: string | null }[]) {
    if (!row.customer_id) continue
    counts.set(row.customer_id, (counts.get(row.customer_id) ?? 0) + 1)
  }

  return rows.map((r) => ({ ...r, bookingCount: counts.get(r.id) ?? 0 }))
}

export async function updateCustomerRole(id: string, role: UserRole): Promise<void> {
  const { error } = await supabase.from('profiles').update({ role } as never).eq('id', id)
  if (error) throw error
}
