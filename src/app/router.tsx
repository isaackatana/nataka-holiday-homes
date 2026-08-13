import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

import Home from '@/pages/public/Home'
import HolidayHomes from '@/pages/public/HolidayHomes'
import PropertyDetails from '@/pages/public/PropertyDetails'
import Experiences from '@/pages/public/Experiences'
import About from '@/pages/public/About'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'

import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

import Favorites from '@/pages/account/Favorites'
import MyBookings from '@/pages/account/MyBookings'
import Profile from '@/pages/account/Profile'

import Dashboard from '@/pages/admin/Dashboard'
import AdminProperties from '@/pages/admin/Properties'
import PropertyEditor from '@/pages/admin/PropertyEditor'
import AdminBookings from '@/pages/admin/Bookings'
import AdminCustomers from '@/pages/admin/Customers'
import AdminReviews from '@/pages/admin/Reviews'
import AdminExperiences from '@/pages/admin/Experiences'
import AdminSettings from '@/pages/admin/Settings'

// NOTE: /favorites, /my-bookings, /profile, and every /admin/* route will be
// wrapped in <RequireAuth> / <RequireAdmin> guards once auth lands (Step 7).
// Left unguarded here so the route tree itself can be reviewed and built
// against before authentication exists.
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/holiday-homes', element: <HolidayHomes /> },
      { path: '/stays/:slug', element: <PropertyDetails /> },
      { path: '/experiences', element: <Experiences /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/my-bookings', element: <MyBookings /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'properties', element: <AdminProperties /> },
      { path: 'properties/new', element: <PropertyEditor /> },
      { path: 'properties/:id/edit', element: <PropertyEditor /> },
      { path: 'bookings', element: <AdminBookings /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'experiences', element: <AdminExperiences /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
