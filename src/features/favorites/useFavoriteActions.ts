import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { useFavoritesToggle } from '@/features/favorites/queries'

/**
 * Every page that renders a grid of PropertyCards needs the same three
 * things: whether each card is favorited, a toggle handler, and a
 * redirect-to-login fallback for signed-out visitors clicking the heart.
 * Centralizing it here means that logic is defined once, not copy-pasted
 * across Home, Holiday Homes, and the property detail page's related grid.
 */
export function useFavoriteActions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { isFavorited, toggleFavorite } = useFavoritesToggle(user?.id)

  function handleToggle(propertyId: string) {
    if (!user) {
      navigate('/login', { state: { redirectTo: location.pathname + location.search } })
      return
    }
    toggleFavorite(propertyId)
  }

  return { isFavorited, handleToggle }
}
