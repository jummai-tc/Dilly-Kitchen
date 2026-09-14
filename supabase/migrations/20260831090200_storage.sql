-- ============================================================================
-- Storage bucket for gallery uploads
--
-- Public READ (the photographs are meant to be seen); writes restricted to the
-- admin allow-list, matching the rule in src/services/README.md that visitors
-- may only ever VIEW gallery content.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  52428800, -- 50 MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gallery: public read" on storage.objects;
create policy "gallery: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

drop policy if exists "gallery: admin upload" on storage.objects;
create policy "gallery: admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "gallery: admin update" on storage.objects;
create policy "gallery: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "gallery: admin delete" on storage.objects;
create policy "gallery: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin());
