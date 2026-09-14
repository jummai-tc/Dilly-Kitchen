/**
 * The public site's database client.
 *
 * Deliberately PostgREST-only. The public pages read content and insert the two
 * enquiry forms — they never sign anyone in, never touch Storage and never
 * subscribe to anything, so pulling in the whole `supabase-js` umbrella would
 * ship the realtime and auth clients to every visitor for nothing. The admin
 * area, which does need those, builds its own full client in
 * `services/admin/adminClient.ts` and lives in a separate lazy-loaded chunk.
 *
 * Credentials come from environment variables only — see `.env.example`. The
 * anon/publishable key is the *only* key the browser ever sees; it is designed
 * to be public and every table it can reach is constrained by Row Level
 * Security (see `supabase/migrations/*_rls.sql`). The service role key bypasses
 * RLS and must never be given a `VITE_` prefix or referenced from `src/`.
 *
 * When the variables are absent the client is `null` rather than a broken stub,
 * so each service can make an explicit choice: content falls back to the
 * bundled copy in `src/data`, while form submissions report an honest failure
 * instead of pretending a message was delivered.
 */
import { PostgrestClient } from '@supabase/postgrest-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** True when both environment variables are present. */
export const isSupabaseConfigured = Boolean(url && anonKey)

/** The REST endpoint and the headers PostgREST expects, shared with the admin client. */
export const supabaseUrl = url ?? ''
export const supabaseAnonKey = anonKey ?? ''

export type Db = PostgrestClient<any, any, any>

export const db: Db | null = isSupabaseConfigured
  ? new PostgrestClient(`${url}/rest/v1`, {
      headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey!}` },
      fetch: (input, init) => fetch(input, init),
    })
  : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[dilly] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — ' +
      'serving bundled content and disabling form submission. Copy .env.example to .env.local.',
  )
}

/**
 * Runs a read against Supabase, falling back to the copy of the data bundled in
 * `src/data` if Supabase is unconfigured, unreachable or erroring.
 *
 * Content should never leave a visitor staring at an empty page because of a
 * network blip, so failures here are logged and swallowed. Writes deliberately
 * do NOT use this — see `enquiryService`.
 */
export async function readWithFallback<T>(
  label: string,
  read: (client: Db) => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (!db) return fallback()
  try {
    return await read(db)
  } catch (error) {
    console.error(`[dilly] "${label}" failed; using bundled content instead.`, error)
    return fallback()
  }
}

/** Throws when a PostgREST response carries an error, so `readWithFallback` catches it. */
export function unwrap<T>(response: { data: T | null; error: { message: string } | null }): T {
  if (response.error) throw new Error(response.error.message)
  if (response.data === null) throw new Error('No data returned.')
  return response.data
}

/**
 * Turns a Supabase error into something a visitor can act on. Postgres check
 * constraint names and PostgREST codes are never shown as-is.
 */
export function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  if (/row-level security|permission denied/i.test(message)) {
    return 'We could not save that — the request was refused. Please message us on WhatsApp and we will pick it up straight away.'
  }
  if (/violates check constraint|invalid input/i.test(message)) {
    return 'Some of those details were not accepted. Please check the form and try again, or send them to us on WhatsApp.'
  }
  if (/fetch|network|Failed to fetch/i.test(message)) {
    return 'We could not reach our server just now. Please check your connection and try again, or send this to us on WhatsApp.'
  }
  return 'Something went wrong on our side and your message was not saved. Please send it to us on WhatsApp and we will reply straight away.'
}
