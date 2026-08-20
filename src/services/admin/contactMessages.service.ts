import { supabase } from '@/lib/supabase'

export interface AdminContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface AdminContactMessageFilters {
  unreadOnly?: boolean
}

export async function getAllContactMessages(
  filters: AdminContactMessageFilters = {},
): Promise<AdminContactMessage[]> {
  let query = supabase
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, is_read, created_at')
    .order('created_at', { ascending: false })

  if (filters.unreadOnly) query = query.eq('is_read', false)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as AdminContactMessage[]
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead } as never).eq('id', id)
  if (error) throw error
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) throw error
}
