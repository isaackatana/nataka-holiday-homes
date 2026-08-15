import { supabase } from '@/lib/supabase'
import type { BookingStatus } from '@/types/domain'

export interface DashboardStats {
  totalProperties: number
  publishedProperties: number
  pendingEnquiries: number
  confirmedBookings: number
  totalCustomers: number
}

async function getCount(
  table: 'properties' | 'bookings' | 'profiles',
  eqColumn: string,
  eqValue: string | boolean,
): Promise<number>
async function getCount(table: 'properties'): Promise<number>
async function getCount(
  table: 'properties' | 'bookings' | 'profiles',
  eqColumn?: string,
  eqValue?: string | boolean,
): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (eqColumn && eqValue !== undefined) query = query.eq(eqColumn, eqValue as never)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalProperties, publishedProperties, pendingEnquiries, confirmedBookings, totalCustomers] =
    await Promise.all([
      getCount('properties'),
      getCount('properties', 'is_published', true),
      getCount('bookings', 'status', 'pending'),
      getCount('bookings', 'status', 'confirmed'),
      getCount('profiles', 'role', 'customer'),
    ])

  return { totalProperties, publishedProperties, pendingEnquiries, confirmedBookings, totalCustomers }
}

export interface RecentEnquiry {
  id: string
  guest_name: string
  check_in: string
  check_out: string
  status: BookingStatus
  created_at: string
  properties: { title: string; slug: string } | null
}

export async function getRecentEnquiries(limit = 5): Promise<RecentEnquiry[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, guest_name, check_in, check_out, status, created_at, properties ( title, slug )')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as unknown as RecentEnquiry[]
}

export interface RecentUser {
  id: string
  full_name: string | null
  role: string
  created_at: string
}

export async function getRecentUsers(limit = 5): Promise<RecentUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as unknown as RecentUser[]
}

export interface PopularProperty {
  id: string
  title: string
  slug: string
  price_per_night: number
  enquiryCount: number
}

/**
 * "Popular" = most booking enquiries received. Aggregated client-side
 * (fetch all bookings' property_id, count, then look up the top few
 * properties) rather than a SQL GROUP BY, since Supabase's JS query
 * builder doesn't express aggregation directly without a Postgres RPC —
 * fine at this app's scale, worth revisiting as a real RPC if the
 * bookings table grows into the tens of thousands of rows.
 */
export async function getPopularProperties(limit = 5): Promise<PopularProperty[]> {
  const { data: bookingRows, error: bookingsError } = await supabase
    .from('bookings')
    .select('property_id')

  if (bookingsError) throw bookingsError

  const counts = new Map<string, number>()
  for (const row of (bookingRows ?? []) as unknown as { property_id: string }[]) {
    counts.set(row.property_id, (counts.get(row.property_id) ?? 0) + 1)
  }

  const topIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)

  if (topIds.length === 0) return []

  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('id, title, slug, price_per_night')
    .in('id', topIds)

  if (propertiesError) throw propertiesError

  return ((properties ?? []) as unknown as { id: string; title: string; slug: string; price_per_night: number }[])
    .map((p) => ({ ...p, enquiryCount: counts.get(p.id) ?? 0 }))
    .sort((a, b) => b.enquiryCount - a.enquiryCount)
}
