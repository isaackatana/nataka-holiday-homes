import { Star } from 'lucide-react'
import { useApprovedReviews } from '@/features/reviews/queries'

export function ReviewsSection({ propertyId }: { propertyId: string }) {
  const { data: reviews, isLoading } = useApprovedReviews(propertyId)

  if (isLoading) return null
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm text-charcoal-500">
        No reviews yet — be the first to stay and share your experience.
      </p>
    )
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 fill-gold-500 text-gold-500" />
        <span className="font-figures text-lg font-medium text-teal-900">{average.toFixed(1)}</span>
        <span className="text-sm text-charcoal-500">
          ({reviews.length} review{reviews.length === 1 ? '' : 's'})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-2 rounded-card bg-sand-100 p-5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-sand-300'
                  }`}
                />
              ))}
            </div>
            {review.comment && <p className="text-sm text-charcoal-700">{review.comment}</p>}
            <span className="font-mono text-xs text-charcoal-500">
              {review.profiles?.full_name ?? 'Guest'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
