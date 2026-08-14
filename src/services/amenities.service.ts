import { supabase } from '@/lib/supabase'
import type { Amenity } from '@/types/domain'

export async function getAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase.from('amenities').select('id, name, icon').order('name')
  if (error) throw error
  return (data ?? []) as unknown as Amenity[]
}
