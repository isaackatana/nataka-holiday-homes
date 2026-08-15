import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  uploadPropertyImage,
  deletePropertyImage,
  setPrimaryImage,
  reorderPropertyImages,
} from '@/services/admin/propertyImages.service'
import type { PropertyImage } from '@/types/domain'

function useInvalidateImageCaches(propertyId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'properties', 'detail', propertyId] })
    queryClient.invalidateQueries({ queryKey: ['properties'] }) // public gallery reflects changes too
  }
}

export function useUploadPropertyImage(propertyId: string) {
  const invalidate = useInvalidateImageCaches(propertyId)
  return useMutation({
    mutationFn: ({ file, currentCount }: { file: File; currentCount: number }) =>
      uploadPropertyImage(propertyId, file, currentCount),
    onSuccess: invalidate,
  })
}

export function useDeletePropertyImage(propertyId: string) {
  const invalidate = useInvalidateImageCaches(propertyId)
  return useMutation({
    mutationFn: (image: PropertyImage) => deletePropertyImage(image),
    onSuccess: invalidate,
  })
}

export function useSetPrimaryImage(propertyId: string) {
  const invalidate = useInvalidateImageCaches(propertyId)
  return useMutation({
    mutationFn: (imageId: string) => setPrimaryImage(propertyId, imageId),
    onSuccess: invalidate,
  })
}

export function useReorderPropertyImages(propertyId: string) {
  const invalidate = useInvalidateImageCaches(propertyId)
  return useMutation({
    mutationFn: (orderedImageIds: string[]) => reorderPropertyImages(orderedImageIds),
    onSuccess: invalidate,
  })
}
