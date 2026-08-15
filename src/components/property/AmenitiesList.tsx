import * as Icons from 'lucide-react'
import { Check } from 'lucide-react'
import type { Amenity } from '@/types/domain'

export function AmenitiesList({ amenities }: { amenities: Amenity[] }) {
  if (amenities.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {amenities.map((amenity) => {
        // amenities.icon stores a lucide-react icon name (e.g. "wifi"); fall
        // back to a plain checkmark if it doesn't match a known icon so a
        // typo'd icon name in the admin form never breaks the page.
        const IconComponent =
          (amenity.icon &&
            (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
              toPascalCase(amenity.icon)
            ]) ||
          Check
        return (
          <div key={amenity.id} className="flex items-center gap-3 text-charcoal-700">
            <IconComponent className="h-5 w-5 shrink-0 text-teal-700" />
            <span className="text-sm">{amenity.name}</span>
          </div>
        )
      })}
    </div>
  )
}

function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
