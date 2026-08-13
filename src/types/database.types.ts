/**
 * PLACEHOLDER — replace this file with the real output of:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 *
 * once the schema from the architecture doc is migrated into a live
 * Supabase project (Step 6/7). Keeping this stub means `supabase.ts` and
 * every service file that imports `Database` compiles today without
 * pretending to know a schema that doesn't exist yet.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
