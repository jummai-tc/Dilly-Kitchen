/**
 * The two enquiry inboxes — admin only.
 *
 * Row Level Security grants the public `insert` on these tables and nothing
 * else, so every function here depends on a signed-in account that is on the
 * `admin_users` allow-list. Reached only from the `/admin` chunk.
 */
import { friendlyError } from '../supabaseClient'
import { adminClient, requireAdminClient } from './adminClient'

export interface CateringEnquiryRecord {
  id: string
  name: string
  email: string
  phone: string
  event_type: string
  event_date: string
  guest_count: string
  preferred_dishes: string
  notes: string
  status: string
  created_at: string
}

export interface ContactMessageRecord {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  created_at: string
}

export async function listCateringEnquiries(limit = 100): Promise<CateringEnquiryRecord[]> {
  const { data, error } = await requireAdminClient()
    .from('catering_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<CateringEnquiryRecord[]>()
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listContactMessages(limit = 100): Promise<ContactMessageRecord[]> {
  const { data, error } = await requireAdminClient()
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<ContactMessageRecord[]>()
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function setEnquiryStatus(
  table: 'catering_enquiries' | 'contact_messages',
  id: string,
  status: string,
): Promise<{ ok: boolean; message: string }> {
  if (!adminClient) return { ok: false, message: 'Supabase is not configured.' }
  const { error } = await adminClient.from(table).update({ status }).eq('id', id)
  if (error) return { ok: false, message: friendlyError(new Error(error.message)) }
  return { ok: true, message: 'Status updated.' }
}
