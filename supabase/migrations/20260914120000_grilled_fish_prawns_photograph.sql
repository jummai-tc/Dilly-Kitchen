-- ============================================================================
-- New gallery photograph: "Grilled Fish with Prawns".
--
-- A whole grilled fish under peppers and onions, crowned with prawns and
-- served with fried plantain. It is a separate plating from the existing
-- `grilled-croaker-fish` photograph — different dish presentation, different
-- platter — so it takes its own gallery row rather than replacing that one.
--
-- The image ships with the site at `/images/dishes/grilled-fish-prawns`
-- (480/800/1080), exported by `scripts/optimize-images.sh`, so this row points
-- at a repo path the way every other seeded gallery row does. Nothing is stored
-- in the `gallery` bucket for it.
--
-- The seed migration was regenerated from `src/data`, so a fresh database is
-- already correct. This migration exists for databases the old seed has been
-- applied to.
-- ============================================================================

do $$
begin
  -- Guarded so that re-running against a database which already has the row
  -- cannot shift every later photograph a second time.
  if not exists (select 1 from public.gallery_items where id = 'grilled-fish-prawns') then

    -- The photograph sits beside the other grilled fish, so everything from
    -- that slot onwards moves down one to keep the seed's ordering.
    update public.gallery_items
    set sort_order = sort_order + 1
    where sort_order >= 6
    ;

    insert into public.gallery_items (
      id, type, title, caption,
      image_path, image_widths, aspect_ratio, alt,
      video_path, sort_order, is_published
    ) values (
      'grilled-fish-prawns',
      'photo',
      'Grilled Fish with Prawns',
      'Peppers, onions and prawns over whole grilled fish, with plantain alongside.',
      '/images/dishes/grilled-fish-prawns',
      array[480, 800, 1080]::integer[],
      0.7504690431519699,
      'Whole grilled fish smothered in peppers and onions, crowned with prawns and served with fried plantain',
      null,
      6,
      true
    );

  end if;
end $$;
