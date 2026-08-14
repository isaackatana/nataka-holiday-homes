import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/features/auth/AuthContext'

/**
 * Root provider stack. AuthProvider must sit *inside* QueryClientProvider
 * since it uses useQuery internally for the profile fetch.
 *
 * NOTE: this app will throw at runtime until a real Supabase project is
 * connected via .env.local (see supabase/README.md) — src/lib/supabase.ts
 * fails fast rather than silently calling `undefined`.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
