import { Link } from 'react-router-dom'
import { CalendarCheck, Users, MapPin } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useAuth } from '@/features/auth/AuthContext'
import { useMyBookings } from '@/features/bookings/queries'
import { formatDateRange } from '@/utils/dates'
import { formatKES } from '@/utils/currency'

export default function MyBookings() {
  const { user } = useAuth()
  const { data: bookings, isLoading, isError } = useMyBookings(user?.id)

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <SEO title="My Bookings" description="Your booking enquiries with Nataka Holiday Homes." />

      <h1 className="font-display text-3xl font-medium text-teal-900 md:text-4xl">My bookings</h1>
      <p className="mt-2 text-charcoal-500">Enquiries you've sent, and where they stand.</p>

      {isError && (
        <p className="mt-8 rounded-card bg-coral-500/10 p-6 text-sm text-coral-500">
          Something went wrong loading your bookings. Please try again.
        </p>
      )}

      {!isError && (
        <div className="mt-8 flex flex-col gap-4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-card bg-sand-200" />
            ))}

          {!isLoading && bookings?.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-card bg-sand-100 py-16 text-center">
              <CalendarCheck className="h-10 w-10 text-sand-300" />
              <p className="text-charcoal-500">You haven't sent any booking enquiries yet.</p>
              <Link
                to="/holiday-homes"
                className="rounded-full bg-teal-900 px-6 py-2.5 text-sm font-medium text-sand-50 hover:bg-teal-800"
              >
                Browse holiday homes
              </Link>
            </div>
          )}

          {bookings?.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-card border border-sand-200 bg-sand-50 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5">
                {booking.properties ? (
                  <Link
                    to={`/stays/${booking.properties.slug}`}
                    className="flex items-center gap-1.5 font-display text-lg font-medium text-teal-900 hover:underline"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    {booking.properties.title}
                  </Link>
                ) : (
                  <span className="font-display text-lg font-medium text-charcoal-500">
                    Property no longer available
                  </span>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4" />
                    {formatDateRange(booking.check_in, booking.check_out)} · {booking.nights} night
                    {booking.nights === 1 ? '' : 's'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {booking.guests} guest{booking.guests === 1 ? '' : 's'}
                  </span>
                </div>

                {booking.estimated_total !== null && (
                  <span className="font-figures text-sm text-charcoal-700">
                    Estimated total: {formatKES(booking.estimated_total)}
                  </span>
                )}
              </div>

              <div className="shrink-0">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
