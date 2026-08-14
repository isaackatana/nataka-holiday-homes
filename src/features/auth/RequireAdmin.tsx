import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

export function RequireAdmin() {
  const { user, profile, loading, profileLoading } = useAuth()
  const location = useLocation()

  if (loading || (user && profileLoading)) return null

  if (!user) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
