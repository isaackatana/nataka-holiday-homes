import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllContactMessages,
  markContactMessageRead,
  deleteContactMessage,
  type AdminContactMessageFilters,
} from '@/services/admin/contactMessages.service'

export function useAdminContactMessages(filters: AdminContactMessageFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'contact-messages', filters],
    queryFn: () => getAllContactMessages(filters),
  })
}

function useInvalidateContactMessages() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
}

export function useMarkContactMessageRead() {
  const invalidate = useInvalidateContactMessages()
  return useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) => markContactMessageRead(id, isRead),
    onSuccess: invalidate,
  })
}

export function useDeleteContactMessage() {
  const invalidate = useInvalidateContactMessages()
  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: invalidate,
  })
}
