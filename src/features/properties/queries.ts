import { useQuery } from '@tanstack/react-query'
import {
  getFeaturedProperties,
  getPublishedProperties,
  getPropertyBySlug,
  type PropertyFilters,
} from '@/services/properties.service'
import { getAmenities } from '@/services/amenities.service'

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: () => getFeaturedProperties(limit),
  })
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', 'list', filters],
    queryFn: () => getPublishedProperties(filters),
  })
}

export function usePropertyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['properties', 'detail', slug],
    queryFn: () => getPropertyBySlug(slug!),
    enabled: !!slug,
  })
}

export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: getAmenities,
    staleTime: 5 * 60 * 1000, // reference data — barely changes
  })
}
