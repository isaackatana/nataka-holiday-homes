import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  uploadExperienceImage,
  deleteExperienceImage,
  reorderExperienceImages,
} from '@/services/admin/experienceImages.service'

function useInvalidateExperienceImageCaches(experienceId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'experiences', 'detail', experienceId] })
    queryClient.invalidateQueries({ queryKey: ['experiences'] }) // public listing + detail pages
  }
}

export function useUploadExperienceImage(experienceId: string) {
  const invalidate = useInvalidateExperienceImageCaches(experienceId)
  return useMutation({
    mutationFn: ({ file, currentCount }: { file: File; currentCount: number }) =>
      uploadExperienceImage(experienceId, file, currentCount),
    onSuccess: invalidate,
  })
}

export function useDeleteExperienceImage(experienceId: string) {
  const invalidate = useInvalidateExperienceImageCaches(experienceId)
  return useMutation({
    mutationFn: (image: Parameters<typeof deleteExperienceImage>[0]) => deleteExperienceImage(image),
    onSuccess: invalidate,
  })
}

export function useReorderExperienceImages(experienceId: string) {
  const invalidate = useInvalidateExperienceImageCaches(experienceId)
  return useMutation({
    mutationFn: (orderedImageIds: string[]) => reorderExperienceImages(orderedImageIds),
    onSuccess: invalidate,
  })
}
