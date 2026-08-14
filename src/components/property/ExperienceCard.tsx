import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { Experience } from '@/types/domain'
import { getPublicImageUrl } from '@/utils/storage'
import { formatKES } from '@/utils/currency'

export function ExperienceCard({ experience }: { experience: Experience }) {
  const primaryImage = experience.experience_images?.[0]
  const imageUrl = primaryImage ? getPublicImageUrl('experience-images', primaryImage.storage_path) : null

  return (
    <Link
      to={`/experiences/${experience.slug}`}
      className="group flex flex-col overflow-hidden rounded-card bg-sand-50 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-teal-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={experience.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-800 to-teal-950 text-sand-200">
            <span className="font-display text-lg">{experience.title}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-medium text-teal-900">{experience.title}</h3>
        <div className="flex items-center gap-4 text-sm text-charcoal-500">
          {experience.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {experience.duration}
            </span>
          )}
          {experience.price !== null && (
            <span className="font-figures">{formatKES(experience.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
