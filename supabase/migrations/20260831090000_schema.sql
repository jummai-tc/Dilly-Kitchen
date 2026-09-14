-- ============================================================================
-- Dilly Kitchen — schema + Row Level Security
--
-- Follows src/services/README.md:
--   * public SELECT on the content tables
--   * public INSERT only on the two enquiry tables, and no public SELECT on them
--
-- Everything a visitor's browser touches goes through the anon key, so RLS is
-- the only thing standing between the public and the data. Nothing is granted
-- that a visitor does not need.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin identity
--
-- Membership of this table is what makes an authenticated user an admin. Rows
-- are added by hand in the Supabase dashboard (or by another admin) — there is
-- deliberately no self-service path to becoming one.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allow-list of auth users who may write content. Add rows manually; no public insert path exists.';

-- SECURITY DEFINER so RLS policies on other tables can call it without needing
-- their own read access to admin_users (and without recursing into its policy).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True when the calling user is on the admin allow-list. Used by every write policy.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Keeps updated_at honest without the client having to send it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content: menu
-- ---------------------------------------------------------------------------
create table if not exists public.menu_categories (
  id           text primary key,
  name         text not null,
  blurb        text not null default '',
  note         text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.menu_items (
  id                 text primary key,
  category_id        text not null
                       references public.menu_categories (id) on update cascade on delete restrict,
  name               text not null,
  description        text not null default '',
  -- null means "price on request"; the UI never invents a number.
  price              numeric(10, 2) check (price is null or price >= 0),
  price_note         text,
  -- Base path with no width suffix, e.g. '/images/dishes/beef-suya'.
  -- An uploaded file stores its full public URL here and leaves image_widths empty.
  image_path         text,
  image_widths       integer[] not null default '{}',
  image_aspect_ratio numeric,
  image_alt          text,
  dietary            text[] not null default '{}',
  spice_level        smallint not null default 0 check (spice_level between 0 and 3),
  options            text[] not null default '{}',
  is_featured        boolean not null default false,
  is_published       boolean not null default true,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists menu_items_category_idx on public.menu_items (category_id, sort_order);
create index if not exists menu_items_featured_idx on public.menu_items (is_featured) where is_featured;

-- ---------------------------------------------------------------------------
-- Content: gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id           text primary key,
  type         text not null check (type in ('photo', 'video')),
  title        text not null,
  caption      text not null default '',
  -- Photos: responsive base path or an uploaded file's public URL.
  -- Videos: the poster image, with video_path holding the video itself.
  image_path   text not null,
  image_widths integer[] not null default '{}',
  aspect_ratio numeric not null default 1 check (aspect_ratio > 0),
  alt          text not null default '',
  video_path   text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists gallery_items_order_idx on public.gallery_items (sort_order, created_at);

-- ---------------------------------------------------------------------------
-- Content: testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id           text primary key,
  quote        text not null,
  author       text not null,
  context      text not null default '',
  rating       smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  -- True while the row is sample copy rather than a real review. The homepage
  -- labels the section honestly when any published row is still a placeholder.
  is_placeholder boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content: Our Story and Catering page copy
-- ---------------------------------------------------------------------------
create table if not exists public.story_sections (
  id           text primary key,
  eyebrow      text not null default '',
  heading      text not null,
  paragraphs   text[] not null default '{}',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.catering_options (
  id           text primary key,
  title        text not null,
  description  text not null default '',
  icon         text not null default 'sparkle',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content: the call-to-action destinations
--
-- "Order on Uber Eats", "WhatsApp Us", "Book a table" and "Discover our menu"
-- all read their href from here, so the owner can point them somewhere new from
-- the admin panel without a redeploy. is_placeholder keeps the existing
-- "coming soon" UI honest while a URL is still unknown.
-- ---------------------------------------------------------------------------
create table if not exists public.site_links (
  key            text primary key,
  label          text not null,
  href           text not null default '',
  is_placeholder boolean not null default true,
  sort_order     integer not null default 0,
  updated_at     timestamptz not null default now()
);

-- Loose key/value for single strings the owner may want to edit: the allergen
-- notice, the pre-filled WhatsApp message templates, opening hours.
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enquiries — written by the public, readable only by admins
-- ---------------------------------------------------------------------------
create table if not exists public.catering_enquiries (
  id               uuid primary key default gen_random_uuid(),
  name             text not null check (length(trim(name)) between 2 and 120),
  email            text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  phone            text not null check (length(trim(phone)) between 6 and 40),
  event_type       text not null check (length(trim(event_type)) > 0),
  event_date       date not null,
  guest_count      text not null check (length(trim(guest_count)) > 0),
  preferred_dishes text not null default '' check (length(preferred_dishes) <= 4000),
  notes            text not null default '' check (length(notes) <= 4000),
  status           text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at       timestamptz not null default now()
);

create index if not exists catering_enquiries_created_idx on public.catering_enquiries (created_at desc);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) between 2 and 120),
  email      text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  phone      text not null default '' check (length(phone) <= 40),
  subject    text not null check (length(trim(subject)) > 0),
  message    text not null check (length(trim(message)) between 10 and 5000),
  status     text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'menu_categories', 'menu_items', 'gallery_items', 'testimonials',
    'story_sections', 'catering_options', 'site_links', 'site_settings'
  ] loop
    execute format(
      'drop trigger if exists %I on public.%I', t || '_touch_updated_at', t
    );
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.touch_updated_at()',
      t || '_touch_updated_at', t
    );
  end loop;
end;
$$;
