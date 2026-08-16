import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBusinessSettings, updateBusinessSettings, type BusinessSettingsInput } from '@/services/settings.service'

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['settings', 'business'],
    queryFn: getBusinessSettings,
    staleTime: 5 * 60 * 1000, // changes rarely — no need to refetch aggressively
  })
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: BusinessSettingsInput) => updateBusinessSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'business'] })
    },
  })
}
