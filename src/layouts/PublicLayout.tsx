import { Outlet, Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Heart, CalendarCheck, User, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { useBusinessSettings } from '@/features/settings/queries'
import { buildWhatsAppLink } from '@/utils/whatsapp'

const NAV_LINKS = [
  { label: 'Holiday Homes', to: '/holiday-homes' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Shared shell for every public-facing route: sticky nav, footer, and the
 * persistent WhatsApp contact button. Real nav/footer content and the
 * WhatsApp deep-link builder land alongside the Home page build (Step 8).
 */
export function PublicLayout() {
  const { user, profile, signOut } = useAuth()
  const { data: settings } = useBusinessSettings()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand-50">
      <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl font-medium text-teal-900">
            Nataka Holiday Homes
          </Link>
          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-charcoal-700 transition-colors hover:text-teal-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/favorites"
                aria-label="Favorites"
                className="text-charcoal-700 transition-colors hover:text-teal-800"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                to="/my-bookings"
                aria-label="My bookings"
                className="text-charcoal-700 transition-colors hover:text-teal-800"
              >
                <CalendarCheck className="h-5 w-5" />
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-charcoal-700 transition-colors hover:text-teal-800"
              >
                <User className="h-5 w-5" />
                {profile?.full_name?.split(' ')[0] ?? 'Account'}
              </Link>
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="text-charcoal-500 transition-colors hover:text-coral-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-teal-900 px-5 py-2 text-sm font-medium text-teal-900 transition-colors hover:bg-teal-900 hover:text-sand-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-sand-200 bg-teal-950 py-12 text-sand-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg">{settings?.business_name ?? 'Nataka Holiday Homes'}</p>
            <p className="mt-2 max-w-md text-sm text-sand-300">
              {settings?.about_blurb ??
                'Villas, apartments and beach houses along Diani Beach and the Kenyan Coast.'}
            </p>
          </div>
          {(settings?.contact_phone || settings?.contact_email || settings?.address) && (
            <div className="flex flex-col gap-1 text-sm text-sand-300">
              {settings.contact_phone && <span>{settings.contact_phone}</span>}
              {settings.contact_email && <span>{settings.contact_email}</span>}
              {settings.address && <span>{settings.address}</span>}
            </div>
          )}
        </div>
      </footer>

      <a
        href={buildWhatsAppLink('Hello Nataka Holiday Homes, I have a question.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-pill bg-teal-700 text-sand-50 shadow-card transition-transform hover:scale-105 hover:shadow-card-hover"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}
