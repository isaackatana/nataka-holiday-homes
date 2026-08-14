import { useQuery } from '@tanstack/react-query'
import { getPublishedExperiences, getExperienceBySlug } from '@/services/experiences.service'

export function useExperiences(limit?: number) {
  return useQuery({
    queryKey: ['experiences', 'list', limit],
    queryFn: () => getPublishedExperiences(limit),
  })
}

export function useExperienceBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['experiences', 'detail', slug],
    queryFn: () => getExperienceBySlug(slug!),
    enabled: !!slug,
  })
}
