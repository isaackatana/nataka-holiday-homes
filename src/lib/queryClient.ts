import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute — property/experience data doesn't change second-to-second
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
