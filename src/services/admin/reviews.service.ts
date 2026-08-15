import { supabase } from '@/lib/supabase'
import type { ReviewStatus } from '@/types/domain'

export interface AdminReview {
  id: string
  rating: number
  comment: string | null
  status: ReviewStatus
  created_at: string
  properties: { title: string; slug: string } | null
  profiles: { full_name: string | null } | null
}

export interface AdminReviewFilters {
  status?: ReviewStatus
}

export async function getAllReviewsForAdmin(filters: AdminReviewFilters = {}): Promise<AdminReview[]> {
  let query = supabase
    .from('reviews')
    .select('id, rating, comment, status, created_at, properties ( title, slug ), profiles ( full_name )')
    .order('created_at', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as AdminReview[]
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  const { error } = await supabase.from('reviews').update({ status } as never).eq('id', id)
  if (error) throw error
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
}
