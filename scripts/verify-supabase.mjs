/**
 * End-to-end check of the Supabase connection, run against the real project
 * using the same anon key the browser gets.
 *
 * It proves two things:
 *   1. Everything the site needs to read, it can read.
 *   2. Everything the public must NOT be able to do, it cannot do — the RLS
 *      rules are verified by attempting the attack, not by reading the policy.
 *
 * Rows written by the insert checks are tagged and reported so they can be
 * cleared from the admin dashboard afterwards.
 *
 * Usage:  npm run verify:supabase
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Minimal .env parser — avoids a dependency for four lines of work. */
function loadEnv(file) {
  const env = {}
  try {
    for (const line of readFileSync(path.join(root, file), 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '').trim()
    }
  } catch {
    /* file is optional */
  }
  return env
}

const env = { ...loadEnv('.env.local'), ...process.env }
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('✗ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. Copy .env.example to .env.local.')
  process.exit(1)
}

const supabase = createClient(url, anonKey, { auth: { persistSession: false } })

let passed = 0
let failed = 0
const notes = []

function record(ok, label, detail) {
  if (ok) {
    passed += 1
    console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ''}`)
  } else {
    failed += 1
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(title) {
  console.log(`\n${title}`)
}

/** A read the public site depends on. */
async function expectReadable(table, minimumRows) {
  const { data, error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .limit(1)
  if (error) return record(false, `public can read ${table}`, error.message)
  const rows = count ?? data?.length ?? 0
  record(
    rows >= minimumRows,
    `public can read ${table}`,
    `${rows} row${rows === 1 ? '' : 's'}${rows < minimumRows ? ` (expected at least ${minimumRows})` : ''}`,
  )
}

/** Something the public must be refused. An empty result counts as refused. */
async function expectRefused(label, run) {
  const { data, error } = await run()
  if (error) return record(true, label, `refused: ${error.message.slice(0, 60)}`)
  const rows = Array.isArray(data) ? data.length : data ? 1 : 0
  record(rows === 0, label, rows === 0 ? 'refused (no rows)' : `LEAKED ${rows} row(s)`)
}

console.log(`Verifying ${url}\n(using the anon key — exactly what a visitor's browser holds)`)

// ---------------------------------------------------------------- content
section('Content the site reads')
await expectReadable('menu_categories', 9)
await expectReadable('menu_items', 60)
await expectReadable('gallery_items', 15)
await expectReadable('testimonials', 3)
await expectReadable('story_sections', 5)
await expectReadable('catering_options', 6)
await expectReadable('site_links', 9)
await expectReadable('site_settings', 4)

// The menu page groups items by category — a broken FK would show up as dishes
// that never render, so check the join the page actually relies on.
{
  const { data: categories } = await supabase.from('menu_categories').select('id')
  const { data: items } = await supabase.from('menu_items').select('id, category_id')
  const known = new Set((categories ?? []).map((c) => c.id))
  const orphans = (items ?? []).filter((i) => !known.has(i.category_id))
  record(orphans.length === 0, 'every menu item belongs to a visible category',
    orphans.length ? `${orphans.length} orphaned` : `${items?.length ?? 0} items across ${known.size} categories`)
}

// The featured rail on the home page.
{
  const { data, error } = await supabase.from('menu_items').select('id').eq('is_featured', true)
  record(!error && (data?.length ?? 0) > 0, 'featured dishes exist for the home page',
    error ? error.message : `${data?.length ?? 0} featured`)
}

// The CTA rows the buttons read.
{
  const { data, error } = await supabase.from('site_links').select('key, href, is_placeholder')
  const byKey = Object.fromEntries((data ?? []).map((r) => [r.key, r]))
  for (const key of ['uberEats', 'whatsapp', 'bookTable', 'discoverMenu']) {
    const row = byKey[key]
    record(
      Boolean(row),
      `site_links row for "${key}"`,
      error ? error.message : row ? (row.is_placeholder ? 'present (no URL set yet)' : row.href.slice(0, 52)) : 'missing',
    )
  }
}

// ---------------------------------------------------------------- writes
section('Form submissions (what the two forms actually send)')
const stamp = new Date().toISOString()
const marker = `verify-${Date.now().toString(36)}`

{
  // Mirrors submitCateringEnquiry() field for field.
  const eventDate = new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10)
  const { error } = await supabase.from('catering_enquiries').insert({
    name: 'Connection Test',
    email: `${marker}@example.com`,
    phone: '07000 000000',
    event_type: 'Birthday',
    event_date: eventDate,
    guest_count: '21 – 50 guests',
    preferred_dishes: 'Party jollof, beef suya, puff puff',
    notes: `Automated connection check at ${stamp}. Safe to delete.`,
    status: 'new',
  })
  record(!error, 'catering enquiry saves', error ? error.message : `inserted as ${marker}@example.com`)
  if (!error) notes.push(`catering_enquiries: ${marker}@example.com`)
}

{
  // Mirrors submitContactMessage() field for field.
  const { error } = await supabase.from('contact_messages').insert({
    name: 'Connection Test',
    email: `${marker}@example.com`,
    phone: '07000 000000',
    subject: 'General enquiry',
    message: `Automated connection check at ${stamp}. Safe to delete.`,
    status: 'new',
  })
  record(!error, 'contact message saves', error ? error.message : `inserted as ${marker}@example.com`)
  if (!error) notes.push(`contact_messages: ${marker}@example.com`)
}

// Validation must be enforced by the database too, not only by the form.
{
  const { error } = await supabase.from('contact_messages').insert({
    name: 'x', email: 'not-an-email', subject: '', message: 'too short', status: 'new',
  })
  record(Boolean(error), 'database rejects an invalid submission',
    error ? `refused: ${error.message.slice(0, 60)}` : 'ACCEPTED BAD DATA')
}

// ---------------------------------------------------------------- RLS
section('What a visitor must NOT be able to do')

await expectRefused('cannot read catering enquiries', () =>
  supabase.from('catering_enquiries').select('id, name, email'))
await expectRefused('cannot read contact messages', () =>
  supabase.from('contact_messages').select('id, name, email'))
await expectRefused('cannot read the admin allow-list', () =>
  supabase.from('admin_users').select('user_id, email'))
await expectRefused('cannot change an enquiry status', () =>
  supabase.from('catering_enquiries').update({ status: 'closed' }).neq('id', '00000000-0000-0000-0000-000000000000').select())
await expectRefused('cannot delete enquiries', () =>
  supabase.from('contact_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000').select())
await expectRefused('cannot add a menu item', () =>
  supabase.from('menu_items').insert({ id: `${marker}-hack`, category_id: 'sides', name: 'Injected', description: '' }).select())
await expectRefused('cannot change menu prices', () =>
  supabase.from('menu_items').update({ price: 0 }).eq('category_id', 'drinks').select())
await expectRefused('cannot delete gallery items', () =>
  supabase.from('gallery_items').delete().neq('id', '__none__').select())
await expectRefused('cannot repoint a call-to-action link', () =>
  supabase.from('site_links').update({ href: 'https://example.com/evil' }).eq('key', 'uberEats').select())
await expectRefused('cannot edit site settings', () =>
  supabase.from('site_settings').update({ value: '"tampered"' }).eq('key', 'allergen_notice').select())
await expectRefused('cannot add a testimonial', () =>
  supabase.from('testimonials').insert({ id: `${marker}-fake`, quote: 'Injected', author: 'Nobody' }).select())

{
  const { data, error } = await supabase.rpc('is_admin')
  record(!error && data === false, 'is_admin() is false for an anonymous visitor',
    error ? error.message : String(data))
}

// ---------------------------------------------------------------- storage
section('Gallery storage')
{
  /*
   * Uses a real 1x1 PNG with an allowed MIME type on purpose. A .txt file would
   * be turned away by the bucket's MIME filter, which would prove nothing about
   * the policy — this has to be a file the bucket would otherwise accept, so
   * that the only thing left to refuse it is the admin-only insert policy.
   */
  const png = Uint8Array.from(atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  ), (c) => c.charCodeAt(0))
  const { error } = await supabase.storage
    .from('gallery')
    .upload(`photos/${marker}.png`, png, { contentType: 'image/png' })
  const blockedByPolicy = error && !/mime type/i.test(error.message)
  record(Boolean(blockedByPolicy), 'anonymous upload of a valid image is refused by policy',
    error ? `refused: ${error.message.slice(0, 60)}` : 'UPLOAD SUCCEEDED — bucket is writable by the public')
  if (!error) {
    // Should be unreachable; clean up rather than leave a stray object behind.
    await supabase.storage.from('gallery').remove([`photos/${marker}.png`])
  }
}
{
  // A public bucket must still be listable/readable so uploaded photos display.
  const { error } = await supabase.storage.from('gallery').list('', { limit: 1 })
  record(!error, 'gallery bucket exists and is readable', error ? error.message : 'ok')
}

// ---------------------------------------------------------------- summary
console.log(`\n${'─'.repeat(64)}`)
console.log(`${passed} passed, ${failed} failed`)
if (notes.length) {
  console.log('\nTest rows written (delete them from /admin when you are done):')
  for (const note of notes) console.log(`  · ${note}`)
}
process.exit(failed === 0 ? 0 : 1)
