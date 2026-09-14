/**
 * Route guard for `/admin`.
 *
 * Three gates, in order:
 *   1. Supabase must be configured at all.
 *   2. There must be a session — otherwise the sign-in form is shown.
 *   3. That session must be on the `admin_users` allow-list, confirmed by the
 *      server-side `is_admin()` function.
 *
 * This guard controls what is *rendered*. It is not the security boundary —
 * Row Level Security is, and it refuses admin writes to anyone not on the
 * allow-list regardless of what the browser believes. An ordinary visitor who
 * navigates to /admin gets the sign-in form and nothing else: no admin markup
 * is mounted, and no admin data is ever fetched.
 */
import type { ReactNode } from 'react'
import { useAuth } from '@/context/authContext'
import { Button } from '@/components/ui/Button'
import { AdminLogin } from './AdminLogin'
import { AdminShell } from './AdminShell'
import { isSupabaseConfigured } from '@/services/supabaseClient'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, isAdmin, isLoading, signOut, user } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <AdminShell title="Admin unavailable">
        <p className="text-sm leading-relaxed text-ink-600">
          Supabase is not configured for this build. Set{' '}
          <code className="rounded bg-ink-900/8 px-1.5 py-0.5 text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-ink-900/8 px-1.5 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
          in <code className="rounded bg-ink-900/8 px-1.5 py-0.5 text-xs">.env.local</code> and
          restart the dev server.
        </p>
      </AdminShell>
    )
  }

  if (isLoading) {
    return (
      <AdminShell title="Checking your access…">
        <p role="status" className="text-sm text-ink-600">
          One moment.
        </p>
      </AdminShell>
    )
  }

  if (!session) return <AdminLogin />

  if (!isAdmin) {
    return (
      <AdminShell title="Not an admin account">
        <p className="text-sm leading-relaxed text-ink-600">
          You are signed in as{' '}
          <span className="font-medium text-ink-900">{user?.email}</span>, but that account is not
          on the Dilly Kitchen admin list. Ask an existing admin to add you, then sign in again.
        </p>
        <Button onClick={() => void signOut()} variant="secondary" size="sm" className="mt-6">
          Sign out
        </Button>
      </AdminShell>
    )
  }

  return <>{children}</>
}
