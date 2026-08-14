import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

export function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null // AppProviders-level splash could replace this later

  if (!user) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
  }

  return <Outlet />
}
