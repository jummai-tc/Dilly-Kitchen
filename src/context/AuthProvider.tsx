/**
 * Supabase Auth session for the admin area.
 *
 * Deliberately mounted only around the `/admin` routes, so public pages carry
 * no auth listener, no session storage and no extra network calls.
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { adminClient } from '@/services/admin/adminClient'
import { AuthContext } from './authContext'

/** Asks the database whether the current user is on the admin allow-list. */
async function checkIsAdmin(): Promise<boolean> {
  if (!adminClient) return false
  const { data, error } = await adminClient.rpc('is_admin')
  if (error) {
    console.error('[dilly] admin check failed', error)
    return false
  }
  return data === true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  // Nothing to restore when there is no client, so start settled rather than
  // flipping the flag from inside the effect.
  const [isLoading, setIsLoading] = useState(() => adminClient !== null)

  useEffect(() => {
    if (!adminClient) return
    let active = true

    /*
     * Re-checked on every auth change rather than cached against the user id:
     * admin rights can be revoked in the dashboard, and the next sign-in or
     * token refresh should notice.
     */
    async function apply(next: Session | null) {
      if (!active) return
      setSession(next)
      setIsAdmin(next ? await checkIsAdmin() : false)
      if (active) setIsLoading(false)
    }

    adminClient.auth.getSession().then(({ data }) => apply(data.session))

    const { data: subscription } = adminClient.auth.onAuthStateChange((_event, next) => {
      void apply(next)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!adminClient) {
      return { ok: false, message: 'Supabase is not configured, so sign-in is unavailable.' }
    }
    const { error } = await adminClient.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (error) {
      // Never distinguish "no such account" from "wrong password" — that would
      // turn the form into a way to enumerate admin email addresses.
      return { ok: false, message: 'That email and password did not match. Please try again.' }
    }
    return { ok: true, message: 'Signed in.' }
  }, [])

  const signOut = useCallback(async () => {
    await adminClient?.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }, [])

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, isAdmin, isLoading, signIn, signOut }),
    [session, isAdmin, isLoading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
