/**
 * Admin authentication context.
 *
 * `isAdmin` is not decided in the browser — it is the result of the
 * `public.is_admin()` function, which checks the `admin_users` allow-list
 * server-side. The client flag only decides what to *render*; every write is
 * independently refused by Row Level Security, so tampering with it in devtools
 * buys nothing.
 */
import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthValue {
  session: Session | null
  user: User | null
  /** Confirmed server-side via the `is_admin()` RPC. */
  isAdmin: boolean
  /** True while the session is being restored or the admin check is in flight. */
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>.')
  return value
}
