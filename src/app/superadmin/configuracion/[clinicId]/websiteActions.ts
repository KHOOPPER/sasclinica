'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateWebsiteSettings(settings: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('public_clinic_settings')
    .update({
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_image_url: settings.hero_image_url,
      show_services: settings.show_services,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      contact_whatsapp: settings.contact_whatsapp,
      updated_at: new Date().toISOString()
    })
    .eq('id', settings.id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/superadmin/configuracion/${settings.clinic_id}`)
  revalidatePath(`/${settings.slug}`)
  
  return { success: true }
}
