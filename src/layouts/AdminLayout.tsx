import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  Users,
  Star,
  Compass,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Properties', to: '/admin/properties', icon: Home },
  { label: 'Bookings', to: '/admin/bookings', icon: CalendarCheck },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Experiences', to: '/admin/experiences', icon: Compass },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

/**
 * Admin shell. Route guarding (RequireAdmin, redirecting non-admins) is
 * wired in Step 7 alongside authentication — this component is the visual
 * frame only.
 */
export function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-sand-100">
      <aside className="flex w-64 flex-col border-r border-sand-200 bg-teal-950 text-sand-100">
        <div className="px-6 py-6">
          <span className="font-display text-lg">Nataka Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-800 text-sand-50'
                    : 'text-sand-300 hover:bg-teal-900 hover:text-sand-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="border-b border-sand-200 bg-sand-50 px-8 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-charcoal-500">
            Admin
          </p>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
