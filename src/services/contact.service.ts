import { supabase } from '@/lib/supabase'

export interface ContactMessageInput {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function submitContactMessage(input: ContactMessageInput): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(input as never)
  if (error) throw error
}
