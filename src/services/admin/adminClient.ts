/**
 * The admin area's full Supabase client — auth, Storage and PostgREST.
 *
 * Imported only from modules the `/admin` route reaches, which `App.tsx` loads
 * as a separate chunk. That is what keeps `supabase-js` (and with it the
 * realtime and auth clients) out of the bundle a public visitor downloads; the
 * public site uses the PostgREST-only client in `../supabaseClient`.
 *
 * Same credentials, same anon key. The elevated access comes entirely from
 * being signed in as an account on the `admin_users` allow-list — Row Level
 * Security, not this client, is what grants it.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '../supabaseClient'

export const adminClient: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // The admin session should survive a refresh, but only in the tab that
        // signed in — nothing about it is shared with the public pages.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'dilly-kitchen-auth',
      },
      global: {
        headers: { 'x-application-name': 'dilly-kitchen-admin' },
      },
    })
  : null

/** Narrows the client for the call sites that cannot proceed without it. */
export function requireAdminClient(): SupabaseClient {
  if (!adminClient) throw new Error('Supabase is not configured.')
  return adminClient
}
