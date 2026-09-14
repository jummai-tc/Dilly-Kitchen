/// <reference types="vite/client" />

/**
 * Every value the browser bundle is allowed to know about.
 *
 * Only `VITE_`-prefixed variables are inlined by Vite, and only the two below
 * exist. The Supabase *service role* key must never appear here, in `.env.local`
 * with a `VITE_` prefix, or anywhere else the client can reach — it bypasses
 * Row Level Security entirely.
 */
interface ImportMetaEnv {
  /** e.g. https://<project-ref>.supabase.co */
  readonly VITE_SUPABASE_URL?: string
  /** The anon/publishable key. Safe in the browser — RLS constrains it. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
