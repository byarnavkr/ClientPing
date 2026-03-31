import { createClient } from '@/lib/supabase/client'

export async function insertLead(fields) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name:           fields.name,
      contact:        fields.contact,
      status:         fields.status          ?? 'new',
      follow_up_date: fields.follow_up_date  ?? null,
      deal_value:     fields.deal_value       ? Number(fields.deal_value) : null,
      interval_days:  fields.interval_days    ? Number(fields.interval_days) : null,
      priority:       fields.priority        ?? 'medium',
      notes:          fields.notes           ?? null,
      user_id:        user.id,
    }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateLead(id, fields) {
  const supabase = createClient()

  const payload = {}
  if ('name'           in fields) payload.name           = fields.name
  if ('contact'        in fields) payload.contact        = fields.contact
  if ('status'         in fields) payload.status         = fields.status
  if ('follow_up_date' in fields) payload.follow_up_date = fields.follow_up_date || null
  if ('deal_value'     in fields) payload.deal_value     = fields.deal_value ? Number(fields.deal_value) : null
  if ('interval_days'  in fields) payload.interval_days  = fields.interval_days ? Number(fields.interval_days) : null
  if ('priority'       in fields) payload.priority       = fields.priority
  if ('notes'          in fields) payload.notes          = fields.notes || null

  const { data, error } = await supabase
    .from('leads')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteLead(id) {
  const supabase = createClient()
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}