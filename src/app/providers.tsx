import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/queryClient'

/**
 * Root provider stack. Auth context will be added here in the
 * authentication step (Step 7) as <AuthProvider> — kept out for now so
 * this stays buildable without a live Supabase project connected.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HelmetProvider>
  )
}
