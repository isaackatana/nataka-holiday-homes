import { useQuery } from '@tanstack/react-query'
import {
  getDashboardStats,
  getRecentEnquiries,
  getRecentUsers,
  getPopularProperties,
} from '@/services/admin/stats.service'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: getDashboardStats,
  })
}

export function useRecentEnquiries(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'recent-enquiries', limit],
    queryFn: () => getRecentEnquiries(limit),
  })
}

export function useRecentUsers(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'recent-users', limit],
    queryFn: () => getRecentUsers(limit),
  })
}

export function usePopularProperties(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'popular-properties', limit],
    queryFn: () => getPopularProperties(limit),
  })
}
