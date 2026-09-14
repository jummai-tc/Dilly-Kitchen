/**
 * Fills in and submits both public forms in a real browser, then confirms the
 * rows they produced in the database.
 *
 * This is the end-to-end check: not the payload a script made up, but whatever
 * the actual React components send when a person types into them and presses
 * the button. It drives Chrome over the DevTools Protocol.
 *
 * Requires the dev server to be running (`npm run dev`).
 *
 * Usage:  npm run verify:forms
 */
import { readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9222

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --------------------------------------------------------------- browser
const profile = mkdtempSync(path.join(tmpdir(), 'dilly-chrome-'))
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

async function waitForDevtools() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (response.ok) return
    } catch {
      /* not up yet */
    }
    await sleep(200)
  }
  throw new Error('Chrome DevTools did not become available.')
}

let socket
let nextId = 1
const pending = new Map()

/** One DevTools command, resolved by id. */
function send(method, params = {}) {
  const id = nextId++
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

/** Evaluates an expression in the page and returns its value. */
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? 'evaluation failed')
  }
  return result.result.value
}

async function goto(url) {
  await send('Page.navigate', { url })
  // The pages fetch their content after mount; give that time to settle.
  await sleep(2500)
}

/**
 * React tracks input values internally, so assigning `.value` is ignored. The
 * native setter plus a bubbled event is what a real keystroke looks like to it.
 */
const FILL_HELPER = `
  window.__fill = (name, value) => {
    const el = document.querySelector('[name="' + name + '"]')
    if (!el) return 'missing:' + name
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
      : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return 'ok'
  }
  window.__submit = () => {
    const form = document.querySelector('form')
    form.requestSubmit()
    return 'submitted'
  }
  window.__notice = () => {
    const el = document.querySelector('[role="status"][aria-live="polite"]')
    return el ? el.innerText : ''
  }
  'ready'
`

/** Fills every field, submits, and waits for the result panel to appear. */
async function fillAndSubmit(route, fields) {
  await goto(`${BASE}${route}`)
  await evaluate(FILL_HELPER)

  for (const [name, value] of Object.entries(fields)) {
    const result = await evaluate(`window.__fill(${JSON.stringify(name)}, ${JSON.stringify(value)})`)
    if (result !== 'ok') throw new Error(`could not fill "${name}" (${result})`)
  }

  await evaluate('window.__submit()')

  for (let i = 0; i < 40; i += 1) {
    await sleep(300)
    const notice = await evaluate('window.__notice()')
    if (notice && /sent|Almost there|could not|not saved/i.test(notice)) return notice
  }
  return ''
}

await waitForDevtools()
const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
const page = targets.find((t) => t.type === 'page')
socket = new WebSocket(page.webSocketDebuggerUrl)
socket.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  }
}
await new Promise((resolve, reject) => {
  socket.onopen = resolve
  socket.onerror = () => reject(new Error('Could not connect to Chrome.'))
})
await send('Page.enable')
await send('Runtime.enable')

// --------------------------------------------------------------- the forms
const marker = `formtest-${Date.now().toString(36)}`
const testEmail = `${marker}@example.com`
const eventDate = new Date(Date.now() + 45 * 86400_000).toISOString().slice(0, 10)

console.log(`Submitting both forms in a real browser at ${BASE}\n`)

console.log('Contact form (/contact)')
let contactNotice = ''
try {
  contactNotice = await fillAndSubmit('/contact', {
    fullName: 'Ada Verification',
    email: testEmail,
    phone: '07700 900123',
    subject: 'Table booking',
    message: 'Testing the contact form end to end. Table for four on Friday evening, please.',
  })
  record(/Message sent/i.test(contactNotice), 'the form reports success to the visitor',
    contactNotice.split('\n')[0])
} catch (error) {
  record(false, 'contact form submitted', error.message)
}

console.log('\nCatering enquiry form (/catering)')
let cateringNotice = ''
try {
  cateringNotice = await fillAndSubmit('/catering', {
    fullName: 'Ada Verification',
    email: testEmail,
    phone: '07700 900123',
    eventType: 'Wedding',
    eventDate,
    guestCount: '51 – 100 guests',
    preferredDishes: 'Party jollof, egusi with assorted meat, beef suya, puff puff',
    additionalInfo: 'Hall in Feltham, serving from 6pm. Two guests are vegetarian.',
  })
  record(/Message sent/i.test(cateringNotice), 'the form reports success to the visitor',
    cateringNotice.split('\n')[0])
} catch (error) {
  record(false, 'catering form submitted', error.message)
}

// Validation must stop a bad submission before it ever reaches the network.
console.log('\nClient-side validation')
try {
  await goto(`${BASE}/contact`)
  await evaluate(FILL_HELPER)
  await evaluate(`window.__fill('fullName', 'x')`)
  await evaluate(`window.__fill('email', 'not-an-email')`)
  await evaluate('window.__submit()')
  await sleep(1200)
  const invalid = await evaluate(
    `document.querySelectorAll('[aria-invalid="true"]').length`,
  )
  const notice = await evaluate('window.__notice()')
  record(invalid > 0 && !/Message sent/i.test(notice),
    'an invalid form is blocked and the bad fields are flagged',
    `${invalid} field(s) marked invalid`)
} catch (error) {
  record(false, 'validation check ran', error.message)
}

socket.close()
chrome.kill()
// Chrome keeps writing to its profile as it shuts down, so wait for the process
// to actually exit before removing the directory.
await new Promise((resolve) => {
  chrome.once('exit', resolve)
  setTimeout(resolve, 4000)
})
try {
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
} catch {
  /* a leftover temp profile is harmless; never fail the run over it */
}

// --------------------------------------------------------------- the rows
console.log('\nWhat actually reached the database')
const stored = readFileSync(path.join(root, 'supabase/.admin-password.local'), 'utf8').split('\n')
const admin = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
await admin.auth.signInWithPassword({ email: stored[0].trim(), password: stored[1].trim() })

{
  const { data } = await admin.from('contact_messages').select('*').eq('email', testEmail)
  const row = data?.[0]
  record(Boolean(row), 'the contact message was saved', row ? `id ${row.id.slice(0, 8)}…` : 'not found')
  if (row) {
    record(row.name === 'Ada Verification' && row.subject === 'Table booking'
      && row.phone === '07700 900123' && row.message.startsWith('Testing the contact form'),
      'every field arrived exactly as typed',
      `${row.name} · ${row.subject} · ${row.phone}`)
    record(row.status === 'new', 'status was pinned to "new" by the insert policy', row.status)
  }
}
{
  const { data } = await admin.from('catering_enquiries').select('*').eq('email', testEmail)
  const row = data?.[0]
  record(Boolean(row), 'the catering enquiry was saved', row ? `id ${row.id.slice(0, 8)}…` : 'not found')
  if (row) {
    record(row.name === 'Ada Verification' && row.event_type === 'Wedding'
      && row.guest_count === '51 – 100 guests' && row.event_date === eventDate
      && row.preferred_dishes.startsWith('Party jollof'),
      'every field arrived exactly as typed',
      `${row.event_type} · ${row.event_date} · ${row.guest_count}`)
    record(row.notes.startsWith('Hall in Feltham'), 'the free-text notes were stored',
      `${row.notes.slice(0, 40)}…`)
  }
}

// Leave the owner's inbox as it was found.
for (const table of ['contact_messages', 'catering_enquiries']) {
  await admin.from(table).delete().eq('email', testEmail)
  const { count } = await admin.from(table).select('id', { count: 'exact', head: true })
  console.log(`  (removed the test row from ${table}; ${count} real row(s) remain)`)
}
await admin.auth.signOut()

console.log(`\n${'─'.repeat(64)}`)
console.log(`${passed} passed, ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
