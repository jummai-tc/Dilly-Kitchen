/**
 * Fails the build if anything secret reached `dist/`.
 *
 * The browser bundle is public: every byte of it is downloadable by anyone who
 * visits the site. The Supabase *publishable* key belongs there and is expected;
 * a service role key, a database password or a JWT minted for `service_role`
 * would be a full bypass of Row Level Security.
 *
 * Matches on key *values* rather than the word "secret", because libraries
 * legitimately contain strings like `startsWith('sb_secret_')` in their own
 * key-validation code.
 *
 * Usage:  npm run scan:secrets   (also runs as part of `npm run build`)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

const patterns = [
  { name: 'Supabase secret key', re: /sb_secret_[A-Za-z0-9_-]{16,}/g },
  // A Supabase JWT carries its role in the base64 payload; `service_role`
  // base64-encodes to a fragment containing "c2VydmljZV9yb2xl".
  { name: 'service_role JWT', re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]*c2VydmljZV9yb2xl[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+/g },
  { name: 'Postgres connection string', re: /postgres(?:ql)?:\/\/[^\s"'`]*:[^\s"'`@]+@/g },
  { name: 'service role env var with a value', re: /SERVICE_ROLE_KEY["'`\s]*[:=]["'`\s]*[A-Za-z0-9._-]{16,}/g },
]

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.(js|css|html|json|map|txt|xml)$/.test(entry)) out.push(full)
  }
  return out
}

let files
try {
  files = walk(dist)
} catch {
  console.error('✗ No dist/ directory — run `vite build` first.')
  process.exit(1)
}

const findings = []
for (const file of files) {
  const content = readFileSync(file, 'utf8')
  for (const { name, re } of patterns) {
    for (const match of content.match(re) ?? []) {
      findings.push({ file: path.relative(root, file), name, match: `${match.slice(0, 24)}…` })
    }
  }
}

if (findings.length > 0) {
  console.error(`✗ Secret material found in the published bundle:\n`)
  for (const f of findings) console.error(`  ${f.file}\n    ${f.name}: ${f.match}`)
  console.error('\nRemove it — anything in dist/ is downloadable by every visitor.')
  process.exit(1)
}

const publishable = files.some((f) => /sb_publishable_|VITE_SUPABASE/.test(readFileSync(f, 'utf8')))
console.log(`✓ ${files.length} built files scanned — no secret keys, passwords or connection strings.`)
console.log(`  (the publishable key is present${publishable ? '' : ' — NOT FOUND, check .env.local'}, which is correct: RLS constrains it)`)
process.exit(0)
