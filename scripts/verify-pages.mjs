/**
 * Renders the real site in headless Chrome and checks that what reaches the
 * page came from Supabase.
 *
 * The trick that makes this meaningful: every service falls back to the bundled
 * copy in `src/data` when the backend is unreachable, so simply seeing "Jollof
 * Rice" on the menu proves nothing. This script first writes markers into the
 * database that exist nowhere in the repo, asserts they appear in the rendered
 * DOM, then puts the original values back.
 *
 * Requires the dev server to be running (`npm run dev`).
 *
 * Usage:  npm run verify:pages
 */
import { readFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const execFileAsync = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

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
const stored = readFileSync(path.join(root, 'supabase/.admin-password.local'), 'utf8').split('\n')
const admin = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
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

/** Renders a route with JS executed and returns the resulting DOM. */
async function render(route) {
  const { stdout } = await execFileAsync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      // Lets the data fetches resolve before the DOM is captured.
      '--virtual-time-budget=9000',
      '--dump-dom',
      `${BASE}${route}`,
    ],
    { maxBuffer: 40 * 1024 * 1024 },
  )
  return stdout
}

const { error: signInError } = await admin.auth.signInWithPassword({
  email: stored[0].trim(),
  password: stored[1].trim(),
})
if (signInError) {
  console.error(`✗ Could not sign in to plant markers: ${signInError.message}`)
  process.exit(1)
}

const token = `dbcheck${Date.now().toString(36)}`
const restore = []

console.log(`Rendering ${BASE} in headless Chrome\n`)

/**
 * Writes a value that exists nowhere in `src/data`, and registers the undo.
 * A missing row is reported rather than thrown, so one bad id cannot abort the
 * run and leave markers behind in the database.
 */
async function plant(table, key, id, column, value) {
  const { data, error } = await admin.from(table).select(column).eq(key, id).single()
  if (error || !data) {
    record(false, `could not plant a marker in ${table}.${column}`, error?.message ?? `no row "${id}"`)
    return false
  }
  const original = data[column]
  restore.push(() => admin.from(table).update({ [column]: original }).eq(key, id))
  const { error: writeError } = await admin.from(table).update({ [column]: value }).eq(key, id)
  if (writeError) {
    record(false, `could not plant a marker in ${table}.${column}`, writeError.message)
    return false
  }
  return true
}

// --------------------------------------------------------------- plant
{
  const { data } = await admin.from('site_settings').select('value').eq('key', 'allergen_notice').single()
  restore.push(() => admin.from('site_settings').update({ value: data.value }).eq('key', 'allergen_notice'))
  await admin.from('site_settings').update({ value: `${data.value} ${token}` }).eq('key', 'allergen_notice')
}
{
  const { data } = await admin.from('site_links').select('href, is_placeholder').eq('key', 'uberEats').single()
  restore.push(() => admin.from('site_links').update(data).eq('key', 'uberEats'))
  await admin.from('site_links')
    .update({ href: `https://www.ubereats.com/${token}`, is_placeholder: false })
    .eq('key', 'uberEats')
}
await plant('menu_items', 'id', 'jollof-fried-rice-chicken', 'name', `Jollof Rice ${token}`)
await plant('gallery_items', 'id', 'beef-suya', 'title', `Beef Suya ${token}`)
await plant('story_sections', 'id', 'our-beginning', 'heading', `Our Beginning ${token}`)
await plant('catering_options', 'id', 'weddings', 'title', `Weddings ${token}`)
await plant('testimonials', 'id', 'sample-1', 'quote', `A review from the database ${token}`)

// --------------------------------------------------------------- assert
try {
  console.log('Pages serving live database content')

  const home = await render('/')
  record(home.includes(token), 'Home — featured dish name comes from menu_items')
  record((home.match(new RegExp(token, 'g')) ?? []).length >= 2,
    'Home — gallery, testimonial and catering sections are live too',
    `${(home.match(new RegExp(token, 'g')) ?? []).length} live values on the page`)
  record(home.includes(`ubereats.com/${token}`),
    'Home — "Order on Uber Eats" uses the URL set in the database')

  const menu = await render('/menu')
  record(menu.includes(`Jollof Rice ${token}`), 'Menu — dishes come from menu_items')
  record(menu.includes(token) && menu.includes('kitchen that handles peanuts'),
    'Menu — allergen notice comes from site_settings')
  record(menu.includes(`ubereats.com/${token}`), 'Menu — Uber Eats buttons use the database URL')

  const gallery = await render('/gallery')
  record(gallery.includes(`Beef Suya ${token}`), 'Gallery — items come from gallery_items')

  const story = await render('/our-story')
  record(story.includes(`Our Beginning ${token}`), 'Our Story — chapters come from story_sections')

  const catering = await render('/catering')
  record(catering.includes(`Weddings ${token}`), 'Catering — options come from catering_options')
  record(catering.includes('Send enquiry'), 'Catering — the enquiry form is on the page')

  const contact = await render('/contact')
  record(contact.includes('Send message'), 'Contact — the message form is on the page')
  record(contact.includes(`ubereats.com/${token}`), 'Contact — Uber Eats button uses the database URL')

  console.log('\nAdmin route')
  const adminPage = await render('/admin')
  record(adminPage.includes('Staff sign-in'), '/admin shows only a sign-in form to a visitor')
  for (const leak of ['Catering enquiries', 'Contact messages', 'Add to the gallery', 'Staff dashboard']) {
    record(!adminPage.includes(leak), `/admin does not render "${leak}" without a session`)
  }
} finally {
  // Always put the real content back, even if an assertion threw — and never
  // let one failing undo skip the others.
  for (const undo of restore.reverse()) {
    try {
      await undo()
    } catch (error) {
      console.error(`  ! could not restore a value: ${error?.message ?? error}`)
    }
  }
  await admin.auth.signOut()
  console.log('\n  (database restored to its original content)')
}

console.log(`\n${'─'.repeat(64)}`)
console.log(`${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
