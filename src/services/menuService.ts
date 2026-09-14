/**
 * Menu data access — Supabase-backed.
 *
 * Reads `menu_categories` and `menu_items` through the anon key; RLS allows
 * public SELECT of published rows and nothing else. If Supabase is not
 * configured or a request fails, the bundled menu in `src/data/menu.ts` is
 * served so the page is never blank — see `readWithFallback`.
 *
 * The allergen notice is not here: it is an editable `site_settings` value, read
 * reactively by `useSetting('allergen_notice', …)` in MenuPage.
 */
import { menuCategories, menuItems } from '@/data/menu'
import type { MenuCategory, MenuItem } from '@/types'
import { readWithFallback, unwrap } from './supabaseClient'
import { toMenuCategory, toMenuItem, type MenuCategoryRow, type MenuItemRow } from './rows'

const CATEGORY_COLUMNS = 'id, name, blurb, note, sort_order'
const ITEM_COLUMNS =
  'id, category_id, name, description, price, price_note, image_path, image_widths, ' +
  'image_aspect_ratio, image_alt, dietary, spice_level, options, is_featured, sort_order'

export async function getMenuCategories(): Promise<MenuCategory[]> {
  return readWithFallback(
    'getMenuCategories',
    async (client) => {
      const rows = unwrap(
        await client
          .from('menu_categories')
          .select(CATEGORY_COLUMNS)
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .returns<MenuCategoryRow[]>(),
      )
      // An empty table means the seed has not run — fall back rather than
      // rendering a menu page with no categories at all.
      if (rows.length === 0) throw new Error('menu_categories is empty')
      return rows.map(toMenuCategory)
    },
    () => menuCategories,
  )
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return readWithFallback(
    'getMenuItems',
    async (client) => {
      const rows = unwrap(
        await client
          .from('menu_items')
          .select(ITEM_COLUMNS)
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .returns<MenuItemRow[]>(),
      )
      if (rows.length === 0) throw new Error('menu_items is empty')
      return rows.map(toMenuItem)
    },
    () => menuItems,
  )
}

export async function getFeaturedItems(limit = 6): Promise<MenuItem[]> {
  return readWithFallback(
    'getFeaturedItems',
    async (client) => {
      const rows = unwrap(
        await client
          .from('menu_items')
          .select(ITEM_COLUMNS)
          .eq('is_published', true)
          .eq('is_featured', true)
          .order('sort_order', { ascending: true })
          .limit(limit)
          .returns<MenuItemRow[]>(),
      )
      if (rows.length === 0) throw new Error('no featured menu items')
      return rows.map(toMenuItem)
    },
    () => menuItems.filter((item) => item.isFeatured).slice(0, limit),
  )
}
