import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyCardSkeleton } from '@/components/property/PropertyCardSkeleton'
import { useAuth } from '@/features/auth/AuthContext'
import { useFavoriteProperties } from '@/features/favorites/queries'
import { useFavoriteActions } from '@/features/favorites/useFavoriteActions'

export default function Favorites() {
  const { user } = useAuth()
  const { data: properties, isLoading, isError } = useFavoriteProperties(user?.id)
  const { isFavorited, handleToggle } = useFavoriteActions()

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <SEO
        title="Your Favorites"
        description="Properties you've saved at Nataka Holiday Homes."
        noindex
      />

      <h1 className="font-display text-3xl font-medium text-teal-900 md:text-4xl">Your favorites</h1>
      <p className="mt-2 text-charcoal-500">Properties you've saved for later.</p>

      {isError && (
        <p className="mt-8 rounded-card bg-coral-500/10 p-6 text-sm text-coral-500">
          Something went wrong loading your favorites. Please try again.
        </p>
      )}

      {!isError && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}

          {!isLoading && properties?.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-4 py-16 text-center">
              <Heart className="h-10 w-10 text-sand-300" />
              <p className="text-charcoal-500">You haven't saved any properties yet.</p>
              <Link
                to="/holiday-homes"
                className="rounded-full bg-teal-900 px-6 py-2.5 text-sm font-medium text-sand-50 hover:bg-teal-800"
              >
                Browse holiday homes
              </Link>
            </div>
          )}

          {properties?.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorited={isFavorited(property.id)}
              onToggleFavorite={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
