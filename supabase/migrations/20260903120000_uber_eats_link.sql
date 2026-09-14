-- ============================================================================
-- Fill in the Uber Eats ordering link.
--
-- The site launched with a blank `uberEats` href, so every "Order on Uber Eats"
-- button fell back to the placeholder pop-up offering WhatsApp instead. The
-- business has now supplied its Uber Eats store URL.
--
-- site_links is owner-editable, so the seed migration inserts its rows with
-- `on conflict (key) do nothing` and can never fill one in after the fact.
-- This sets the row in place, and only while it is still blank, so a URL the
-- owner has already entered from the admin panel is not clobbered.
-- ============================================================================

update public.site_links
set href = 'https://www.ubereats.com/store-browse-uuid/fcd5e175-b3ae-4bff-bb7e-631f563d1035?diningMode=DELIVERY',
    is_placeholder = false
where key = 'uberEats'
  and coalesce(trim(href), '') = ''
;
