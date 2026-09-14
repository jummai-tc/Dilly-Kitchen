-- ============================================================================
-- Row Level Security
--
-- The browser only ever holds the anon key, so these policies are the actual
-- access control. The shape required by src/services/README.md:
--
--   content tables    → public SELECT (published rows only), admin-only writes
--   enquiry tables    → public INSERT only; NO public SELECT, UPDATE or DELETE
--   admin_users       → a user may read only their own row; no public writes
--
-- RLS is enabled on every table in `public`. Anything not granted below is
-- denied by default.
-- ============================================================================

alter table public.admin_users        enable row level security;
alter table public.menu_categories    enable row level security;
alter table public.menu_items         enable row level security;
alter table public.gallery_items      enable row level security;
alter table public.testimonials       enable row level security;
alter table public.story_sections     enable row level security;
alter table public.catering_options   enable row level security;
alter table public.site_links         enable row level security;
alter table public.site_settings      enable row level security;
alter table public.catering_enquiries enable row level security;
alter table public.contact_messages   enable row level security;

-- Force RLS so even a table owner connecting directly is subject to it.
alter table public.catering_enquiries force row level security;
alter table public.contact_messages   force row level security;

-- ---------------------------------------------------------------------------
-- admin_users
--
-- A signed-in user can see whether they themselves are an admin, and nothing
-- more — no listing other admins, no adding one. Membership is granted in the
-- Supabase dashboard.
-- ---------------------------------------------------------------------------
drop policy if exists "admin_users: read own row" on public.admin_users;
create policy "admin_users: read own row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Content tables: public read of published rows, admin-only everything else.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'menu_categories', 'menu_items', 'gallery_items', 'testimonials',
    'story_sections', 'catering_options'
  ] loop
    execute format('drop policy if exists "%s: public read published" on public.%I', t, t);
    execute format(
      'create policy "%s: public read published" on public.%I
         for select to anon, authenticated using (is_published)', t, t);

    -- Admins additionally see unpublished rows so drafts are editable.
    execute format('drop policy if exists "%s: admin read all" on public.%I', t, t);
    execute format(
      'create policy "%s: admin read all" on public.%I
         for select to authenticated using (public.is_admin())', t, t);

    execute format('drop policy if exists "%s: admin insert" on public.%I', t, t);
    execute format(
      'create policy "%s: admin insert" on public.%I
         for insert to authenticated with check (public.is_admin())', t, t);

    execute format('drop policy if exists "%s: admin update" on public.%I', t, t);
    execute format(
      'create policy "%s: admin update" on public.%I
         for update to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);

    execute format('drop policy if exists "%s: admin delete" on public.%I', t, t);
    execute format(
      'create policy "%s: admin delete" on public.%I
         for delete to authenticated using (public.is_admin())', t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- site_links / site_settings — same rule, but every row is public (they carry
-- no is_published column; an unset link is expressed by is_placeholder).
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['site_links', 'site_settings'] loop
    execute format('drop policy if exists "%s: public read" on public.%I', t, t);
    execute format(
      'create policy "%s: public read" on public.%I
         for select to anon, authenticated using (true)', t, t);

    execute format('drop policy if exists "%s: admin insert" on public.%I', t, t);
    execute format(
      'create policy "%s: admin insert" on public.%I
         for insert to authenticated with check (public.is_admin())', t, t);

    execute format('drop policy if exists "%s: admin update" on public.%I', t, t);
    execute format(
      'create policy "%s: admin update" on public.%I
         for update to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);

    execute format('drop policy if exists "%s: admin delete" on public.%I', t, t);
    execute format(
      'create policy "%s: admin delete" on public.%I
         for delete to authenticated using (public.is_admin())', t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Enquiry tables
--
-- INSERT is open to the public — that is the whole point of the two forms.
-- There is deliberately NO select/update/delete policy for anon, so a visitor
-- cannot read back other people's enquiries, including their own. The insert
-- policy pins `status` to 'new' so a submitter cannot pre-close a lead.
-- ---------------------------------------------------------------------------
drop policy if exists "catering_enquiries: public insert" on public.catering_enquiries;
create policy "catering_enquiries: public insert"
  on public.catering_enquiries for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "catering_enquiries: admin read" on public.catering_enquiries;
create policy "catering_enquiries: admin read"
  on public.catering_enquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "catering_enquiries: admin update" on public.catering_enquiries;
create policy "catering_enquiries: admin update"
  on public.catering_enquiries for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catering_enquiries: admin delete" on public.catering_enquiries;
create policy "catering_enquiries: admin delete"
  on public.catering_enquiries for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "contact_messages: public insert" on public.contact_messages;
create policy "contact_messages: public insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "contact_messages: admin read" on public.contact_messages;
create policy "contact_messages: admin read"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "contact_messages: admin update" on public.contact_messages;
create policy "contact_messages: admin update"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "contact_messages: admin delete" on public.contact_messages;
create policy "contact_messages: admin delete"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table-level grants
--
-- Policies filter rows; grants decide which verbs are reachable at all. Giving
-- anon INSERT-only on the enquiry tables means a leaked policy could never turn
-- into a public read of customer contact details.
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

grant select on
  public.menu_categories, public.menu_items, public.gallery_items,
  public.testimonials, public.story_sections, public.catering_options,
  public.site_links, public.site_settings
to anon, authenticated;

grant insert, update, delete on
  public.menu_categories, public.menu_items, public.gallery_items,
  public.testimonials, public.story_sections, public.catering_options,
  public.site_links, public.site_settings
to authenticated;

grant insert on public.catering_enquiries, public.contact_messages to anon, authenticated;
grant select, update, delete on public.catering_enquiries, public.contact_messages to authenticated;

grant select on public.admin_users to authenticated;
