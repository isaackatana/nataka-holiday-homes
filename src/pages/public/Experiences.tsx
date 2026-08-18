import { SEO } from '@/components/shared/SEO'
import { ExperienceCard } from '@/components/property/ExperienceCard'
import { useExperiences } from '@/features/experiences/queries'

export default function Experiences() {
  const { data: experiences, isLoading, isError } = useExperiences()

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <SEO
        title="Experiences on the Kenyan Coast"
        description="Dolphin tours, snorkeling, skydiving, safaris and airport transfers around Diani Beach and the Kenyan Coast."
        path="/experiences"
      />

      <h1 className="font-display text-3xl font-medium text-teal-900 md:text-4xl">Experiences</h1>
      <p className="mt-2 max-w-2xl text-charcoal-500">
        Local trips and activities we can arrange alongside your stay — from dhow trips to
        Wasini Island to airport transfers.
      </p>

      {isError && (
        <p className="mt-8 rounded-card bg-coral-500/10 p-6 text-sm text-coral-500">
          Something went wrong loading experiences. Please try again.
        </p>
      )}

      {!isError && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/2] animate-pulse rounded-card bg-sand-200" />
            ))}

          {!isLoading && experiences?.length === 0 && (
            <p className="col-span-full py-16 text-center text-charcoal-500">
              No experiences listed yet — check back soon.
            </p>
          )}

          {experiences?.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  )
}
