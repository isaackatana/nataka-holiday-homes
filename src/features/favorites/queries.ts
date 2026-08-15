import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFavoriteIds, getFavoriteProperties, addFavorite, removeFavorite } from '@/services/favorites.service'

export function useFavoriteIds(customerId: string | undefined) {
  return useQuery({
    queryKey: ['favorites', 'ids', customerId],
    queryFn: () => getFavoriteIds(customerId!),
    enabled: !!customerId,
  })
}

export function useFavoriteProperties(customerId: string | undefined) {
  return useQuery({
    queryKey: ['favorites', 'properties', customerId],
    queryFn: () => getFavoriteProperties(customerId!),
    enabled: !!customerId,
  })
}

interface ToggleFavoriteInput {
  propertyId: string
  isFavorited: boolean
}

/**
 * Optimistically flips the heart icon immediately rather than waiting on
 * the round trip — favoriting is exactly the kind of low-stakes, frequent
 * action where a beat of lag reads as broken. Rolls back on error.
 */
export function useToggleFavorite(customerId: string | undefined) {
  const queryClient = useQueryClient()
  const idsKey = ['favorites', 'ids', customerId]

  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: ToggleFavoriteInput) => {
      if (!customerId) throw new Error('Must be signed in to save favorites')
      if (isFavorited) {
        await removeFavorite(customerId, propertyId)
      } else {
        await addFavorite(customerId, propertyId)
      }
    },
    onMutate: async ({ propertyId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: idsKey })
      const previousIds = queryClient.getQueryData<string[]>(idsKey) ?? []

      queryClient.setQueryData<string[]>(
        idsKey,
        isFavorited ? previousIds.filter((id) => id !== propertyId) : [...previousIds, propertyId],
      )

      return { previousIds }
    },
    onError: (_err, _variables, context) => {
      if (context) queryClient.setQueryData(idsKey, context.previousIds)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey })
      queryClient.invalidateQueries({ queryKey: ['favorites', 'properties', customerId] })
    },
  })
}

/**
 * Convenience wrapper for pages that just need "is this favorited" +
 * "toggle it" without touching the ids query directly — used by every
 * PropertyCard grid (Home, Holiday Homes, related properties).
 */
export function useFavoritesToggle(customerId: string | undefined) {
  const { data: favoriteIds } = useFavoriteIds(customerId)
  const toggleMutation = useToggleFavorite(customerId)
  const idSet = new Set(favoriteIds ?? [])

  return {
    isFavorited: (propertyId: string) => idSet.has(propertyId),
    toggleFavorite: (propertyId: string) =>
      toggleMutation.mutate({ propertyId, isFavorited: idSet.has(propertyId) }),
  }
}
