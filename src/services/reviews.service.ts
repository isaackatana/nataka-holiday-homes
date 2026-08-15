import { supabase } from '@/lib/supabase'

export interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: { full_name: string | null } | null
}

export async function getApprovedReviews(propertyId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, profiles ( full_name )')
    .eq('property_id', propertyId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as Review[]
}
