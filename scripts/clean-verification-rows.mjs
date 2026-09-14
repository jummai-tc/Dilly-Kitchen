/**
 * Deletes the rows the verification scripts write, so the owner's inbox only
 * ever holds real enquiries.
 *
 * Signs in as the admin (using the anon key plus a session, like the dashboard
 * does) and removes only rows that carry the verification marker.
 *
 * Usage:  npm run verify:clean
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv(file) {
  const env = {}
  try {
    for (const line of readFileSync(path.join(root, file), 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim()
    }
  } catch {
    /* optional */
  }
  return env
}

const env = { ...loadEnv('.env.local'), ...process.env }
let email = process.env.ADMIN_EMAIL
let password = process.env.ADMIN_PASSWORD
if (!email || !password) {
  const stored = readFileSync(path.join(root, 'supabase/.admin-password.local'), 'utf8').split('\n')
  email = email || stored[0]?.trim()
  password = password || stored[1]?.trim()
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
if (signInError) {
  console.error(`✗ Could not sign in: ${signInError.message}`)
  process.exit(1)
}

for (const table of ['catering_enquiries', 'contact_messages']) {
  const { data, error } = await supabase.from(table).select('id, name, email')
  if (error) {
    console.error(`✗ ${table}: ${error.message}`)
    continue
  }
  // Only rows this repo's scripts created — never a real customer enquiry.
  const junk = data.filter((row) => row.email.startsWith('verify-') && row.name === 'Connection Test')
  for (const row of junk) await supabase.from(table).delete().eq('id', row.id)
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
  console.log(`  ${table}: removed ${junk.length} test row(s), ${count} real row(s) remaining`)
}

await supabase.auth.signOut()
