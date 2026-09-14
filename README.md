# Dilly Kitchen — Website (Frontend)

Marketing and menu site for **Dilly Kitchen**, a Nigerian and Pan-African kitchen
at 100 High Street, Feltham, TW13 4EX, London.

This is a **frontend-only** build. There is no database, authentication, payment
processing or admin dashboard. Everything is wired so a backend can be added
later without restructuring the app — see [Connecting a backend](#connecting-a-backend).

---

## Running locally

```bash
npm install     # first time only
npm run dev     # http://localhost:5173
```

Other scripts:

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                        |
| `npm run build`   | Type-checks, then builds to `dist/`               |
| `npm run preview` | Serves the production build locally               |
| `npm run lint`    | Lints with oxlint                                 |

Two maintenance scripts (run manually, not part of the build):

| Script                          | What it does                                       |
| ------------------------------- | -------------------------------------------------- |
| `./scripts/optimize-images.sh`  | Re-exports responsive image sizes into `public/images/` |
| `node scripts/fetch-fonts.mjs`  | Re-downloads the self-hosted font subsets           |

**Requirements:** Node 20.19+ or 22.12+ (built and tested on Node 22.12).

### Deploying

`dist/` is a static bundle — any static host works (Netlify, Vercel, Cloudflare
Pages, S3). Because this is a client-side SPA, the host **must** rewrite unknown
paths to `index.html`, or deep links like `/menu` will 404. `public/_redirects`
handles this for Netlify-style hosts; on other platforms configure the
equivalent SPA fallback.

---

## Tech stack

- **React 19** + **TypeScript** (strict), built with **Vite 8**
- **Tailwind CSS v4** — design tokens live in `src/index.css` under `@theme`
- **React Router 7** for routing
- No UI or icon libraries: components and SVG icons are local, so there is
  nothing to keep in sync and no extra network requests.
- **Self-hosted fonts** (Fraunces + Inter, Latin subsets, in `public/fonts/`) —
  no Google Fonts request on page load, so nothing render-blocks and no visitor
  data leaves the site. Re-download with `node scripts/fetch-fonts.mjs`.

---

## Pages

| Route        | Page             | Contents                                                                                                                                                            |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`          | **Home**         | Hero (the dish corridor, “Every Meal Tells a Story”), intro, six featured dishes, catering preview, gallery preview, testimonials, opening hours + location, closing WhatsApp CTA |
| `/our-story` | **Our Story**    | Five chapters — Our Beginning, Our African Heritage, Our Cooking Philosophy, The Woman Behind Dilly Kitchen, Food Made with Love — plus values and *Meet the Chef*    |
| `/menu`      | **Menu**         | 66 dishes in 9 categories, category filters, live search, dietary/spice labels, per-dish order buttons, allergen notice                                              |
| `/catering`  | **Catering**     | Catering copy, six occasion types, three-step process, validated enquiry form, WhatsApp enquiry                                                                       |
| `/gallery`   | **Gallery**      | 18 photographs in a masonry grid, photo/video filters, accessible lightbox with keyboard navigation, lazy loading                                                     |
| `/contact`   | **Contact**      | Address, hours, WhatsApp, phone, email; four action buttons; map; validated contact form                                                                              |
| `*`          | **404**          | “This plate is empty” — links to every page plus WhatsApp                                                                                                            |

Every page sets its own `<title>`, meta description, canonical URL, Open Graph
and Twitter card tags. `Restaurant` (LocalBusiness) structured data is emitted
site-wide from `src/components/seo/StructuredData.tsx`.

> **SEO note:** this is a client-rendered SPA, so per-route tags are applied
> after JavaScript runs. `index.html` carries sensible defaults for crawlers that
> don't execute JS. For full per-route SEO, add prerendering or SSR when the
> backend goes in.

---

## Project structure

```
src/
├── config/
│   ├── site.ts          ← ALL business details + external links (single source of truth)
│   └── navigation.ts    ← header/footer nav links
├── data/                ← local content, swappable for API responses
│   ├── menu.ts          ← 66 dishes + 9 categories, real prices from the supplied menu
│   ├── gallery.ts       ← 18 photos; `galleryVideos` is empty until videos are supplied
│   ├── catering.ts      ← occasions, event types, guest-count ranges
│   ├── story.ts         ← Our Story chapters + chef bio
│   └── testimonials.ts  ← PLACEHOLDER reviews (see below)
├── services/            ← the backend seam — read services/README.md
├── components/
│   ├── layout/          ← Header (+ mobile drawer), Footer, Layout, WhatsAppFloat, ScrollToTop
│   ├── ui/              ← Button, Container, Section, SectionHeading, Badge, SmartImage,
│   │                       DetailList, ExternalActionButton, Icons, ImageStreamHero
│   ├── forms/           ← Field primitives, CateringEnquiryForm, ContactForm, FormNotice
│   ├── menu/            ← MenuCard (photographed dishes), MenuRow (price-list dishes)
│   ├── gallery/         ← Lightbox, AdminUploadPanel (not routed — see below)
│   ├── home/            ← homepage sections
│   └── seo/             ← Seo, StructuredData
├── hooks/               ← useReveal, useLockBodyScroll, useOnClickOutside, useReducedMotion
├── lib/                 ← utils, images (srcSet builders), validation
└── types/               ← shared domain types
```

### Editing content

- **Business details / links** → `src/config/site.ts` only.
- **Menu** → `src/data/menu.ts`. Prices are `number | null`; `null` renders
  “Price on request” rather than inventing a figure.
- **Photos** → drop optimised files in `public/images/` and reference them from
  the data files. `scripts/optimize-images.sh` regenerates the responsive sizes.

Dishes **with** a photograph render as image cards; dishes **without** one render
as a compact price list. That is deliberate — it avoids a wall of empty
placeholders (the drinks list, for example) and reads like a printed menu.

---

## What still needs to come from the business

These are the only gaps. Each one is a clearly-marked placeholder, never a
broken link or an invented URL.

### 1. External links — `src/config/site.ts` → `externalLinks`

| Link                 | Status                                                                        |
| -------------------- | ----------------------------------------------------------------------------- |
| **Google Reviews**   | `isPlaceholder: true` — buttons open a short “link is being set up” panel offering WhatsApp instead |
| **Instagram / Facebook / TikTok** | `isPlaceholder: true` — footer shows a “Soon” label rather than a dead link |
| **Live domain**      | `siteConfig.url` is `https://www.dillykitchen.co.uk` — update it, and the matching URLs in `public/sitemap.xml` and `public/robots.txt` |

To go live with any of them: paste the URL into `href` and set
`isPlaceholder: false`. Nothing else needs to change.

### 2. Testimonials — `src/data/testimonials.ts`

The three reviews are **written samples, not real customer reviews**. The section
says so on the page (“Sample layout — verified Google reviews will be shown here
once connected”). Replace them with genuine reviews and set
`isPlaceholderSet = false` to remove that label.

### 3. Photography still wanted

Every image on the site was supplied by the business — no stock photos. Dishes
currently without a photograph (they render as price-list rows) include:
Assorted / Catfish pepper soup, Ugba, garnished prawns and snails, Egusi,
Ogbono, Vegetable, Bitterleaf, Oha, Nsala and Fisherman's soups, Isi Ewu,
peppered beef, chicken suya, grilled tilapia, moi moi, gizzard dodo, salad,
ice cream, and the drinks.

Also useful:
- **Video** for the gallery — the Videos filter and player already exist and
  populate automatically once entries are added to `galleryVideos`.
- **A photo of the swallows** (pounded yam, semovita, eba).
- **The chef's name**, if she is happy to be credited — the Meet the Chef
  section currently reads “The Chef & Founder”.
- **Meat Pie price** — it is on the gallery but not the supplied menu, so it
  shows “Price on request”.

### 4. Map pin

`siteConfig.geo` is the shopfront itself (51.4430814, -0.4125028), taken from
the OpenStreetMap node for **Dilly Kitchen, 100 High Street, Feltham, TW13 4EX**
rather than the postcode centroid.

---

## Connecting a backend

Components never import from `src/data/` directly — they go through
`src/services/`, which is the only place that needs to change.
**`src/services/README.md` has the full mapping**, including suggested Supabase
tables and Row Level Security notes. In short:

| File                     | Currently                       | Becomes                                     |
| ------------------------ | ------------------------------- | ------------------------------------------- |
| `menuService.ts`         | returns `data/menu.ts`          | `supabase.from('menu_items').select()`      |
| `galleryService.ts`      | returns `data/gallery.ts`       | `gallery_items` + Storage URLs              |
| `testimonialService.ts`  | returns `data/testimonials.ts`  | `testimonials` table or Google Places API   |
| `enquiryService.ts`      | resolves `{ ok: false, … }`     | `insert()` into `catering_enquiries` / `contact_messages`, then return `{ ok: true }` |

All service functions are already `async`, so no component changes are needed.

**Forms today:** both forms validate fully client-side, then show an honest
notice explaining that online submission is not connected yet, plus a WhatsApp
button pre-filled with everything the visitor typed. Nothing is silently
dropped. When `enquiryService` returns `{ ok: true }`, the existing success UI
takes over automatically.

**Gallery uploads:** `src/components/gallery/AdminUploadPanel.tsx` is a prepared
admin component that is **deliberately not routed or rendered anywhere public**.
Once auth and storage exist, render it behind a protected `/admin` route. Public
visitors can only ever view gallery content.

---

## Accessibility & quality

Verified with automated (axe-core) and manual testing:

- **0 axe violations** across all 7 routes, plus the open mobile drawer, open
  lightbox, form error states and the placeholder-link popovers
  (WCAG 2.0/2.1 A + AA and best-practice rules).
- **Keyboard:** skip link, visible 3px focus rings (ink on light surfaces, brand
  yellow on dark — both well past 3:1), focus trapping in the drawer and
  lightbox, Escape to close, focus returned to the trigger on close.
- **Colour contrast:** all text meets AA. The logo yellow is used for large
  text, accents and dark-surface elements; a darker gold (`gold-700`) is used for
  small text on light surfaces, and the WhatsApp green was darkened to `#137a43`
  so white text clears AA.
- **Responsive:** no horizontal overflow from 320px to 1920px on any route.
- **Images:** responsive `srcSet` at 2–3 widths, lazy loading below the fold,
  explicit dimensions to prevent layout shift, descriptive alt text on every
  image, hero preloaded.
- **Motion:** `prefers-reduced-motion` disables scroll reveals and transitions, and
  swaps the home hero's moving dish corridor for a still photograph of the dining
  room — a flattened animation would otherwise freeze on its last keyframe.

Clean `npm run lint`, `npm run build` and `tsc --noEmit`.
