/**
 * Verifies the admin half of the connection: sign-in, the `is_admin()` gate,
 * and every write the dashboard performs.
 *
 * Crucially it also reads back the rows the public forms wrote in
 * `verify-supabase.mjs`, field by field — which is what actually proves a form
 * submission was saved correctly, rather than just accepted.
 *
 * Uses the same anon key the browser holds; the elevated access comes purely
 * from being signed in as an allow-listed account.
 *
 * Usage:  npm run verify:admin
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

let passed = 0
let failed = 0

function record(ok, label, detail) {
  if (ok) {
    passed += 1
    console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ''}`)
  } else {
    failed += 1
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

const section = (title) => console.log(`\n${title}`)

console.log(`Verifying the admin path on ${env.VITE_SUPABASE_URL}`)

// ---------------------------------------------------------------- sign-in
section('Sign-in')
{
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  record(!error && Boolean(data.session), `admin can sign in as ${email}`, error?.message)
  if (error) {
    console.log('\nCannot continue without a session.')
    process.exit(1)
  }
}
{
  const { data, error } = await supabase.rpc('is_admin')
  record(!error && data === true, 'is_admin() is true for this account', error?.message ?? String(data))
}

// ---------------------------------------------------------------- the inbox
section('Form submissions read back from the database')
let cateringRow
let contactRow
{
  const { data, error } = await supabase
    .from('catering_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  record(!error, 'admin can read catering enquiries', error ? error.message : `${data.length} row(s)`)
  cateringRow = data?.[0]
}
{
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  record(!error, 'admin can read contact messages', error ? error.message : `${data.length} row(s)`)
  contactRow = data?.[0]
}

// The write tests below update one of the rows the public forms created, so at
// least one has to exist. On a clean database none do — say so plainly here
// rather than dying on `cateringRow.id` a few lines further down.
if (!cateringRow || !contactRow) {
  const missing = [!cateringRow && 'catering_enquiries', !contactRow && 'contact_messages']
    .filter(Boolean)
    .join(' and ')
  const verb = cateringRow || contactRow ? 'is' : 'are'
  console.log(`\nNothing to read back: ${missing} ${verb} empty.`)
  console.log('This script checks the rows the public forms wrote, so it has to run')
  console.log('after the script that writes them. Run the three in order:')
  console.log('\n  npm run verify:supabase   # submits both forms, leaving one row each')
  console.log('  npm run verify:admin      # this script')
  console.log('  npm run verify:clean      # removes those test rows again\n')
  process.exit(1)
}

/** Confirms the values that went in are the values that came out. */
function checkFields(label, row, expected) {
  if (!row) return record(false, label, 'no row found')
  const wrong = Object.entries(expected).filter(([key, value]) => row[key] !== value)
  record(
    wrong.length === 0,
    label,
    wrong.length === 0
      ? Object.keys(expected).join(', ')
      : wrong.map(([k, v]) => `${k}: expected "${v}", got "${row[k]}"`).join('; '),
  )
}

checkFields('catering enquiry stored every field intact', cateringRow, {
  name: 'Connection Test',
  phone: '07000 000000',
  event_type: 'Birthday',
  guest_count: '21 – 50 guests',
  preferred_dishes: 'Party jollof, beef suya, puff puff',
  status: 'new',
})
checkFields('contact message stored every field intact', contactRow, {
  name: 'Connection Test',
  phone: '07000 000000',
  subject: 'General enquiry',
  status: 'new',
})

// ---------------------------------------------------------------- writes
section('Admin writes')
{
  const next = cateringRow?.status === 'new' ? 'contacted' : 'new'
  const { error } = await supabase
    .from('catering_enquiries')
    .update({ status: next })
    .eq('id', cateringRow.id)
  record(!error, 'admin can change an enquiry status', error?.message ?? `set to "${next}"`)
  await supabase.from('catering_enquiries').update({ status: 'new' }).eq('id', cateringRow.id)
}

{
  const id = `verify-dish-${Date.now().toString(36)}`
  const { error: insertError } = await supabase.from('menu_items').insert({
    id, category_id: 'sides', name: 'Verification Dish', description: 'Temporary row.',
    price: 1, spice_level: 0, is_published: false,
  })
  record(!insertError, 'admin can add a menu item', insertError?.message)

  const { error: updateError } = await supabase
    .from('menu_items').update({ price: 2 }).eq('id', id)
  record(!updateError, 'admin can edit a menu item', updateError?.message)

  const { error: deleteError } = await supabase.from('menu_items').delete().eq('id', id)
  record(!deleteError, 'admin can delete a menu item', deleteError?.message ?? 'cleaned up')
}

{
  // Exactly what the Links tab does when the Uber Eats URL is filled in.
  const { data: before } = await supabase
    .from('site_links').select('href, is_placeholder').eq('key', 'uberEats').single()
  const probe = 'https://www.ubereats.com/gb/store/verification-probe'
  const { error } = await supabase
    .from('site_links').update({ href: probe, is_placeholder: false }).eq('key', 'uberEats')
  record(!error, 'admin can set a call-to-action URL', error?.message)

  const { data: after } = await supabase
    .from('site_links').select('href, is_placeholder').eq('key', 'uberEats').single()
  record(after?.href === probe && after?.is_placeholder === false,
    'the new URL is what the public buttons now read', after?.href)

  await supabase.from('site_links')
    .update({ href: before.href, is_placeholder: before.is_placeholder }).eq('key', 'uberEats')
  const { data: restored } = await supabase
    .from('site_links').select('href, is_placeholder').eq('key', 'uberEats').single()
  record(restored?.href === before.href, 'restored to its original value',
    restored?.is_placeholder ? 'back to "coming soon"' : restored?.href)
}

{
  const { error } = await supabase
    .from('site_settings')
    .select('key').eq('key', 'allergen_notice').single()
  record(!error, 'allergen notice setting is present', error?.message)
}

// ---------------------------------------------------------------- storage
section('Gallery upload (what AdminUploadPanel does)')
{
  const png = Uint8Array.from(atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  ), (c) => c.charCodeAt(0))
  const key = `photos/verify-${Date.now().toString(36)}.png`

  const { error: uploadError } = await supabase.storage
    .from('gallery').upload(key, png, { contentType: 'image/png' })
  record(!uploadError, 'admin can upload to the gallery bucket', uploadError?.message ?? key)

  if (!uploadError) {
    const publicUrl = supabase.storage.from('gallery').getPublicUrl(key).data.publicUrl
    const response = await fetch(publicUrl)
    record(response.ok, 'the uploaded file is publicly viewable', `HTTP ${response.status}`)

    // The gallery row the panel writes alongside the file.
    const rowId = `verify-gallery-${Date.now().toString(36)}`
    const { error: rowError } = await supabase.from('gallery_items').insert({
      id: rowId, type: 'photo', title: 'Verification Upload', caption: 'Temporary row.',
      image_path: publicUrl, image_widths: [], aspect_ratio: 1,
      alt: 'Verification upload', is_published: false,
    })
    record(!rowError, 'admin can record the upload in gallery_items', rowError?.message)

    await supabase.from('gallery_items').delete().eq('id', rowId)
    const { error: removeError } = await supabase.storage.from('gallery').remove([key])
    record(!removeError, 'admin can delete an uploaded file', removeError?.message ?? 'cleaned up')
  }
}

await supabase.auth.signOut()

console.log(`\n${'─'.repeat(64)}`)
console.log(`${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
