import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllExperiencesForAdmin,
  getExperienceByIdForAdmin,
  createExperience,
  updateExperience,
  deleteExperience,
  toggleExperiencePublished,
  type ExperienceInput,
} from '@/services/admin/experiences.service'

function useInvalidateExperienceCaches() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] })
    queryClient.invalidateQueries({ queryKey: ['experiences'] }) // public listing + detail pages
  }
}

export function useAdminExperiences() {
  return useQuery({
    queryKey: ['admin', 'experiences', 'list'],
    queryFn: getAllExperiencesForAdmin,
  })
}

export function useAdminExperience(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'experiences', 'detail', id],
    queryFn: () => getExperienceByIdForAdmin(id!),
    enabled: !!id,
  })
}

export function useCreateExperience() {
  const invalidate = useInvalidateExperienceCaches()
  return useMutation({
    mutationFn: (input: ExperienceInput) => createExperience(input),
    onSuccess: invalidate,
  })
}

export function useUpdateExperience(id: string) {
  const invalidate = useInvalidateExperienceCaches()
  return useMutation({
    mutationFn: (input: ExperienceInput) => updateExperience(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteExperience() {
  const invalidate = useInvalidateExperienceCaches()
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: invalidate,
  })
}

export function useToggleExperiencePublished() {
  const invalidate = useInvalidateExperienceCaches()
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      toggleExperiencePublished(id, isPublished),
    onSuccess: invalidate,
  })
}
