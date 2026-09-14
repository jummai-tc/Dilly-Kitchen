# Backend seam — connected to Supabase

Every component reads data through the async functions in this folder — never
directly from `src/data/*`. Those functions now query Supabase, and fall back to
the bundled TypeScript data when the backend is unreachable or unconfigured, so
a network failure degrades the site to its previous behaviour instead of
blanking a page.

## Two clients, on purpose

The public site is **PostgREST-only**. It reads content and inserts the two
enquiry forms — it never signs anyone in, never touches Storage and never
subscribes to anything. Importing the whole `supabase-js` umbrella would ship
the realtime and auth clients to every visitor for nothing (about 50 kB gzipped).

So `supabaseClient.ts` builds a bare `PostgrestClient`, and everything the admin
area needs lives under `services/admin/`, which only the lazy-loaded `/admin`
chunk imports. Keep it that way: importing `services/admin/*` from a public page
would pull `supabase-js` back into the main bundle.

| File                        | Responsibility                                                  |
| --------------------------- | --------------------------------------------------------------- |
| `supabaseClient.ts`         | Public PostgREST client, env vars, fallback + error helpers      |
| `rows.ts`                   | Row types and the snake_case → domain-type mappers               |
| `menuService.ts`            | `menu_categories`, `menu_items`                                  |
| `galleryService.ts`         | `gallery_items` (reads)                                          |
| `testimonialService.ts`     | `testimonials`                                                   |
| `contentService.ts`         | `story_sections`, `catering_options`                             |
| `siteService.ts`            | `site_links` (every call-to-action destination), `site_settings` |
| `enquiryService.ts`         | The two form submissions                                         |
| `admin/adminClient.ts`      | Full `supabase-js` client — auth, Storage, PostgREST             |
| `admin/enquiryAdmin.ts`     | The two enquiry inboxes                                          |
| `admin/galleryAdmin.ts`     | Uploads, publish/hide, delete + the `gallery` Storage bucket     |
| `admin/siteAdmin.ts`        | Saving a call-to-action URL                                      |

Reads use `readWithFallback`, which logs and falls back. Writes deliberately do
**not** fall back: if a form submission fails, the visitor is told plainly and
offered the WhatsApp route with their details pre-filled, so nobody is ever left
believing a message was delivered when it was not.

## Configuration

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable key>
```

Only these two variables exist, and only `VITE_`-prefixed values reach the
browser. **The service role key must never be added to this project** — it
bypasses Row Level Security, and anything prefixed `VITE_` is compiled into the
JavaScript every visitor downloads. `npm run build` runs `scripts/scan-secrets.mjs`,
which fails the build if a secret key, password or connection string reaches
`dist/`.

Schema changes are applied with the Supabase CLI, which authenticates on its own
and needs no key in the repo.

## Schema

Migrations live in `supabase/migrations`:

- `…_schema.sql` — tables, constraints, `is_admin()`, `updated_at` triggers
- `…_rls.sql` — Row Level Security policies and table grants
- `…_storage.sql` — the `gallery` bucket and its policies
- `…_seed_content.sql` — generated from `src/data` by `npm run seed:generate`
- `…_bootstrap_admin.sql` — promotes the first account to admin

Tables:

- `menu_categories(id, name, blurb, note, sort_order, is_published)`
- `menu_items(id, category_id, name, description, price, price_note, image_path, image_widths[], image_aspect_ratio, image_alt, dietary[], spice_level, options[], is_featured, is_published, sort_order)`
- `gallery_items(id, type, title, caption, image_path, image_widths[], aspect_ratio, alt, video_path, sort_order, is_published)`
- `testimonials(id, quote, author, context, rating, is_published, is_placeholder, sort_order)`
- `story_sections(id, eyebrow, heading, paragraphs[], sort_order, is_published)`
- `catering_options(id, title, description, icon, sort_order, is_published)`
- `site_links(key, label, href, is_placeholder, sort_order)`
- `site_settings(key, value jsonb)`
- `catering_enquiries(id, name, email, phone, event_type, event_date, guest_count, preferred_dishes, notes, status, created_at)`
- `contact_messages(id, name, email, phone, subject, message, status, created_at)`
- `admin_users(user_id, email, created_at)`

`image_path` holds either a base path for the responsive files exported by
`scripts/optimize-images.sh` (with `image_widths` listing the sizes on disk), or
the full public URL of a Storage upload (with `image_widths` empty).
`src/lib/images.ts` handles both.

## Row Level Security

RLS is on for every table. The rules, as required:

- **Content tables** — public `select` of published rows; all writes admin-only.
- **Enquiry tables** — public `insert` only. There is no `select`, `update` or
  `delete` policy for `anon`, so a visitor cannot read back any enquiry,
  including their own. The insert policy pins `status` to `'new'`.
- **`admin_users`** — a signed-in user can read only their own row. There is no
  public insert path: membership is granted in the Supabase dashboard.
- **Table grants** are narrowed to match, so `anon` holds `insert` only on the
  enquiry tables. A future policy mistake still could not turn into a public
  read of customer contact details.

Admin status is decided by `public.is_admin()`, a `security definer` function
checking the `admin_users` allow-list. The React guard uses it to choose what to
render; RLS enforces it regardless of what the browser believes.

## Call-to-action destinations

"Order on Uber Eats", "WhatsApp Us", "Book a table", "Discover our menu" and the
social links read their `href` from `site_links` via `SiteContentProvider`, so
the owner sets them in the admin panel with no redeploy. A blank URL keeps the
existing "coming soon" panel rather than shipping a broken link.

## Verification

With the dev server running (`npm run dev`):

| Command                  | Checks                                                        |
| ------------------------ | ------------------------------------------------------------- |
| `npm run verify:supabase` | Public reads, form inserts, and that every forbidden action is actually refused |
| `npm run verify:admin`    | Sign-in, `is_admin()`, admin writes, Storage upload and delete |
| `npm run verify:pages`    | Renders each page in headless Chrome and proves the content came from the database, not the fallback |
| `npm run verify:forms`    | Fills in and submits both forms in a real browser, then checks the saved rows field by field |
| `npm run verify:clean`    | Removes any rows the verification scripts left behind          |
| `npm run scan:secrets`    | Fails if secret material reached `dist/`                       |

## Adding another admin

1. Supabase dashboard → Authentication → Users → **Add user** (public signup is
   disabled project-wide, so this is the only route).
2. Table Editor → `admin_users` → insert a row with that user's `user_id`.
