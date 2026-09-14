/**
 * Emits `supabase/migrations/*_seed_content.sql` from the TypeScript data in
 * `src/data`, so the database is seeded with exactly the content the site
 * already ships — no re-typing, no drift.
 *
 * Run with:  npm run seed:generate
 *
 * The generated file upserts, so re-running it refreshes the content this repo
 * owns. Owner-editable rows (site_links, site_settings) are inserted only when
 * missing, so an admin edit is never reverted. Enquiries are never touched.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const from = (rel) => import(path.join(root, rel))

const { menuCategories, menuItems, allergenNotice } = await from('src/data/menu.ts')
const { galleryItems } = await from('src/data/gallery.ts')
const { testimonials, isPlaceholderSet } = await from('src/data/testimonials.ts')
const { storySections } = await from('src/data/story.ts')
const { cateringOptions } = await from('src/data/catering.ts')
const { externalLinks, whatsappMessages, siteConfig } = await from('src/config/site.ts')

/** SQL literal for a string, or NULL for null/undefined. */
const s = (value) =>
  value === null || value === undefined ? 'null' : `'${String(value).replace(/'/g, "''")}'`

/** SQL literal for a number, or NULL. */
const n = (value) => (value === null || value === undefined ? 'null' : String(value))

const bool = (value) => (value ? 'true' : 'false')

/** text[] / integer[] literal. */
const arr = (values, type = 'text') =>
  !values || values.length === 0
    ? `'{}'::${type}[]`
    : `array[${values.map((v) => (type === 'text' ? s(v) : n(v))).join(', ')}]::${type}[]`

/**
 * One `insert … on conflict do update` statement.
 * `conflictKey` is excluded from the update list — you cannot overwrite the key
 * you matched on.
 */
function upsert(table, columns, rows, { conflictKey = 'id', onConflict = 'update' } = {}) {
  const values = rows.map((row) => `  (${columns.map((c) => row[c]).join(', ')})`).join(',\n')
  const resolution =
    onConflict === 'nothing'
      ? // Owner-editable rows: seeding must never revert a URL set in the admin
        // panel, so an existing key is left exactly as it is.
        [`on conflict (${conflictKey}) do nothing`]
      : [
          `on conflict (${conflictKey}) do update set`,
          columns
            .filter((c) => c !== conflictKey)
            .map((c) => `  ${c} = excluded.${c}`)
            .join(',\n'),
        ]
  return [
    `insert into public.${table} (${columns.join(', ')}) values`,
    values,
    ...resolution,
    ';',
    '',
  ].join('\n')
}

const out = [
  '-- ============================================================================',
  '-- Seed content — GENERATED FILE, do not edit by hand.',
  '--',
  '-- Regenerate with `npm run seed:generate` after changing anything in src/data.',
  '-- Re-running is safe: content rows are upserted, enquiries are never touched.',
  '-- ============================================================================',
  '',
]

// ---------------------------------------------------------------- menu
out.push(
  upsert(
    'menu_categories',
    ['id', 'name', 'blurb', 'note', 'sort_order'],
    menuCategories.map((c, i) => ({
      id: s(c.id),
      name: s(c.name),
      blurb: s(c.blurb),
      note: s(c.note ?? null),
      sort_order: n(i),
    })),
  ),
)

out.push(
  upsert(
    'menu_items',
    [
      'id', 'category_id', 'name', 'description', 'price', 'price_note',
      'image_path', 'image_widths', 'image_aspect_ratio', 'image_alt',
      'dietary', 'spice_level', 'options', 'is_featured', 'sort_order',
    ],
    menuItems.map((item, i) => ({
      id: s(item.id),
      category_id: s(item.categoryId),
      name: s(item.name),
      description: s(item.description),
      price: n(item.price),
      price_note: s(item.priceNote ?? null),
      image_path: s(item.image?.base ?? null),
      image_widths: arr(item.image?.widths, 'integer'),
      image_aspect_ratio: n(item.image?.aspectRatio ?? null),
      image_alt: s(item.image?.alt ?? null),
      dietary: arr(item.dietary),
      spice_level: n(item.spiceLevel),
      options: arr(item.options),
      is_featured: bool(item.isFeatured),
      sort_order: n(i),
    })),
  ),
)

// ---------------------------------------------------------------- gallery
out.push(
  upsert(
    'gallery_items',
    [
      'id', 'type', 'title', 'caption', 'image_path', 'image_widths',
      'aspect_ratio', 'alt', 'video_path', 'sort_order',
    ],
    galleryItems.map((item, i) => ({
      id: s(item.id),
      type: s(item.type),
      title: s(item.title),
      caption: s(item.caption),
      image_path: s(item.image.base),
      image_widths: arr(item.image.widths, 'integer'),
      aspect_ratio: n(item.image.aspectRatio),
      alt: s(item.image.alt),
      video_path: s(item.videoSrc ?? null),
      sort_order: n(i),
    })),
  ),
)

// ---------------------------------------------------------------- testimonials
out.push(
  upsert(
    'testimonials',
    ['id', 'quote', 'author', 'context', 'rating', 'is_placeholder', 'sort_order'],
    testimonials.map((t, i) => ({
      id: s(t.id),
      quote: s(t.quote),
      author: s(t.author),
      context: s(t.context),
      rating: n(t.rating),
      is_placeholder: bool(isPlaceholderSet),
      sort_order: n(i),
    })),
  ),
)

// ---------------------------------------------------------------- story
out.push(
  upsert(
    'story_sections',
    ['id', 'eyebrow', 'heading', 'paragraphs', 'sort_order'],
    storySections.map((section, i) => ({
      id: s(section.id),
      eyebrow: s(section.eyebrow),
      heading: s(section.heading),
      paragraphs: arr(section.paragraphs),
      sort_order: n(i),
    })),
  ),
)

// ---------------------------------------------------------------- catering
out.push(
  upsert(
    'catering_options',
    ['id', 'title', 'description', 'icon', 'sort_order'],
    cateringOptions.map((option, i) => ({
      id: s(option.id),
      title: s(option.title),
      description: s(option.description),
      icon: s(option.icon),
      sort_order: n(i),
    })),
  ),
)

// ---------------------------------------------------------------- CTA links
/*
 * The two entries the site builds itself rather than reading from
 * `externalLinks`: "Book a table" (a WhatsApp deep link) and "Discover our
 * menu" (an internal route). Seeding them here puts every call to action in
 * one editable place.
 */
const ctaLinks = [
  ...Object.entries(externalLinks).map(([key, link]) => ({
    key,
    label: link.label,
    href: link.href,
    isPlaceholder: link.isPlaceholder,
  })),
  {
    key: 'bookTable',
    label: 'Book a table',
    href: `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessages.booking)}`,
    isPlaceholder: false,
  },
  {
    key: 'discoverMenu',
    label: 'Discover our menu',
    href: '/menu',
    isPlaceholder: false,
  },
]

out.push(
  upsert(
    'site_links',
    ['key', 'label', 'href', 'is_placeholder', 'sort_order'],
    ctaLinks.map((link, i) => ({
      key: s(link.key),
      label: s(link.label),
      href: s(link.href),
      is_placeholder: bool(link.isPlaceholder),
      sort_order: n(i),
    })),
    { conflictKey: 'key', onConflict: 'nothing' },
  ),
)

// ---------------------------------------------------------------- settings
const settings = {
  allergen_notice: allergenNotice,
  whatsapp_number: siteConfig.contact.whatsappNumber,
  whatsapp_messages: whatsappMessages,
  opening_hours: siteConfig.openingHours,
}

out.push(
  upsert(
    'site_settings',
    ['key', 'value'],
    Object.entries(settings).map(([key, value]) => ({
      key: s(key),
      value: `${s(JSON.stringify(value))}::jsonb`,
    })),
    { conflictKey: 'key', onConflict: 'nothing' },
  ),
)

const target = path.join(root, 'supabase/migrations/20260831090300_seed_content.sql')
writeFileSync(target, out.join('\n'))
console.log(`Wrote ${path.relative(root, target)}`)
console.log(
  `  ${menuCategories.length} categories, ${menuItems.length} menu items, ` +
    `${galleryItems.length} gallery items, ${testimonials.length} testimonials,`,
)
console.log(
  `  ${storySections.length} story sections, ${cateringOptions.length} catering options, ` +
    `${ctaLinks.length} links, ${Object.keys(settings).length} settings`,
)
