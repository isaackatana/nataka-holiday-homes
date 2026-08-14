import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/domain'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // PGRST116 = no row found (e.g. trigger hasn't run yet on a brand-new
    // signup) — treat as "no profile yet" rather than a hard failure.
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as unknown as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'avatar_url'>>,
): Promise<Profile> {
  // The placeholder Database type (src/types/database.types.ts) can't
  // express per-table Update shapes yet, so `.update()`'s generic
  // inference collapses to `never` here. Cast until real `supabase gen
  // types` output replaces the stub (see supabase/README.md §4).
  const { data, error } = await supabase
    .from('profiles')
    .update(updates as never)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return data as unknown as Profile
}
