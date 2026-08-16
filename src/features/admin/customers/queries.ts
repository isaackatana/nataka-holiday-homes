import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllCustomersForAdmin, updateCustomerRole } from '@/services/admin/customers.service'
import type { UserRole } from '@/types/domain'

export function useAdminCustomers(search?: string) {
  return useQuery({
    queryKey: ['admin', 'customers', 'list', search],
    queryFn: () => getAllCustomersForAdmin(search),
  })
}

export function useUpdateCustomerRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateCustomerRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] })
      // Doesn't invalidate the affected user's own ['profile', userId]
      // cache — that's a different browser session entirely, and
      // profiles.role is read fresh on their next sign-in/page load
      // regardless (see AuthContext.tsx), so this isn't a correctness
      // gap, just not instant for them.
    },
  })
}
