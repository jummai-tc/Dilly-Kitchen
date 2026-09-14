/**
 * Editing the call-to-action destinations — admin only.
 *
 * This is what the Links tab of the dashboard saves. The public buttons read
 * the same rows through `SiteContentProvider`, so a change here reaches every
 * "Order on Uber Eats", "WhatsApp Us" and "Book a table" button on the next
 * page load, with no redeploy.
 */
import { friendlyError } from '../supabaseClient'
import { adminClient } from './adminClient'

export async function saveSiteLink(
  key: string,
  href: string,
): Promise<{ ok: boolean; message: string; isPlaceholder: boolean }> {
  const trimmed = href.trim()
  // A blank URL puts the button back into its honest "coming soon" state
  // rather than rendering a link that goes nowhere.
  const isPlaceholder = trimmed.length === 0

  if (!adminClient) {
    return { ok: false, message: 'Supabase is not configured.', isPlaceholder }
  }

  const { error } = await adminClient
    .from('site_links')
    .update({ href: trimmed, is_placeholder: isPlaceholder })
    .eq('key', key)

  if (error) {
    return { ok: false, message: friendlyError(new Error(error.message)), isPlaceholder }
  }
  return { ok: true, message: 'Saved.', isPlaceholder }
}
