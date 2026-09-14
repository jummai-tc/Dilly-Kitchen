-- ============================================================================
-- Correct the shopfront address.
--
-- The site launched with "100 Feltham Street", which is not a real street, so
-- the Google Maps directions link resolved to a neighbouring business. The
-- confirmed address is 100 High Street, Feltham, TW13 4EX — matching the
-- OpenStreetMap listing for Dilly Kitchen.
--
-- site_links is owner-editable, so the seed migration inserts its rows with
-- `on conflict (key) do nothing` and can never correct one that already exists.
-- This updates the stale row in place, and only while it still holds the wrong
-- street, so a later edit by the owner is not clobbered.
-- ============================================================================

update public.site_links
set href = 'https://www.google.com/maps/dir/?api=1&destination=Dilly+Kitchen+100+High+Street+Feltham+TW13+4EX'
where key = 'googleMapsDirections'
  and href like '%Feltham+Street%'
;
