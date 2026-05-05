'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClinicSettings(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autenticado' }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const moneda = formData.get('moneda') as string
    const logoUrl = formData.get('logoUrl') as string

    if (!id || !name) return { success: false, error: 'ID y Nombre son obligatorios' }

    const { error } = await supabase
      .from('clinics')
      .update({
        name,
        address,
        phone,
        moneda,
        logo_url: logoUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) return { success: false, error: 'Error actualizando clínica: ' + error.message }

    revalidatePath(`/superadmin/configuracion/${id}`)
    revalidatePath('/superadmin') 
    return { success: true }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado' }
  }
}

export async function updateBusinessHours(clinicId: string, hours: any[]) {
  try {
    const supabase = await createClient()

    // 1. Validation
    for (const day of hours) {
      if (!day.is_closed) {
        const open = day.open_time.slice(0, 5)
        const close = day.close_time.slice(0, 5)
        if (close <= open) {
          return { success: false, error: `La hora de cierre debe ser posterior a la de apertura (${day.day_of_week})` }
        }
      }
    }
    
    // 2. UPSERT business hours
    const { error } = await supabase
      .from('business_hours')
      .upsert(hours.map(h => ({
        ...h,
        clinic_id: clinicId,
        updated_at: new Date().toISOString()
      })), { onConflict: 'clinic_id, day_of_week' })

    if (error) return { success: false, error: 'Error guardando horarios: ' + error.message }

    revalidatePath(`/superadmin/configuracion/${clinicId}`)
    revalidatePath(`/superadmin/configuracion/${clinicId}/horarios`)
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado' }
  }
}
