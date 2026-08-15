import { useQuery } from '@tanstack/react-query'
import { getApprovedReviews } from '@/services/reviews.service'

export function useApprovedReviews(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => getApprovedReviews(propertyId!),
    enabled: !!propertyId,
  })
}
