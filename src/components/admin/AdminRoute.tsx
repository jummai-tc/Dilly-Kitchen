/**
 * Entry point for `/admin` — the only place the admin bundle is reached from.
 *
 * Kept in its own module so `App.tsx` can lazy-load it: nothing here, including
 * the Supabase auth session code, is part of the bundle a public visitor
 * downloads.
 */
import { AuthProvider } from '@/context/AuthProvider'
import { AdminPage } from '@/pages/AdminPage'
import { RequireAdmin } from './RequireAdmin'

export function AdminRoute() {
  return (
    <AuthProvider>
      <RequireAdmin>
        <AdminPage />
      </RequireAdmin>
    </AuthProvider>
  )
}
