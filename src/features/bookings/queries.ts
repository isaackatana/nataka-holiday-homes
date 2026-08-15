import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBookingEnquiry,
  getBookingBlocks,
  getMyBookings,
  type CreateBookingInput,
} from '@/services/bookings.service'

export function useBookingBlocks(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['booking-blocks', propertyId],
    queryFn: () => getBookingBlocks(propertyId!),
    enabled: !!propertyId,
  })
}

export function useCreateBookingEnquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBookingEnquiry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })
}

export function useMyBookings(customerId: string | undefined) {
  return useQuery({
    queryKey: ['my-bookings', customerId],
    queryFn: () => getMyBookings(customerId!),
    enabled: !!customerId,
  })
}
