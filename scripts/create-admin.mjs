/**
 * Creates the first admin account, using only the public anon key — no service
 * role key is involved at any point.
 *
 * Two steps, because becoming an admin deliberately has no self-service path:
 *   1. this script signs the account up through the normal public auth endpoint;
 *   2. `supabase/migrations/*_bootstrap_admin.sql` adds that email to the
 *      `admin_users` allow-list, which is what `is_admin()` actually checks.
 *
 * Signing up therefore grants nothing on its own. After the first admin exists,
 * signups are turned off project-wide and further admins are added from the
 * Supabase dashboard.
 *
 * Usage:  node scripts/create-admin.mjs <email> [password]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
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
const [email, providedPassword] = process.argv.slice(2)

if (!email) {
  console.error('Usage: node scripts/create-admin.mjs <email> [password]')
  process.exit(1)
}

/** Meets the project's password policy: upper, lower, digit and symbol. */
function strongPassword() {
  return `${randomBytes(12).toString('base64url')}aA1!`
}

const password = providedPassword ?? strongPassword()
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

const { data, error } = await supabase.auth.signUp({ email, password })

if (error) {
  console.error(`✗ Could not create the account: ${error.message}`)
  process.exit(1)
}

// The password is written to a gitignored file rather than left only in the
// terminal, so it is not lost before it can be changed.
const passwordFile = path.join(root, 'supabase/.admin-password.local')
writeFileSync(passwordFile, `${email}\n${password}\n`, { mode: 0o600 })

console.log(`✓ Auth account created for ${email}`)
console.log(`  user id: ${data.user?.id ?? '(pending confirmation)'}`)
console.log(`  password written to supabase/.admin-password.local (gitignored)`)
console.log('')
console.log('  This account is NOT an admin yet — run `supabase db push` to apply')
console.log('  the bootstrap migration that adds it to the admin_users allow-list.')
