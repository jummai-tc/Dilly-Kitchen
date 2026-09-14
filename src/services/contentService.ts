/**
 * Our Story and Catering page copy — Supabase-backed.
 *
 * Same rule as the rest of the content: public SELECT of published rows,
 * admin-only writes, and the bundled copy in `src/data` as the fallback so the
 * pages read correctly even with no backend reachable.
 */
import { cateringOptions } from '@/data/catering'
import { storySections, type StorySection } from '@/data/story'
import type { CateringOption } from '@/types'
import { readWithFallback, unwrap } from './supabaseClient'
import {
  toCateringOption,
  toStorySection,
  type CateringOptionRow,
  type StorySectionRow,
} from './rows'

export async function getStorySections(): Promise<StorySection[]> {
  return readWithFallback(
    'getStorySections',
    async (client) => {
      const rows = unwrap(
        await client
          .from('story_sections')
          .select('id, eyebrow, heading, paragraphs, sort_order')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .returns<StorySectionRow[]>(),
      )
      if (rows.length === 0) throw new Error('story_sections is empty')
      return rows.map(toStorySection)
    },
    () => storySections,
  )
}

export async function getCateringOptions(): Promise<CateringOption[]> {
  return readWithFallback(
    'getCateringOptions',
    async (client) => {
      const rows = unwrap(
        await client
          .from('catering_options')
          .select('id, title, description, icon, sort_order')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .returns<CateringOptionRow[]>(),
      )
      if (rows.length === 0) throw new Error('catering_options is empty')
      return rows.map(toCateringOption)
    },
    () => cateringOptions,
  )
}
