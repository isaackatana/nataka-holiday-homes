import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-950 px-6">
      <div className="w-full max-w-md rounded-card bg-sand-50 p-10 shadow-card">
        <Link to="/" className="font-display text-xl font-medium text-teal-900">
          Nataka Holidays
        </Link>
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
