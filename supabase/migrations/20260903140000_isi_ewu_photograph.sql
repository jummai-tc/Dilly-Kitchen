-- ============================================================================
-- The photograph belongs to Isi-Ewu, not Nkwobi.
--
-- The source file the business supplied was named "Nkwobi .jpeg", so the seed
-- filed that photograph under `nkwobi`. It is in fact isi-ewu — goat head in a
-- peppered palm-oil sauce — and the business has since renamed the original to
-- "Isi-Ewu .jpeg" to say so. The image files were renamed on disk to match
-- (`/images/dishes/isi-ewu`).
--
-- Nkwobi and Isi-Ewu are two different dishes, so both keep their menu rows.
-- Nkwobi simply has no photograph of its own yet, and reads as a menu row the
-- way every other unphotographed dish does. The featured slot follows the
-- photograph, since the featured strip on the homepage is a picture board.
--
-- The seed migration was regenerated from `src/data`, so a fresh database is
-- already correct. This migration exists for databases the old seed has been
-- applied to.
-- ============================================================================

-- Nkwobi keeps its menu row; the photograph was never of this dish.
update public.menu_items
set image_path = null,
    image_widths = '{}'::integer[],
    image_aspect_ratio = null,
    image_alt = null,
    is_featured = false
where id = 'nkwobi'
;

update public.menu_items
set image_path = '/images/dishes/isi-ewu',
    image_widths = array[480, 800, 1400]::integer[],
    image_aspect_ratio = 0.7714561234329798,
    image_alt = 'Isi-Ewu — tender goat head in a rich peppered palm-oil sauce, topped with sliced onions and utazi',
    is_featured = true
where id = 'isi-ewu'
;

-- The gallery shows the same photograph, so the row is renamed in place rather
-- than deleted and re-inserted — that keeps its sort_order slot.
update public.gallery_items
set id = 'isi-ewu',
    title = 'Isi-Ewu',
    caption = 'Goat head in a peppered palm-oil sauce, finished with utazi.',
    image_path = '/images/dishes/isi-ewu',
    alt = 'Isi-Ewu — tender goat head in a rich peppered palm-oil sauce, topped with sliced onions and utazi'
where id = 'nkwobi'
;
