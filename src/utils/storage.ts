import { supabase } from '@/lib/supabase'

/**
 * Both image buckets (property-images, experience-images) are public
 * buckets (see supabase/migrations/0004_storage.sql), so this returns a
 * plain public URL rather than a signed one.
 */
export function getPublicImageUrl(
  bucket: 'property-images' | 'experience-images',
  storagePath: string,
): string {
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl
}

export function getPrimaryPropertyImageUrl(
  images: { storage_path: string; is_primary: boolean }[] | undefined,
): string | null {
  if (!images || images.length === 0) return null
  const primary = images.find((img) => img.is_primary) ?? images[0]
  return getPublicImageUrl('property-images', primary.storage_path)
}
